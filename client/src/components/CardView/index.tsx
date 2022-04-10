import { Text, Box, Center } from "@chakra-ui/react";
import Mousetrap from "mousetrap";
import React, { useContext, useEffect, useState } from "react";
import n0 from "../../boxes/n0";
import AnswerButton from "./AnswerButton";
import Back from "./Back";
import Front from "./Front";
import NextButton from "./NextButton";
import Cookie from "js-cookie";
import { getDueTime } from "../../utils/getDueTime";
import Cookies from "js-cookie";
import Finish from "./Finish";
import { getDueTime10min } from "../../utils/getDueTime10min";
import PouchDB from "pouchdb";
import { UserContext } from "../../utils/UserContext";
import { encode } from "hex-encode-decode";

const interval = {
  0: 1,
  1: 1,
  2: 2,
  3: 3,
  4: 5,
  5: 8,
  6: 13,
  7: 21,
  8: 30,
  9: 60,
};

interface CardViewProps {}

const CardView: React.FC<CardViewProps> = ({}) => {
  console.log("Cookies new cards", Cookie.get("newCards"));
  console.log("Cookies review cards", Cookie.get("reviewCards"));
  const { user } = useContext(UserContext);
  const dbName = `userdb-${encode(user.uuid)}`;
  const client = new PouchDB(`${dbName}`);

  const [newCards, setNewCards] = useState(JSON.parse(Cookie.get("newCards")));
  const [reviewCards, setReviewCards] = useState(
    JSON.parse(Cookie.get("reviewCards"))
  );
  console.log("New Cards:", newCards);
  console.log("Review Cards:", reviewCards);

  const [finish, setFinish] = useState(
    newCards.length === 0 && reviewCards.length === 0
  );
  const [newOrReview, setNewOrReview] = useState(
    newCards.length === 0 ? false : true
  );
  const [chosenCard, setChosenCard] = useState(
    newOrReview ? newCards[0] : reviewCards[0]
  );
  console.log("Chosen card:", chosenCard);
  const [isAnswered, setIsAnswer] = useState(false);

  // let audio: any
  // if (!finish) {
  //   audio = new Audio(`/n0/${n0[chosenCard.number].path}`)
  // }

  // const play = () => {
  //   if (!finish) {
  //     audio.pause()
  //     audio.currentTime = 0
  //     audio.play()
  //   }
  // }
  // const stop = () => {
  //   if (!finish) {
  //     audio.pause()
  //     audio.currentTime = 0
  //   }
  // }

  // const replayHandler = () => {
  //   play()
  // }

  const nextHandler = (): void => {
    setIsAnswer(!isAnswered);

    if (newCards.length === 0 && reviewCards.length === 0) {
      setFinish(true);
    }

    // next card logic
    if (newCards.length > 0 && reviewCards.length === 1) {
      setChosenCard(newCards[0]);
    } else if (newCards.length > 0 && reviewCards.length > 1) {
      setChosenCard(newOrReview ? newCards[0] : reviewCards[0]);
      setNewOrReview(!newOrReview);
    } else if (newCards.length > 0 && reviewCards.length === 0) {
      setChosenCard(newCards[0]);
    } else {
      setChosenCard(reviewCards[0]);
    }
  };

  const dueTime = getDueTime(1);

  const answerHandler = (answer: string): void => {
    if (answer === "remember") {
      if (chosenCard.type === "new") {
        const newNewCards = newCards;
        newNewCards.shift();
        setNewCards(newNewCards);

        Cookies.set("newCards", newNewCards, { expires: dueTime });

        client.get(`${chosenCard.number.toString()}`).then((doc) => {
          return client.put({
            _id: `${chosenCard.number.toString()}`,
            _rev: doc._rev,
            due: getDueTime(interval[chosenCard.level]),
            level:
              chosenCard.level < 9 ? chosenCard.level + 1 : chosenCard.level,
            new: false,
            number: chosenCard.number,
          });
        });

        setIsAnswer(!isAnswered);
      } else if (chosenCard.type === "review") {
        //db
        const newReviewCards = reviewCards;
        newReviewCards.shift();
        setReviewCards(newReviewCards);
        Cookies.set("reviewCards", newReviewCards, { expires: dueTime });

        client.get(`${chosenCard.number.toString()}`).then((doc) => {
          return client.put({
            _id: `${chosenCard.number.toString()}`,
            _rev: doc._rev,
            due: getDueTime(interval[chosenCard.level]),
            level:
              chosenCard.level < 9 ? chosenCard.level + 1 : chosenCard.level,
            new: false,
            number: chosenCard.number,
          });
        });
        setIsAnswer(!isAnswered);
      }
    } else if (answer === "forget") {
      if (chosenCard.type === "new") {
        // remove from newCards first card
        const newNewCards = newCards;
        newNewCards.shift();
        setNewCards(newNewCards);
        // add due time and push to reviewCards's end
        const updateCard = {
          ...chosenCard,
          due: getDueTime10min(),
          type: "review",
        };
        const newReviewCards = reviewCards;
        newReviewCards.push(updateCard);
        // update state and cookies
        setReviewCards(newReviewCards);
        Cookies.set("newCards", newNewCards, { expires: dueTime });
        Cookies.set("reviewCards", newReviewCards, { expires: dueTime });

        setIsAnswer(!isAnswered);
      } else if (chosenCard.type === "review") {
        // remove from first card
        const newReviewCards = reviewCards;
        newReviewCards.shift();
        // add due time, reset level,  and push to end
        const updateCard = {
          ...chosenCard,
          due: getDueTime10min(),
          level: 0,
        };
        newReviewCards.push(updateCard);
        // update state and cookies
        setReviewCards(newReviewCards);
        Cookies.set("reviewCards", newReviewCards, { expires: dueTime });

        setIsAnswer(!isAnswered);
      }
    }
  };

  useEffect(() => {
    if (!isAnswered) {
      stop();
    }
    if (isAnswered) {
      // play()
    }
  }, [isAnswered, newCards]);

  return (
    <Center
      maxW="1200px"
      minH="500px"
      w={["100%", "100%", "100%", "100%"]}
      h={["80vh", "80vh", "90vh", "90vh"]}
    >
      <Box
        w={["85%", "60%", "70%", "60%"]}
        h={["90%", "90%", "90%", "90%"]}
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.200"
        shadow="md"
      >
        {!isAnswered && !finish && (
          <>
            <Box h="82%">
              <Front kotoba={n0[chosenCard.number].kotoba} />
            </Box>

            <Box h="13%">
              <AnswerButton answer={answerHandler} />
            </Box>
            <Center h="5%">
              <Text mb="2">
                New: {newCards.length} / Review: {reviewCards.length}
              </Text>
            </Center>
          </>
        )}
        {isAnswered && !finish && (
          <>
            <Box h="82%">
              <Back
                kotoba={n0[chosenCard.number].kotoba}
                furi={n0[chosenCard.number].furi}
                tw={n0[chosenCard.number].tw}
                rei={n0[chosenCard.number].rei}
                reiFuri={n0[chosenCard.number].reiFuri}
                reiImi={n0[chosenCard.number].reiTw}
              />
            </Box>
            <Box h="13%">
              <NextButton next={nextHandler} />
            </Box>
            <Center h="5%">
              <Text mb="2">
                New: {newCards.length} / Review: {reviewCards.length}
              </Text>
            </Center>
          </>
        )}

        {finish && (
          <Box h="100%">
            <Finish />
          </Box>
        )}
      </Box>
    </Center>
  );
};

export default CardView;
