import dotenv from "dotenv";
dotenv.config();

import express from "express";

// for session
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

import userRouter from "./routers/user";
import subRouter from "./routers/subscribe";

import { __prod__ } from "./constants";

const RedisStore = connectRedis(session);
export const redis = new Redis(process.env.REDIS_URL);

const main = async () => {
  const app = express();

  app.set("proxy", 1);
  app.use(express.json());
  //cors
  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  );

  //app.use(
  //  cors({
  //    origin: process.env.CORS_ORIGIN,
  //    credentials: true,
  //  })
  //)

  //session
  app.use(
    session({
      name: "tangobox",
      store: new RedisStore({
        client: redis,
        disableTTL: true,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
        domain: __prod__ ? ".tangobox.app" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      resave: false,
    })
  );
  app.use("/user", userRouter);
  app.use("/subscribe", subRouter);

  app.get("/", (_, res) => {
    res.send("hi");
  });

  app.listen(process.env.PORT, () => {
    console.log("express is on 4000");
  });
};

main();
