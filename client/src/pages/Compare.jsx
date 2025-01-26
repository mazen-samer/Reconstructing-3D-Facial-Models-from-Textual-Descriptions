import React, { useEffect, useState } from "react";
import { Button, Typography, Space, Spin, Carousel } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { baseUrl } from "../constants/baseUrl";

const { Title, Text } = Typography;

export default function Compare() {
  const location = useLocation();
  const navigate = useNavigate();
  const [imgId, setImgId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imgs, setImgs] = useState([]);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);

  const { img, testimonyDescription } = location.state || {};
  console.log(testimonyDescription);
  const imgName = img ? img.split("/").pop() : "";

  const showToastMessage = (message) => {
    toast.error(message);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    setToken(token);
    if (imgName) {
      const getImages = async () => {
        setLoading(true);
        console.log(token);
        try {
          const request = await fetch(`${baseUrl}/api/compare/${imgName}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const response = await request.json();
          if (request.status === 200) {
            console.log(response);
            setImgs(response.data);
            // setImgs(["employee-1.png", "employee-2.png"]);
            setLoading(false);
          } else {
            setLoading(false);
            showToastMessage(response.message);
            console.log(response.error);
            console.log(response);
            setMessage("Error :/, please try again.");
          }
        } catch (e) {
          setLoading(false);
          showToastMessage("There was an error connecting to the server.");
          setMessage("Server down xo.");
          console.log(e);
        }
      };
      getImages();
    }
  }, [imgName, token]);

  if (!img) {
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
        <Title level={1}>
          Please provide a description to be able to compare images.
        </Title>
        <Link to="/">
          <Button type="primary">Go to description page</Button>
        </Link>
      </div>
    );
  }

  const afterChange = (current) => {
    setImgId(current);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <ToastContainer position="top-right" theme="dark" />
      <Space direction="vertical" align="center" style={{ marginBottom: 20 }}>
        <Title level={1} style={{ margin: 0 }}>
          Using the image we generated based on your description:
        </Title>
        <Text style={{ fontSize: 18, textAlign: "center" }}>
          Please select the closest picture from our employees database on the
          left.
        </Text>
        <Text style={{ fontSize: 18, textAlign: "center" }}>
          If none matches your description / picture, click on "Skip" button.
        </Text>
        <Text type="secondary" italic style={{ fontSize: 15 }}>
          You can drag the images or click on the bars at the bottom...
        </Text>
      </Space>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-evenly",
          width: "100vw",
        }}
      >
        <Space direction="vertical" align="center">
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 400,
                height: 448,
              }}
            >
              <Space direction="vertical" align="center">
                <Spin size="large" />
                <Text>Please wait while we load the pictures...</Text>
              </Space>
            </div>
          ) : imgs.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: 400,
                height: 448,
              }}
            >
              {message === "" ? (
                <>
                  <Text style={{ textAlign: "center" }}>
                    We could not find any similar pictures to your predescribed
                    image. <br />
                    Proceed to next step?
                  </Text>
                  <br />
                  <Button
                    type="primary"
                    onClick={() =>
                      navigate("/view3d", {
                        state: {
                          generatedImg: img,
                          selectedImg: null,
                          testimonyDescription,
                        },
                      })
                    }
                  >
                    Proceed
                  </Button>
                </>
              ) : (
                <Text style={{ textAlign: "center" }}>{message}</Text>
              )}
            </div>
          ) : (
            <>
              <Carousel
                afterChange={afterChange}
                style={{ width: 400, height: 400 }}
                arrows
                draggable={true}
              >
                {imgs.map((img, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "400px",
                      height: "400px",
                    }}
                  >
                    <img
                      src={`${baseUrl}/static/imgs/${img}`}
                      alt={`${index}`}
                      style={{
                        width: "400px",
                        height: "400px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </Carousel>
              <Space>
                <Button
                  size="large"
                  type="primary"
                  onClick={() =>
                    navigate("/view3d", {
                      state: {
                        generatedImg: img,
                        selectedImg: `${baseUrl}/static/imgs/${imgs[imgId]}`,
                        testimonyDescription,
                      },
                    })
                  }
                >
                  Select no.{imgId + 1}
                </Button>
                <Button
                  size="large"
                  type="default"
                  style={{ backgroundColor: "transparent" }}
                  onClick={() =>
                    navigate("/view3d", {
                      state: {
                        generatedImg: img,
                        selectedImg: null,
                        testimonyDescription,
                      },
                    })
                  }
                >
                  Skip
                </Button>
              </Space>
            </>
          )}
        </Space>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 400,
            height: 400,
          }}
        >
          <img
            src={img}
            alt=""
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </div>
  );
}
