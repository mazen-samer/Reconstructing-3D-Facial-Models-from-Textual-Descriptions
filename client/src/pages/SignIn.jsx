import React, { useState, useContext } from "react";
import { Space, Typography, Button, Form, Input } from "antd";
import { UserContext } from "../contexts/UserContext";
import { baseUrl } from "../constants/baseUrl";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const { changeUser } = useContext(UserContext);
  const navigate = useNavigate();

  const showToastMessage = (message) => {
    toast.error(message);
  };
  async function handleSubmit(values) {
    setLoading(true);
    console.log(values);
    setTimeout(async () => {
      try {
        const request = await fetch(
          `${baseUrl}/api/last_assigned_case/${values.ssn}`
        );
        const response = await request.json();
        if (request.status === 200) {
          console.log(response);
          setLoading(false);
          changeUser(response.employee, response.incident);
          sessionStorage.setItem("access_token", response.access_token);
          navigate("/");
        } else {
          setLoading(false);
          console.log(response.message);
          // setMessage(response.message);
          showToastMessage(response.message);
        }
      } catch (e) {
        setLoading(false);
        showToastMessage("There was an error connecting to the server.");
        // setMessage("There was an error connecting to the server.");
        console.log(e);
      }
    }, 2000);
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
      <ToastContainer position="bottom-center" theme="dark" />
      <Space direction="vertical" align="center">
        <Title
          type="primary"
          style={{ fontSize: 70, textAlign: "center", padding: "0 40px" }}
        >
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
                // {
                //   pattern: /^\d{14}$/,
                //   message: "Please enter a valid SSN.",
                // },
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
                {!loading ? "Testify" : "Letting you in"}
              </Button>
            </Form.Item>
            {/* {message === "" ? null : <Text type="danger">{message}</Text>} */}
          </Space>
        </Form>
      </Space>
    </div>
  );
}
