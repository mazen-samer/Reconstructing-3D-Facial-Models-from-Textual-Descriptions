import React, { useContext, useEffect, useState } from "react";
import { Button, Typography, Space, Spin, Flex } from "antd";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import ModelCanvas from "../components/ModelCanvas";
import { baseUrl } from "../constants/baseUrl";
import { UserContext } from "../contexts/UserContext";

const { Title, Text } = Typography;

export default function View3dModel() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [modelText, setModelText] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);
  const location = useLocation();
  console.log(location);

  const showToastMessage = (message) => {
    toast.error(message);
  };

  const handleSaveTestimonyNoSuspect = async () => {
    const token = sessionStorage.getItem("access_token");
    const data = {
      employee_id: user.user.id,
      incident_id: user.incident.id,
      testimonial_text: location.state?.testimonyDescription,
    };
    console.log(data);
    try {
      const request = await fetch(`${baseUrl}/api/save_testimonial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const response = await request.json();
      if (request.status === 200) {
        console.log(response.message);
        navigate("/endtestimonial");
      } else {
        console.log(response.message);
        console.error(response.error);
      }
    } catch (e) {
      showToastMessage("There was an error connecting to the server.");
      console.error(e);
    }
  };

  const handleSaveTestimonyWithSuspect = async () => {
    const token = sessionStorage.getItem("access_token");
    const data = {
      employee_id: user.user.id,
      incident_id: user.incident.id,
      testimonial_text: location.state?.testimonyDescription,
      criminal_id: location.state?.selectedImg
        ? location.state.selectedImg
            .split("/")
            .pop()
            .split(".")[0]
            .split("-")[1]
        : null,
    };
    console.log(data);
    try {
      const request = await fetch(`${baseUrl}/api/save_testimonial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const response = await request.json();
      if (request.status === 200) {
        console.log(response.message);
        navigate("/endtestimonial");
      } else {
        console.log(response.message);
        console.error(response.error);
      }
    } catch (e) {
      showToastMessage("There was an error connecting to the server.");
      console.error(e);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    const generate3d = async () => {
      setLoading(true);
      const generatedImg = location.state?.generatedImg;
      if (!generatedImg) return;

      const generatedImgName = generatedImg.split("/").pop();
      const generatedModelName = generatedImgName.split(".")[0];

      try {
        const request = await fetch(
          `${baseUrl}/api/generate3d/${generatedModelName}.png`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const response = await request.json();
        if (request.status === 200) {
          console.log(response);
          const request = await fetch(
            `${baseUrl}/static/3dobjs/${generatedModelName}.obj`
          );
          if (request.status === 200) {
            const objText = await request.text();
            console.log(objText);
            setModelText(objText);
          }
        }
      } catch (error) {
        console.error("Error fetching 3D model:", error);
        showToastMessage("Error fetching 3D model.");
      } finally {
        setLoading(false);
      }
    };

    const retrieve3d = async () => {
      const selectedImg = location.state?.selectedImg;
      if (!selectedImg) return;

      const selectedImgName = selectedImg.split("/").pop();
      const selectedModelName = selectedImgName.split(".")[0];

      try {
        const response = await fetch(
          `${baseUrl}/static/3dobjs/${selectedModelName}.obj`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const objText = await response.text();
        console.log(objText);
        setModelText(objText);
      } catch (error) {
        console.error("Error fetching 3D model:", error);
        showToastMessage("Error fetching 3D model.");
      } finally {
        setLoading(false);
      }
    };

    if (!location.state) {
      return;
    } else if (location.state.generatedImg && !location.state.selectedImg) {
      console.log(
        "Generating the 3D model for generated image:",
        location.state.generatedImg
      );
      generate3d();
    } else {
      console.log(
        "Retrieving the 3D model for selected image:",
        location.state.selectedImg
      );
      retrieve3d();
    }
  }, [location.state]);

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  if (
    !location.state ||
    (!location.state.generatedImg && !location.state.selectedImg)
  ) {
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
        <ToastContainer position="top-right" theme="dark" />
        <Title level={1}>
          Please provide a description to be able to generate / view 3D models.
        </Title>
        <Link to="/">
          <Button type="primary">Go to description page.</Button>
        </Link>
      </div>
    );
  } else if (location.state.generatedImg && !location.state.selectedImg) {
    // Rendering for generating the 3D model
    return (
      <Flex
        justify="center"
        align="center"
        gap={50}
        vertical
        style={{ minHeight: "100vh" }}
      >
        <Space direction="vertical" align="center">
          <Title level={1} style={{ margin: 0 }}>
            Generating the 3D model
          </Title>
          <Text style={{ fontSize: 18, textAlign: "center" }}>
            This suspect is not in our employees and will be put in our
            undefined suspects for further investigation.
          </Text>
        </Space>
        <Flex
          gap={20}
          justify="space-between"
          align="center"
          style={{ width: 1000 }}
        >
          <img width={400} src={location.state.generatedImg} alt="Generated" />
          {loading ? (
            <Flex
              align="center"
              justify="center"
              style={{ width: 400, height: 400 }}
            >
              <Spin size="large" />
            </Flex>
          ) : (
            <>
              <ModelCanvas objText={modelText} key={refreshCount} />
              <Button onClick={handleRefresh} size="large" type="primary">
                Refresh Model
              </Button>
            </>
          )}
        </Flex>
        <Button
          size="large"
          type="primary"
          onClick={handleSaveTestimonyNoSuspect}
        >
          Continue
        </Button>
      </Flex>
    );
  } else {
    // Rendering for confirming the selection
    return (
      <Flex
        justify="center"
        align="center"
        gap={50}
        vertical
        style={{ minHeight: "100vh" }}
      >
        <Space direction="vertical" align="center">
          <Title level={1} style={{ margin: 0 }}>
            Confirming your selection
          </Title>
          <Text style={{ fontSize: 18, textAlign: "center" }}>
            The 3D model of the suspect you selected, your generated image, and
            suspect image are displayed.
          </Text>
        </Space>
        <Flex gap={20} justify="space-between" align="center">
          <img width={400} src={location.state.selectedImg} alt="Selected" />
          <Space direction="vertical" align="center">
            <ModelCanvas objText={modelText} key={refreshCount} />
            <Button onClick={handleRefresh} size="large" type="primary">
              Refresh Model
            </Button>
          </Space>
          <img width={400} src={location.state.generatedImg} alt="Generated" />
        </Flex>
        <Button
          type="primary"
          size="large"
          onClick={handleSaveTestimonyWithSuspect}
        >
          Continue
        </Button>
      </Flex>
    );
  }
}
