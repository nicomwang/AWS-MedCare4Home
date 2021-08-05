import React, { useState, useEffect } from 'react';
import {
  ListGroup,
  Row,
  Col,
  Table,
  Card,
  Button,
  Popover,
  OverlayTrigger
} from 'react-bootstrap';
import { useAppContext } from '../../libs/contextLib';
import { onError } from '../../libs/errorLib';
import { API, Storage } from 'aws-amplify';
import { BsPencilSquare, BsPlus, BsList, BsDownload } from 'react-icons/bs';
import { LinkContainer } from 'react-router-bootstrap';
import './Symptoms.css';
import Rating from 'react-rating';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
global.jQuery = $;

$.DataTable = require('datatables.net-bs');
require('datatables.net-responsive-bs');
export default function ListSymptom() {
  const [symptoms, setSymptoms] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const painLevelRate = [
    'No Pain',
    'Mild',
    'Moderate',
    'Severe',
    'Very Severe',
    'Worst Pain Possile'
  ];
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
    return API.get('symptoms', '/symptoms');
  }
  function loadSymptom(id) {
    return API.get('symptoms', `/symptoms/${id}`);
  }
  function formatFilename(str) {
    return str.replace(/^\w+-/, '');
  }
  function submitPainLevel(painLevel, id) {
    return API.put('symptoms', `/symptoms/painlevel/${id}`, {
      body: { painLevel }
    });
  }
  const renderDetail = ({ attachment, description }) => (
    <Popover id='popover-basic'>
      <div className='container m-3'>
        <p>
          {' '}
          Description:
          {description ? (
            <span className=' h6 label m-2'>{description}</span>
          ) : (
            <span className=' h6 label m-2 text-muted'>N/A</span>
          )}
        </p>
        <p>
          Attachment:
          <span className='h6 m-2'>
            {attachment ? (
              <p className='m-3'>
                <BsDownload size={17} />
                <a className='m-2 mt-5' href={renderAttachmentURL(attachment)}>
                  {' '}
                  {formatFilename(attachment)}
                </a>
              </p>
            ) : (
              <span className='text-muted'>No files found</span>
            )}
          </span>
        </p>
      </div>
    </Popover>
  );
  function renderSymptomsList(symptoms) {
    return (
      <>
        <Row>
          <Col className=''>
            <Row>
              <Col>
                <Card>
                  <Card.Header>
                    <Card.Title>
                      Symptom List
                      <LinkContainer className='text-center theme-color-primary' to='/symptoms/new'>
                        <Button
                          action
                          className=' font-weight-bold btn ml-4 float-right'
                        >
                          <BsPlus className='icon' size={27} />
                          <span className='h5'>Report Symptom</span>
                        </Button>
                      </LinkContainer>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className='task-data'>
                    <Table striped hover responsive>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Area</th>
                          <th>Pain Level</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {symptoms.length === 0 ? (
                          <p className='h5 text-muted mx-auto'>
                            No symptoms reported
                          </p>
                        ) : (
                          symptoms.map(
                            ({
                              symptomId,
                              symptomName,
                              symptomArea,
                              symptomDate,
                              painLevel,
                              attachment,
                              description
                            }) => (
                              <tr>
                                <td>{symptomName}</td>
                                <td>{symptomArea}</td>
                                <td>
                                  <Rating
                                    stop={6}
                                    initialRating={painLevel ? painLevel : 1}
                                    emptySymbol={
                                      <span className='theme-bar-movie'>
                                        <span />
                                      </span>
                                    }
                                    fullSymbol={
                                      <span className='theme-bar-movie-active' />
                                    }
                                    onChange={(rate) => {
                                      submitPainLevel(rate, symptomId);
                                      painLevel = rate;
                                      document.getElementById(
                                        `pain-rating-${symptomId}`
                                      ).innerHTML = painLevelRate[rate - 1];
                                    }}
                                    onHover={(rate) =>
                                      (document.getElementById(
                                        `pain-rating-${symptomId}`
                                      ).innerHTML =
                                        painLevelRate[rate - 1] ||
                                        painLevelRate[painLevel - 1])
                                    }
                                  />
                                  <div
                                    id={`pain-rating-${symptomId}`}
                                    className='current-rating-movie'
                                  >
                                    {painLevelRate[painLevel - 1]}
                                    {/* {painLevelRate[painLevel - 1]} */}
                                  </div>
                                </td>
                                <td>{symptomDate}</td>
                                <td className='d-flex justify-content-center'>
                                  <OverlayTrigger
                                    placement='bottom'
                                    overlay={renderDetail({
                                      attachment,
                                      description
                                    })}
                                  >
                                    <Button className='btn-primary btn-small rounded-circle btn-icons btn-rounded mx-2 float-right'>
                                      <BsList size={17} />
                                    </Button>
                                  </OverlayTrigger>
                                  <LinkContainer
                                    key={symptomId}
                                    to={`/symptoms/${symptomId}`}
                                  >
                                    <Button
                                      className='btn-warning btn-small rounded-circle btn-icons btn-rounded mx-2 float-right'
                                      onClick={() => loadSymptom(symptomId)}
                                    >
                                      <BsPencilSquare size={17} />
                                    </Button>
                                  </LinkContainer>
                                </td>
                              </tr>
                            )
                          )
                        )}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
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
    <div className='symptoms'>
      <br />
      <span className='pb-3 m-3 h2 text-center'> Your Health Symptoms</span>
      <hr />
      <ListGroup>{!isLoading && renderSymptomsList(symptoms)}</ListGroup>
    </div>
  );
}
