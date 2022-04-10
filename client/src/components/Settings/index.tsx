import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/UserContext";
import NextLink from "next/link";
import PouchDB from "pouchdb";
import { encode } from "hex-encode-decode";
import find from "pouchdb-find";
PouchDB.plugin(find);

const Settings: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const dbName = `userdb-${encode(user.uuid)}`;
  const client = new PouchDB(`${dbName}`);

  const [graduate, setGraduate] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  const stopHandler = async () => {
    setIsLoading(true);
    const response = await axios.get(`${process.env.API_URL}/subscribe/stop`, {
      withCredentials: true,
    });
    if (response.data.user) {
      setUser(response.data.user);
    }
    if (response.data === false) {
      setErrorMessage("取消失敗");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    client.find({ selector: { number: { $gt: null } } }).then((res) => {
      console.log(res.docs.length);
    });

    client
      .find({
        selector: {
          new: false,
          due: { $gt: new Date(new Date().setDate(new Date().getDate() + 30)) },
        },
      })
      .then((res) => {
        setGraduate(res.docs.length);
      });
    //axios
    //  .get(`${process.env.API_URL}/50/statics`, { withCredentials: true })
    //  .then((res) => {
    //    setUnknown(res.data.new)
    //    setSaw(res.data.review)
    //    setGraduate(res.data.graduate)
    //  })
  }, []);

  return (
    <Box as="section" p="10">
      <Center mb="10">
        <Heading fontFamily="Kiwi Maru">Settings</Heading>
      </Center>
      <Flex my="3" flexDir="column" mx="auto" maxW="400px">
        <Heading size="md" my="2">
          會員資料
        </Heading>
        {errorMessage !== "" && (
          <Text my="1" color="red" fontWeight="bold">
            {errorMessage}
          </Text>
        )}
        <Text my="1">電子郵件：{user.email}</Text>
        <Text my="1">累積畢業卡片：{graduate}</Text>
        <Flex flexDir="row" alignItems="center">
          <Text my="1">是否訂閱：{user.role === 1 ? "是" : "否"}</Text>
          <Spacer />
          {user.role === 1 && (
            <Button
              isLoading={isLoading}
              onClick={onOpen2}
              size="xs"
              colorScheme="gray"
            >
              停止訂閱
            </Button>
          )}
        </Flex>
        <Text mt="1" mb="5">
          到期日：{user.due ? user.due.slice(0, 10) : "無"}
        </Text>

        <Flex mt="5">
          <NextLink href="/review">
            <Button size="sm" colorScheme="teal">
              前往複習
            </Button>
          </NextLink>
          <NextLink href="http://localhost:4000/subscribe/new">
            <Button size="sm" colorScheme="red" mx="2">
              訂閱
            </Button>
          </NextLink>
          <Spacer />
        </Flex>
      </Flex>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hi, 在訂閱前</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>1.NT.60/月，可隨時確認到期日。</Text>
            <Text>
              2.訂閱後會出現取消訂閱的按鈕，可以隨時取消，使用的權利以到期日為準。
            </Text>
            <Text fontWeight="bold">簡單總結一下：</Text>
            <Text>🔅 每天3個新卡週末只複習，約認識60張新卡/月。</Text>
            <Text>🔅 卡片內容選自日劇、動畫內真實對話。</Text>
            <Text>🔅 卡片會用間隔重複記憶管理複習時程。</Text>
            <br />
            <Text>感謝你的支持～有任何問題歡迎告訴我</Text>
          </ModalBody>

          <ModalFooter>
            <NextLink href={`${process.env.API_URL}/subscribe/new`}>
              <Button size="sm" colorScheme="blue" mr={3}>
                加入訂閱
              </Button>
            </NextLink>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isCentered isOpen={isOpen2} onClose={onClose2}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>取消訂閱</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>取消後使用權利仍會以到期日為準！</Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={stopHandler} size="sm" colorScheme="red" mr={3}>
              確定
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Settings;
