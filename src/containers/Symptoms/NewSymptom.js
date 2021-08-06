import React, { useRef, useState } from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import LoaderButton from '../../components/LoaderButton';
import { onError } from '../../libs/errorLib';
import config from '../../config';
import { API } from 'aws-amplify';
import { s3Upload } from '../../libs/awsLib';
import Datetime from 'react-datetime';
import moment from 'moment';
import Rating from 'react-rating';
import 'react-datetime/css/react-datetime.css';

export default function NewSymptom() {
  const file = useRef(null);
  const history = useHistory();
  const [symptomName, setSymptomName] = useState('Abdominal Cramps');
  const [symptomArea, setSymptomArea] = useState('Head');
  const [description, setDescription] = useState('');
  const [symptomDate, setSymptomDate] = useState(
    moment(new Date()).format('MM/DD/YYYY')
  );
  const [painLevel, setPainLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const painLevelRate = [
    'No Pain',
    'Mild',
    'Moderate',
    'Severe',
    'Very Severe',
    'Worst Pain Possile'
  ];
  function validateForm() {
    return symptomName.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const attachment = file.current ? await s3Upload(file.current) : null;

      await createSymptom({
        symptomName,
        symptomArea,
        attachment,
        painLevel,
        symptomDate,
        description
      });
      setIsLoading(false);
      history.push('/symptoms');
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  function createSymptom(symptom) {
    return API.post('symptoms', '/symptoms', {
      body: symptom
    });
  }

  return (
    <div className='NewSymptom mb-5'>
      <Row className=' m-4'>
        <Col xl={2} />
        <Col xl={8}>
          <Card>
            <Card.Header>
              <Card.Title>Report Symptom</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId='symptomName'>
                  <Form.Label>Symptoms Name</Form.Label>
                  <Form.Control
                    value={symptomName}
                    as='select'
                    onChange={(e) => setSymptomName(e.target.value)}
                  >
                    <option value='Abdominal Cramps'>Abdominal Cramps</option>
                    <option value='Acne'>Acne</option>
                    <option value='Appetite Changes'>Appetite Changes</option>
                    <option value='Bladder Incontinence'>
                      Bladder Incontinence
                    </option>
                    <option value='Bruising'>Bruising</option>
                    <option value='Chill'>Chill </option>
                    <option value='Depression'>Depression</option>
                    <option value='Diarrhoea'>Diarrhoea</option>
                    <option value='Fatigue'>Fatigue</option>
                    <option value='Nausea'>Nausea</option>
                    <option value='Skin Rash'>Skin Rash </option>
                    <option value='Vomiting'>Vomiting</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId='symptomArea'>
                  <Form.Label>Which Part of your body?</Form.Label>
                  <Form.Control
                    value={symptomArea}
                    list='data'
                    as='select'
                    onChange={(e) => setSymptomArea(e.target.value)}
                  >
                    <option value='Head'>Head</option>
                    <option value='Neck'>Neck</option>
                    <option value='Back'>Back</option>
                    <option value='Muscle'>Muscle </option>
                    <option value='Stomach'>Stomach</option>
                    <option value='Legs'>Legs </option>
                    <option value='Arms'>Arms</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Pain Level</Form.Label>
                  <span className='m-3'>
                    <Rating
                      stop={6}
                      initialRating={painLevel}
                      emptySymbol={
                        <span className='theme-bar-movie '>
                          <span />
                        </span>
                      }
                      fullSymbol={
                        <span className='theme-bar-movie'>
                          <span className='theme-bar-movie-active pain-level-bar' />
                        </span>
                      }
                      onChange={(rate) => setPainLevel(rate)}
                      onHover={(rate) =>
                        (document.getElementById('pain-rating').innerHTML =
                          painLevelRate[rate - 1] ||
                          painLevelRate[painLevel - 1])
                      }
                    />
                  </span>
                  <span id='pain-rating' className=' text-primary'>
                    {' '}
                    {painLevelRate[painLevel - 1]}
                  </span>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    value={description}
                    as='textarea'
                    rows='3'
                    placeholder='describe your symptom...'
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Datetime
                    value={symptomDate}
                    timeFormat={false}
                    onChange={(e) => setSymptomDate(e.format('MM/DD/YYYY'))}
                    inputProps={{ placeholder: 'Select Date' }}
                  />
                </Form.Group>
                <Form.Group controlId='file'>
                  <Form.Label>Attachment</Form.Label>
                  <Form.Control onChange={handleFileChange} type='file' />
                </Form.Group>
                <LoaderButton
                  block
                  type='submit'
                  size='lg'
                  variant='primary'
                  isLoading={isLoading}
                  disabled={!validateForm()}
                  id='theme-color-primary'
                >
                  Create
                </LoaderButton>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={2} />
      </Row>
    </div>
  );
}
