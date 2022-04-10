import express from "express";
import { PrismaClient } from "@prisma/client";
import uniqid from "uniqid";
import jwt from "jwt-simple";
import axios from "axios";
import { redis } from "../index";
import { v4 } from "uuid";
import { FORGOT_PASSWORD_PREFIX } from "../constants";
import sendEmail from "../utils/sendEmail";
import bcrypt from "bcrypt";
import PouchDB from "pouchdb";
import { getDueTime } from "../utils/getDueTime";

const router = express.Router();
const prisma = new PrismaClient();
const server = new PouchDB(`${process.env.COUCH_SERVER}/_users`);

const couchAddUser = async (uuid: string) => {
  await server
    .put({
      _id: `org.couchdb.user:${uuid}`,
      name: uuid,
      password: uuid,
      roles: [],
      type: "user",
    })
    .then(() => {
      console.log("couch user created");
    })
    .catch((err) => {
      console.log(err);
    });
};

router.post("/login", async (req, res) => {
  const { content } = req.body;
  const user = await prisma.user.findUnique({
    where: { email: content.email },
  });
  console.log(user);

  if (!user) {
    res.send({
      error: { field: "email", message: "登入失敗，請確認Email或密碼" },
    });
    return;
  }

  if (!user.password) {
    res.send({
      error: { field: "email", message: "登入失敗，請確認Email或密碼" },
    });
    return;
  }

  const valid = await bcrypt.compare(content.password, user.password!);
  if (!valid) {
    res.send({
      error: { field: "email", message: "登入失敗，請確認Email或密碼" },
    });
    return;
  }

  req.session.userId = user.id.toString();
  res.send({
    user: {
      email: user.email,
      uuid: user.uuid,
      role: user.role,
      due: user.due,
    },
  });
});

router.post("/register", async (req, res) => {
  const { content } = req.body;

  if (!content.token) {
    res.send({
      error: { field: "re", message: "auth failed!" },
    });
    return;
  }

  const recaptcha = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA}&response=${content.token}`
  );

  if (!recaptcha.data.success || recaptcha.data.action !== "signup") {
    res.send({
      error: { field: "re", message: "auth failed!" },
    });
    return;
  }

  if (await prisma.user.findFirst({ where: { email: content.email } })) {
    res.send({
      error: { field: "email", message: "電子郵件已被使用" },
    });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(content.password, salt);
  const uuid = uniqid.time();

  const user = await prisma.user.create({
    data: {
      uuid,
      email: content.email,
      password: hashedPassword,
      due: getDueTime(30),
    },
  });

  await couchAddUser(uuid);
  req.session.userId = user.id.toString();
  res.send({
    user: {
      email: user.email,
      uuid: user.uuid,
      role: user.role,
      due: user.due,
    },
  });
});

router.post("/google", async (req, res) => {
  const { content } = req.body;
  const check = await jwt.decode(content.token, "secret", true);
  if (check.email !== content.email) {
    res.send({
      error: {
        field: "auth",
        message: "驗證失敗",
      },
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email: content.email },
  });

  if (!user) {
    const uuid = uniqid.time();
    const newUser = await prisma.user.create({
      data: {
        uuid,
        email: content.email,
        due: getDueTime(30),
      },
    });

    await couchAddUser(uuid);
    req.session.userId = newUser!.id.toString();
    res.send({
      user: {
        email: newUser.email,
        uuid: newUser.uuid,
        role: newUser.role,
        due: newUser.due,
      },
    });
  }

  if (user) {
    req.session.userId = user!.id.toString();
    res.send({
      user: {
        email: user.email,
        uuid: user.uuid,
        role: user.role,
        due: user.due,
      },
    });
  }
});

router.post("/facebook", async (req, res) => {
  const { content } = req.body;
  const check = await axios.get(
    `https://graph.facebook.com/me?access_token=${content.token}`
  );
  if (content.id !== check.data.id) {
    res.send({
      error: {
        field: "auth",
        message: "驗證失敗",
      },
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: content.email },
  });

  if (!user) {
    const uuid = uniqid.time();
    const newUser = await prisma.user.create({
      data: {
        uuid,
        email: content.email,
        due: getDueTime(30),
      },
    });

    await couchAddUser(uuid);
    req.session.userId = newUser!.id.toString();
    res.send({
      user: {
        email: newUser.email,
        uuid: newUser.uuid,
        role: newUser.role,
        due: newUser.due,
      },
    });
    return;
  }

  req.session.userId = user.id.toString();
  res.send({
    user: {
      email: user.email,
      uuid: user.uuid,
      role: user.role,
      due: user.due,
    },
  });
});

router.get("/valid", async (req, res) => {
  if (req.session.userId) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.session.userId) },
    });
    if (user) {
      res.send({
        user: {
          email: user.email,
          uuid: user.uuid,
          role: user.role,
          due: user.due,
        },
      });
    } else {
      res.send(false);
    }
  } else {
    res.send(false);
  }
});

router.post("/forget", async (req, res) => {
  const { content } = req.body;
  const user = await prisma.user.findUnique({
    where: { email: content.email },
  });

  if (!user) {
    res.send(true);
    return;
  }
  const token = v4();
  await redis.set(
    FORGOT_PASSWORD_PREFIX + token,
    user.id,
    "ex",
    1000 * 60 * 60
  );

  const subject = "Reset Password";
  const emailContent = `
    <p>Hi,</p>
    <p>這是重置密碼的<a href="https://tangobox.app/forget/${token}" _target="blank">連結</a></p>
    <p>https://tangobox.app/forget/${token}</p>
    <p>請在一個小時內使用。</p>
    `;
  await sendEmail(user.email, subject, emailContent);
  res.send(true);
});

router.post("/change", async (req, res) => {
  const { content } = req.body;
  if (content.newPassword.length < 8) {
    res.send({
      error: {
        field: "newPassword",
        message: "密碼長度需至少8碼",
      },
    });
  }
  const userId = await redis.get(FORGOT_PASSWORD_PREFIX + content.token);
  if (!userId) {
    res.send({
      error: {
        field: "token",
        message: "連結無效",
      },
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(content.newPassword, salt);
  const user = await prisma.user.update({
    where: { id: parseInt(userId!) },
    data: {
      password: hashedPassword,
    },
  });

  if (!user) {
    res.send({
      error: {
        field: "token",
        message: "用戶不存在",
      },
    });
  }
  res.send({ user });
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.clearCookie("tangobox").status(200).send(true);
  });
});

router.get("/allusers", async (req, res) => {
  if (req.session.userId === "1") {
    const users = await prisma.user.findMany();
    res.send(users);
  }
});
export default router;
