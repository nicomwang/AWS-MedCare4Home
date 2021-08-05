import React, { useRef, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';
import { onError } from '../../libs/errorLib';
import { Form, Card, Row, Col } from 'react-bootstrap';
import LoaderButton from '../../components/LoaderButton';
import config from '../../config';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { s3Upload } from '../../libs/awsLib';


export default function Documents() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [document, setDocument] = useState(null);
  const [fileName, setFileName] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    function loadDocument() {
      return API.get('documents', `/documents/${id}`);
    }

    async function onLoad() {
      try {
        const document = await loadDocument();
        const { fileName, attachment, note } = document;

        if (attachment) {
          document.attachmentURL = await Storage.vault.get(attachment);
        }
        setFileName(fileName);
        setDocument(document);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return fileName.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, '');
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function saveDocument(document) {
    return API.put('documents', `/documents/${id}`, {
      body: document
    });
  }

  async function handleSubmit(event) {
    let attachment;

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
      if (file.current) {
        attachment = await s3Upload(file.current);
      }

      await saveDocument({
        fileName,
        note,
        attachment: attachment || document.attachment
      });
      history.push('/documents');
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteDocument() {
    return API.del('documents', `/documents/${id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      'Are you sure you want to delete this document?'
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteDocument();
      history.push('/documents');
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className='Documents'>
      <Row className=' m-4'>
        <Col xl={2} />
        <Col xl={8}>
          <Card>
            <Card.Header>
              <Card.Title>Edit Document</Card.Title>
            </Card.Header>
            <Card.Body>
              {document && (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId='file Name'>
                    <Form.Control
                      as='select'
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                    >
                      <option value='Vaccine Card'>Vaccine Card</option>
                      <option value='Vision Presciption'>
                        Vision Presciption
                      </option>
                      <option value='Medication Presciption'>
                        Medication Presciption
                      </option>
                      <option value='Insurance'>Insurance</option>
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
                    {document.attachment && (
                      <p>
                        <a
                          target='_blank'
                          rel='noopener noreferrer'
                          href={document.attachmentURL}
                        >
                          {formatFilename(document.attachment)}
                        </a>
                      </p>
                    )}
                    <Form.Control
                      onChange={handleFileChange}
                      type='file'
                    />
                  </Form.Group>
                  <hr />
                  <Row className='mt-3'>
                    <Col md={12} xl={6}>
                      <LoaderButton
                        block
                        size='lg'
                        type='submit'
                        className='m-md-2  m-sm-2 '
                        isLoading={isLoading}
                        disabled={!validateForm()}
                      >
                        <BsPencilSquare size={17} />
                        <span className='m-3'>Update</span>
                      </LoaderButton>
                    </Col>
                    <Col md={12} xl={6}>
                      <LoaderButton
                        block
                        size='lg'
                        variant='danger'
                        className='m-md-2 m-sm-2 '
                        onClick={handleDelete}
                        isLoading={isDeleting}
                      >
                        <BsTrash size={17} />
                        <span className='m-3'>Delete</span>
                      </LoaderButton>
                    </Col>
                  </Row>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={8} />
      </Row>
    </div>
  );
}
