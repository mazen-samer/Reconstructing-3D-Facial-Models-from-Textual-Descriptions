import React, { useEffect } from "react";
import { Button, Typography, Space, Spin, Flex } from "antd";
import { useLocation, Link } from "react-router-dom";

import ModelCanvas from "../components/ModelCanvas";
const { Title, Text } = Typography;

export default function View3dModel() {
  const location = useLocation();
  console.log(location);
  const { generatedImg, selectedImg } = location.state || {};
  useEffect(() => {
    if (!location.state) {
      return;
    } else if (generatedImg && !selectedImg) {
      console.log("i will generate this picture from the generation model");
    } else {
      console.log("i will just retrieve the 3d model here");
    }
  }, [selectedImg, generatedImg, location.state]);

  if (!location.state) {
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
          Please provide a description to be able to generate / view 3D models.
        </Title>
        <Link to="/">
          <Button type="primary">Go to description page.</Button>
        </Link>
      </div>
    );
  } else if (generatedImg && !selectedImg) {
    console.log(location.state);
    // will generate the 3d model here using pipeline
    return (
      <Flex justify="center" align="center" vertical>
        <Space direction="vertical" align="center"></Space>
        <Flex>
          <img src={generatedImg} alt="" />
        </Flex>
      </Flex>
    );
  } else {
    console.log(location.state);
    return (
      <Flex>
        <img src={generatedImg} alt="" />
        <img src={selectedImg} alt="" />
        <ModelCanvas />
      </Flex>
    );
  }
}
