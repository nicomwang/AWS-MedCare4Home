import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAppContext } from '../../libs/contextLib';
import './Home.css';
import Slider from './Slider';
export default function Home() {
  const { isAuthenticated } = useAppContext();

  function renderLander() {
    return (
      <div className='lander m-0'>
        <h1>Home Medical Care</h1>
        <p className='text-muted'>Cloud Computing Project</p>
      </div>
    );
  }

  function renderGreeting() {
    return (
      <div className='lander'>
        <Slider />
        <Row className='mt-5'>
          <Col md={12} xl={6}>
            <LinkContainer className='text-center' to='/documents/new'>
              <Card className=' document-card text-white'>
                <Card.Body>
                  <span className='h3'>Import Medical Document</span>
                </Card.Body>
              </Card>
            </LinkContainer>
          </Col>
          <Col md={12} xl={6}>
            <LinkContainer className='text-center' to='/symptoms/new'>
              <Card className='document-card text-white'>
                <Card.Body>
                  <span className='h3'>Report Symptoms</span>
                </Card.Body>
              </Card>
            </LinkContainer>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className='Home'>
      {isAuthenticated ? renderGreeting() : renderLander()}
    </div>
  );
}
