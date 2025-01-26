import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { Button, Typography, Space, Form, Input, Spin, Flex } from "antd";
import { baseUrl } from "../constants/baseUrl";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Home() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
  const [token, setToken] = useState(null);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    setToken(token);
  }, []);

  const showToastMessage = (message) => {
    toast.error(message);
  };

  const handleSubmit = async (values) => {
    try {
      setImg(null);
      setLoading(true);
      setDescription(values.description);
      const request = await fetch(`${baseUrl}/api/generateImage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          "img-id": `generated-${user.user.id}-${user.incident.id}`,
        }),
      });
      const response = await request.json();
      console.log(request);
      if (request.status === 200) {
        console.log(response);
        setImg(`${baseUrl}/${response.path}.png`);
        setLoading(false);
      } else {
        setLoading(false);
        showToastMessage(response.message);
        console.log(response.message);
      }
    } catch (e) {
      showToastMessage("There was an error connecting to the server.");
    }
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
      <ToastContainer position="top-right" theme="dark" />
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
          <Space direction="vertical" align="right">
            <img
              src={img}
              alt=""
              style={{ width: 500, height: 550, objectFit: "cover" }}
            />
            <div style={{ textAlign: "right", width: "100%" }}>
              <Button
                size="large"
                type="primary"
                onClick={() =>
                  navigate("/compare", {
                    state: {
                      img: img,
                      testimonyDescription: description,
                    },
                  })
                }
              >
                Continue
              </Button>
            </div>
          </Space>
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
          </Space>
        )}
      </Flex>
    </div>
  );
}
