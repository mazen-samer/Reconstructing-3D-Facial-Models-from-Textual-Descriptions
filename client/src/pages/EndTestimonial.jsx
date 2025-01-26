import React, { useContext, useEffect, useState, useCallback } from "react";
import { Button, Typography, Space } from "antd";
import { UserContext } from "../contexts/UserContext";
import { baseUrl } from "../constants/baseUrl";

const { Title, Text } = Typography;

export default function EndTestimonial() {
  const { signOut, user } = useContext(UserContext);
  const [timer, setTimer] = useState(10);

  const unAssignAll = useCallback(async () => {
    try {
      const request = await fetch(
        `${baseUrl}/api/unassign_employee/${user.user.id}`,
        {
          method: "DELETE",
        }
      );
      const response = await request.json();
      if (request.status === 200) {
        console.log(response.message);
      } else {
        console.log(response);
      }
    } catch (e) {
      console.log("There was an error connecting to server.");
    }
  }, [user.user.id]);

  useEffect(() => {
    unAssignAll();
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) {
          signOut();
        } else {
          return prev - 1;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [unAssignAll, signOut]);

  console.log(timer);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <Space direction="vertical" align="center">
        <Title level={1}>Thank you for your testimony!</Title>
        <Text>
          Click on "End your testimony" button to save your testimony.
        </Text>
        <Text>You will be signed out automatically in {timer} seconds.</Text>
        <Button size="large" type="primary" onClick={unAssignAll}>
          End your testimony.
        </Button>
      </Space>
    </div>
  );
}
