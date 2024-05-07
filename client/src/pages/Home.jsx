import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import { UserContext } from "../contexts/UserContext";
import { Button } from "antd";

export default function Home() {
  const { signOut } = useContext(UserContext);

  return (
    <div>
      <Navbar />
      <Button onClick={signOut}></Button>
    </div>
  );
}
