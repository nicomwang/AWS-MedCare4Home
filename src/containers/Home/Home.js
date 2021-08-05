import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../../libs/contextLib";
import "./Home.css";
//import Slider from "./Slider";
import { GoReport, GoFile } from "react-icons/go";
import { MdAlarm } from "react-icons/md";
import { FiUsers } from "react-icons/fi";

export default function Home() {
  const { isAuthenticated } = useAppContext();

  function renderLander() {
    return (
      <div className="lander m-0">
        <h1 className="title">
          Manage Healthcare For You and Your Family On the Go.
        </h1>
        <h3 className="subtitle">
          MedCare4Home is a cloud solution to manage your healthcare data easily
          and securely.
        </h3>
      </div>
    );
  }

  function renderDashboard() {
    return (
      <div className="dashboard">
        <h1 className=" title1 text-center mt-5">
          Quick Access to Your Services
        </h1>
        <div className ="service-cards">
        <Row>
          <Col md={12} lg={6} xl={6}>
            <LinkContainer className="text-center" to="/documents/new">
              <Card className=" home-card left-card mt-5">
                <Card.Title className="mt-4 service">
                  <GoFile size={28} className="icon mr-1" /> Upload Medical
                  Documents
                </Card.Title>
                <Card.Body>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Body>
              </Card>
            </LinkContainer>
          </Col>
          <Col md={12} lg={6} xl={6}>
            <LinkContainer className="text-center" to="/symptoms/new">
              <Card className="home-card right-card mt-5">
                <Card.Title className="mt-4">
                  <GoReport size={28} className="mr-3" />
                  Report Symptom
                </Card.Title>
                <Card.Body>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Body>
              </Card>
            </LinkContainer>
          </Col>
        </Row>
        <Row >
          <Col md={12} lg={6} xl={6}>
            <LinkContainer className="text-center" to="/">
              <Card className=" home-card left-card mt-5">
                <Card.Title className="icon mt-4">
                  <MdAlarm size={28} className="mr-2" />
                  Setup Medication Reminder
                  <br />
                  (Comming Soon)
                </Card.Title>
                <Card.Body>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Body>
              </Card>
            </LinkContainer>
          </Col>
          <Col md={12} lg={6} xl={6}>
            <LinkContainer className="text-center" to="/">
              <Card className="home-card right-card mt-5">
                <Card.Title className="mt-4">
                  <FiUsers size={25} className="mr-3" />
                  Manage Family Profile <br />
                  (Comming Soon)
                </Card.Title>
                <Card.Body>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Body>
              </Card>
            </LinkContainer>
          </Col>
        </Row>
      </div>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderDashboard() : renderLander()}
    </div>
  );
}
