import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { Button, Typography, Space, Form, Input, Spin, Flex } from "antd";
import { baseUrl } from "../constants/baseUrl";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Home() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);

  const handleSubmit = async (values) => {
    setImg(null);
    setLoading(true);
    const request = await fetch(`${baseUrl}/api/generateImage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, "img-id": 2000 }),
    });

    const response = await request.json();
    console.log(response);
    setImg(`${baseUrl}/${response.path}.png`);
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        minHeight: "100vh",
      }}
    >
      <Space direction="vertical" align="left" style={{ width: 600 }}>
        <Title
          style={{
            fontSize: 35,
            textAlign: "left",
          }}
        >
          Hello, {user.user.name}. You have been assigned to{" "}
          {user.incident.title} case.
        </Title>
        <Form onFinish={handleSubmit}>
          <Space direction="vertical" align="center">
            <Text type="secondary">Please enter ur culprit describtion.</Text>
            <Form.Item
              name="description"
              rules={[
                {
                  required: true,
                  message: "This field can not be empty.",
                },
              ]}
            >
              <TextArea
                disabled={loading}
                style={{
                  width: 600,
                  height: 200,
                  resize: "none",
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                {!loading ? "Submit" : "Loading your describtion..."}
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Space>
      <Flex justify="center" align="center" style={{ width: 500, height: 550 }}>
        {img ? (
          <img
            src={img}
            alt=""
            style={{ width: 500, height: 550, objectFit: "cover" }}
          />
        ) : (
          <Space>
            {loading ? (
              <Space direction="vertical" align="center">
                <Spin size="large" />
                <Text type="secondary">This can take around 5 minutes...</Text>
              </Space>
            ) : (
              <Text type="secondary">The image will appear here</Text>
            )}
            {img && !loading ? <Button>Continue</Button> : null}
          </Space>
        )}
      </Flex>
    </div>
  );
}
