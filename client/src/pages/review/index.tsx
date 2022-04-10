import { useRouter } from "next/dist/client/router";
import React, { useContext, useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import Loading from "../../components/Loading";
import { UserContext } from "../../utils/UserContext";
import Cookie from "js-cookie";
import PouchDB from "pouchdb";
import find from "pouchdb-find";
import { getDueTime } from "../../utils/getDueTime";
import _ from "lodash";
import { encode } from "hex-encode-decode";
import n0 from "../../boxes/n0";
import CardView from "../../components/CardView";
PouchDB.plugin(find);

const generateDefault = (dbSizeNow: number) => {
  const data: any = [];
  for (let i = dbSizeNow + 1; i <= _.size(n0); i++) {
    data.push({
      _id: `${i.toString()}`,
      new: true,
      number: i,
      due: "",
      level: 0,
    });
  }
  console.log("new user couchdb init all cards");
  return data;
};

const Review = () => {
  const cookieCheck = Cookie.get("newCards");
  const today = new Date();
  const isWeekend = today.getDay() === 6 || today.getDay() === 0;
  const { user } = useContext(UserContext);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (!user || user.due < new Date()) {
      router.push("/settings");
    }

    if (user) {
      setMessage("與資料庫連線中");
      const dbName = `userdb-${encode(user.uuid)}`;
      const client = new PouchDB(`${dbName}`);
      const serverUrl = `http://${user.uuid}:${user.uuid}@${process.env.COUCH}/${dbName}`;
      console.log(serverUrl);

      client.replicate.from(serverUrl).on("complete", () => {
        console.log("replicate from server DONE!");
        client
          .sync(serverUrl, {
            live: true,
            retry: true,
          })
          .on("error", function (err) {
            // handle error
            console.log(err);
          });
        //if (user) {
        if (user && !cookieCheck) {
          console.log("no cookies");
          client.find({ selector: { number: { $gt: null } } }).then((res) => {
            console.log(res.docs.length);
            if (res.docs.length === 0) {
              console.log("size 0");
              setMessage("初始化資料庫中");
              client
                .bulkDocs(generateDefault(0))
                .then(() => {
                  console.log("finish init");
                })
                .then(() => {
                  console.log("deal with newcards");
                  setMessage("與資料庫同步中");
                  client
                    .createIndex({
                      index: { fields: ["number", "new"] },
                    })
                    .then(() => {
                      client
                        .find({
                          selector: {
                            number: { $gt: null },
                            new: true,
                          },
                          limit: 60,
                        })
                        .then((res) => {
                          const newCards = res.docs.map((item) => {
                            return {
                              number: item["number"],
                              due: new Date(),
                              type: "new",
                              level: 0,
                            };
                          });
                          const dueTime = getDueTime(1);
                          const random = _.shuffle(newCards);
                          const pickups = random.slice(0, 7);
                          const reviewCards = [];
                          const newCardsCookie = JSON.stringify(pickups);
                          const reviewCardsCookie = JSON.stringify(reviewCards);
                          Cookie.set("newCards", newCardsCookie, {
                            expires: dueTime,
                          });
                          Cookie.set("reviewCards", reviewCardsCookie, {
                            expires: dueTime,
                          });
                          setMessage("完成");
                          setReady(true);
                        });
                    });
                });
            } else if (res.docs.length < _.size(n0)) {
              console.log("less than n0 size");
              setMessage("初始化資料庫中");
              client
                .bulkDocs(generateDefault(res.docs.length))
                .then(() => {
                  console.log("finish add default cards");
                })
                .then(() => {
                  console.log("deal with newcards");
                  setMessage("與資料庫同步中");
                  client
                    .createIndex({
                      index: { fields: ["number", "new"] },
                    })
                    .then(() => {
                      client
                        .find({
                          selector: {
                            number: { $gt: null },
                            new: true,
                          },
                          limit: 30,
                        })
                        .then((res) => {
                          const newCards = res.docs.map((item) => {
                            return {
                              number: item["number"],
                              due: new Date(),
                              type: "new",
                              level: 0,
                            };
                          });
                          const dueTime = getDueTime(1);
                          const random = _.shuffle(newCards);
                          const pickups = random.slice(0, isWeekend ? 0 : 3);
                          const newCardsCookie = JSON.stringify(pickups);
                          Cookie.set("newCards", newCardsCookie, {
                            expires: dueTime,
                          });
                        })
                        .then(() => {
                          console.log("deal with reviewcards");
                          setMessage("與資料庫同步中");
                          client
                            .createIndex({
                              index: { fields: ["due", "new"] },
                            })
                            .then(() => {
                              client
                                .find({
                                  selector: {
                                    new: false,
                                    due: { $lt: new Date() },
                                  },
                                  sort: ["due"],
                                })
                                .then((res) => {
                                  const reviewCards = res.docs.map((item) => {
                                    return {
                                      number: item["number"],
                                      due: new Date(),
                                      type: "review",
                                      level: item["level"],
                                    };
                                  });
                                  const dueTime = getDueTime(1);
                                  const random = _.shuffle(reviewCards);
                                  const reviewCardsCookie =
                                    JSON.stringify(random);
                                  console.log("reviewCard >>>", random);
                                  Cookie.set("reviewCards", reviewCardsCookie, {
                                    expires: dueTime,
                                  });
                                  setMessage("完成");
                                  console.log("ready");
                                  setReady(true);
                                });
                            });
                        });
                    });
                });
            } else {
              console.log("deal with newcards");
              setMessage("與資料庫同步中");
              client
                .createIndex({
                  index: { fields: ["number", "new"] },
                })
                .then(() => {
                  client
                    .find({
                      selector: {
                        new: true,
                        number: { $gt: null },
                      },
                      limit: 30,
                    })
                    .then((res) => {
                      const newCards = res.docs.map((item) => {
                        return {
                          number: item["number"],
                          due: new Date(),
                          type: "new",
                          level: 0,
                        };
                      });
                      const random = _.shuffle(newCards);
                      const pickups = random.slice(0, isWeekend ? 0 : 3);
                      const newCardsCookie = JSON.stringify(pickups);
                      const dueTime = getDueTime(1);
                      Cookie.set("newCards", newCardsCookie, {
                        expires: dueTime,
                      });
                    })
                    .then(() => {
                      console.log("deal with reviewcards");
                      setMessage("與資料庫同步中");
                      client
                        .createIndex({
                          index: { fields: ["due", "new"] },
                        })
                        .then(() => {
                          client
                            .find({
                              selector: {
                                new: false,
                                due: { $lt: new Date() },
                              },
                              sort: ["due"],
                            })
                            .then((res) => {
                              const reviewCards = res.docs.map((item) => {
                                return {
                                  number: item["number"],
                                  due: new Date(),
                                  type: "review",
                                  level: item["level"],
                                };
                              });
                              const dueTime = getDueTime(1);
                              const random = _.shuffle(reviewCards);
                              const reviewCardsCookie = JSON.stringify(random);
                              console.log("reviewCard >>>", random);
                              Cookie.set("reviewCards", reviewCardsCookie, {
                                expires: dueTime,
                              });
                              setMessage("完成");
                              console.log("ready");
                              setReady(true);
                            });
                        });
                    });
                });
            }
          });
        } else {
          console.log("cookies exist!");
          setMessage("完成");
          setReady(true);
        }
      });
    }
  }, []);
  return (
    <Wrapper>
      {user && ready ? <CardView /> : <Loading message={message} />}
    </Wrapper>
  );
};

export default Review;
