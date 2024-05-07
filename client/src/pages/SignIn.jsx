import React, { useState, useContext } from "react";
import { Space, Typography, Button, Form, Input } from "antd";
import { UserContext } from "../contexts/UserContext";
const { Title, Text } = Typography;

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const { changeUser } = useContext(UserContext);

  async function handleSubmit(values) {
    setLoading(true);
    console.log(values);
    setTimeout(() => {
      setLoading(false);
      changeUser({}, {});
    }, 4000);
    // const request = await fetch();
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Space direction="vertical" align="center">
        <Title style={{ fontSize: 70, textAlign: "center", padding: "0 40px" }}>
          Reconstructing 3D Facial Models from Textual Descriptions
        </Title>
        <Form onFinish={handleSubmit}>
          <Space direction="vertical" align="center">
            <Text type="secondary">Please enter ur SSN to let you in</Text>
            <Form.Item
              name="ssn"
              rules={[
                {
                  required: true,
                  message: "This field can not be empty.",
                },
                {
                  pattern: /^\d{14}$/,
                  message: "Please enter a valid SSN.",
                },
              ]}
            >
              <Input
                style={{
                  fontSize: 25,
                  textAlign: "center",
                  width: 600,
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
                {!loading ? "Testimonify" : "Letting you in"}
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Space>
    </div>
  );
}
