import axios from "axios";
import React, { useContext, useEffect } from "react";
import Wrapper from "../components/Wrapper";
import { UserContext } from "../utils/UserContext";
import Landing from "../components/Landing";

const Index = () => {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const validate = async () => {
      axios
        .get(`${process.env.API_URL}/user/valid`, {
          withCredentials: true,
        })
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    validate();
  }, []);
  return (
    <Wrapper>
      <Landing />
    </Wrapper>
  );
};

export default Index;
