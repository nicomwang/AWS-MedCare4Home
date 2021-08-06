import React, { useRef, useState } from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import LoaderButton from '../../components/LoaderButton';
import { onError } from '../../libs/errorLib';
import config from '../../config';
import { API } from 'aws-amplify';
import { s3Upload } from '../../libs/awsLib';

export default function NewDocument() {
  const file = useRef(null);
  const history = useHistory();
  const [fileName, setFileName] = useState('Vaccine Card');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return fileName.length > 0;
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

      await createDocument({ fileName, attachment, note });
      setIsLoading(false);
      history.push('/documents');
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  function createDocument(document) {
    return API.post('documents', '/documents', {
      body: document
    });
  }

  return (
    <div className='NewDocument mb-5'>
      <Row className=' m-4'>
        <Col xl={2} />
        <Col xl={8} lg={8} >
          <Card>
            <Card.Header>
              <Card.Title>Add Document</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId='fileName'>
                  <Form.Label>File name</Form.Label>
                  <Form.Control
                    value={fileName}
                    as='select'
                    onChange={(e) => setFileName(e.target.value)}
                  >
                    <option value='Vaccine Card'>Vaccine Card</option>
                    <option value='Vision Prescription'>
                      Vision Prescription
                    </option>
                    <option value='Medical Prescription'>
                      Medical Prescription
                    </option>
                    <option value='Insurance'>Insurance Card</option>
                    <option value='Immunization Record'>
                      Immunization Record
                    </option>
                    <option value='Hospital Bill'>Hospital Bill</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    value={note}
                    as='textarea'
                    rows='3'
                    placeholder='add some note for your document...'
                    onChange={(e) => setNote(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId='file'>
                  <Form.Label>Attachment</Form.Label>
                  <Form.Control
                    onChange={handleFileChange}
                    required
                    type='file'
                  />
                </Form.Group>
                <LoaderButton 
                  block
                  type='submit'
                  size='lg'
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
