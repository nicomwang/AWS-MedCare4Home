import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import "./Settings.css";
import LoaderButton from "../../components/LoaderButton";

export default function Settings() {
  return (
    <div className="Settings">
      <LinkContainer to="/settings/password">
        <LoaderButton block bsSize="large">
          Change Password
        </LoaderButton>
      </LinkContainer>      
    </div>
  );
}