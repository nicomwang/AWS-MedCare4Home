import React from "react";
import { useAppContext } from "../../libs/contextLib";
import "./Home.css";



export default function Home() {
  const { isAuthenticated } = useAppContext();

  function renderLander() {
    return (
      <div className="lander">
        <h1>Home Medical Care</h1>
        <p className="text-muted">Cloud Computing Project</p>
      </div>
    );
  }

  function renderGreeting() {
    return (
      <div className="lander">
        <h1>Welcome</h1>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderGreeting() : renderLander()}
    </div>
  );
}
