import React, { useState, useEffect } from "react";
import { ListGroup, Row, Col, Button, Card } from "react-bootstrap";
import { useAppContext } from "../../libs/contextLib";
import { onError } from "../../libs/errorLib";
//import "./ListSymptoms.css";
import { API, Storage } from "aws-amplify";
import { BsPencilSquare, BsPlus, BsDownload } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";

export default function ListSymptom() {
  const [symptoms, setSymptoms] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const symptoms = await loadSymptoms();
        setSymptoms(symptoms);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadSymptoms() {
    return API.get("symptoms", "/symptoms");
  }
  function loadSymptom(id) {
    return API.get("symptoms", `/symptoms/${id}`);
  }
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  function renderSymptomsList(symptoms) {
    return (
      <>
        <Row>
          <Col className="">
            <div className="row text-center">
              <LinkContainer className="text-center" to="/symptoms/new">
                <ListGroup.Item
                  action
                  className=" font-weight-bold py-auto m-4 bg-success text-white"
                >
                  <BsPlus size={30} />
                  <span className="h5 my-auto">Report Symptom</span>
                </ListGroup.Item>
              </LinkContainer>
            </div>

            <div className=" row ">
              {symptoms.length === 0 ? (
                <p className="h5 text-muted mx-auto">No symptoms reported</p>
              ) : (
                symptoms.map(
                  ({
                    symptomId,
                    symptomName,
                    symptomArea,
                    symptomDate,
                    description,
                    createdAt,
                    attachment,
                  }) => (
                    <LinkContainer
                      key={symptomId}
                      to={`/symptoms/${symptomId}`}
                    >
                      <Col className="m-4 " md={11} lg={5} xl={5}>
                        <Card className="p-3 bg-light h-100" key={symptomId}>
                          <Card.Body className="m-4">
                            <Card.Title>
                              Symptpm:
                              <span className=" h6 m-3 alert alert-primary label">
                                {symptomName}
                              </span>
                            </Card.Title>
                            <Card.Title>
                              Area:
                              <span className="m-3 h6 text-muted">{symptomArea}</span>
                            </Card.Title>
                            <Card.Title>
                              Date:
                              <span className="m-3 h6 text-muted">{symptomDate}</span>
                            </Card.Title>
                            <Card.Text className="mt-3">
                            <Card.Title>
                                Description:
                                <span className="h6">
                                  {attachment ? (
                                    <span className=" text-muted m-3">
                                      {description}
                                    </span>
                                  ) : (
                                    <span className="text-muted m-3">
                                      N/A
                                    </span>
                                  )}
                                </span>
                              </Card.Title>
                              <Card.Title> Attachment: </Card.Title>
                              <span className="h6">
                                {attachment ? (
                                  <p className="m-3">
                                    <BsDownload size={17} />
                                    <a
                                      className="m-2 mt-5"
                                      href={renderAttachmentURL(attachment)}
                                    >
                                      {" "}
                                      {formatFilename(attachment)}
                                    </a>
                                  </p>
                                ) : (
                                  <span className="text-muted">
                                    No files found
                                  </span>
                                )}
                              </span>
                            </Card.Text>
                          </Card.Body>
                          <hr />
                          <Row>
                            <Col sm={6} xl={8}>
                              <span className="text-muted text-small">
                                Created: {new Date(createdAt).toLocaleString()}
                              </span>
                            </Col>
                            <Col sm={6} xl={4}>
                              <div className=" float-right m-0">
                                <Button
                                  className="btn-warning btn-small rounded-circle btn-icons btn-rounded mx-2 float-right"
                                  onClick={() => loadSymptom(symptomId)}
                                >
                                  <BsPencilSquare size={17} />
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    </LinkContainer>
                  )
                )
              )}
            </div>
          </Col>
        </Row>
      </>
    );
  }

  function renderAttachmentURL(attchment) {
    var URL = Storage.vault.get(attchment);
    return URL;
  }

  return (
    <div className="symptoms">
      <br />
      <span className="pb-3 m-3 h2 text-center"> Your Health Symptoms</span>
      <hr />
      <ListGroup>{!isLoading && renderSymptomsList(symptoms)}</ListGroup>
    </div>
  );
}
