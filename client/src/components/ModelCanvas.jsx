import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stage, PresentationControls, OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Box3, Vector3 } from "three";
import { baseUrl } from "../constants/baseUrl";

function Model({ obj }) {
  return obj ? <primitive object={obj} scale={0.007} /> : null;
}

export default function ModelCanvas({ id }) {
  const [obj, setObj] = useState(null);
  const [cameraPosition, setCameraPosition] = useState([0, 0, 500]);
  const canvasSize = [400, 400];
  useEffect(() => {
    const fetchObj = async () => {
      try {
        const response = await fetch(`${baseUrl}/static/3dobjs/1`);
        const objText = await response.text();
        const loader = new OBJLoader();
        const loadedObj = loader.parse(objText);
        const boundingBox = new Box3().setFromObject(loadedObj);
        const center = boundingBox.getCenter(new Vector3());

        loadedObj.position.sub(center);

        setObj(loadedObj);
      } catch (error) {
        console.error("Error loading OBJ file:", error);
      }
    };

    fetchObj();
  }, []);

  useEffect(() => {
    if (obj) {
      const boundingBox = new Box3().setFromObject(obj);
      const center = boundingBox.getCenter(new Vector3());
      const distance = Math.max(
        boundingBox.max.x - boundingBox.min.x,
        boundingBox.max.y - boundingBox.min.y,
        boundingBox.max.z - boundingBox.min.z
      );

      const newCameraPosition = [center.x, center.y, 150 + distance];

      setCameraPosition(newCameraPosition);
    }
  }, [obj]);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 45, position: cameraPosition }}
      style={{
        width: canvasSize[0],
        height: canvasSize[1],
      }}
    >
      <directionalLight position={[5, 5, 20]} intensity={0.8} />
      <PresentationControls speed={1}>
        <Stage environment={"studio"}>
          <Model obj={obj} />
        </Stage>
        <OrbitControls enableZoom />
      </PresentationControls>
    </Canvas>
  );
}
