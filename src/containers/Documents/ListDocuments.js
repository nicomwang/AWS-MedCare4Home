import React, { useState, useEffect } from 'react';
import { ListGroup, Row, Col, Button, Card } from 'react-bootstrap';
import { useAppContext } from '../../libs/contextLib';
import { onError } from '../../libs/errorLib';
import { API, Storage } from 'aws-amplify';
import { BsPencilSquare, BsPlus, BsDownload } from 'react-icons/bs';
import { LinkContainer } from 'react-router-bootstrap';

export default function ListDocument() {
  const [documents, setDocuments] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const documents = await loadDocuments();
        setDocuments(documents);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadDocuments() {
    return API.get('documents', '/documents');
  }
  function loadDocument(id) {
    return API.get('documents', `/documents/${id}`);
  }
  function formatFilename(str) {
    return str.replace(/^\w+-/, '');
  }
  function renderDocumentsList(documents) {
    return (
      <>
        <Row>
          <Col className=''>
            <div className='row text-center'>
              <LinkContainer id='theme-color-primary' className='text-center button' to='/documents/new'>
                <ListGroup.Item
                  action
                  className=' font-weight-bold py-auto m-4 text-white'
                >
                  <BsPlus size={27} className="icon" />
                  <span className='h5'>Add Document</span>
                </ListGroup.Item>
              </LinkContainer>
            </div>

            <div className=' row '>
              {documents.length === 0 ? (
                <p className='h5 text-muted mx-auto'>There is no document</p>
              ) : (
                documents.map(
                  ({ documentId, fileName, note, createdAt, attachment }) => (
                    <LinkContainer
                      key={documentId}
                      to={`/documents/${documentId}`}
                    >
                      <Col className='' md={12} lg={6} xl={6}>
                        <Card className='p-3 m-2 bg-light' key={documentId}>
                          <Card.Body className=''>
                            <Card.Title>
                              Type:
                              <span className=' h6 m-3 alert alert-primary label'>
                                {fileName}
                              </span>
                            </Card.Title>
                            <Card.Title> </Card.Title>
                            <Card.Text className='mt-3'>
                              <Card.Title>
                                Note:
                                <span className='h6'>
                                  {note ? (
                                    <span className=' text-muted m-3'>
                                      {note}
                                    </span>
                                  ) : (
                                    <span className='text-muted m-3'>N/A</span>
                                  )}
                                </span>
                              </Card.Title>
                              <Card.Title> Attachment: </Card.Title>
                              <span className='h6'>
                                {attachment ? (
                                  <p className='m-3'>
                                    <BsDownload size={17} className="icon" />
                                    <a
                                      className='m-2 mt-5'
                                      href={renderAttachmentURL(attachment)}
                                    >
                                      {' '}
                                      {formatFilename(attachment)}
                                    </a>
                                  </p>
                                ) : (
                                  <span className='text-muted'>
                                    No files found
                                  </span>
                                )}
                              </span>
                            </Card.Text>
                          </Card.Body>
                          <hr />
                          <Row>
                            <Col sm={6} xl={8}>
                              <span className='text-muted text-small'>
                                Created: {new Date(createdAt).toLocaleString()}
                              </span>
                            </Col>
                            <Col sm={6} xl={4}>
                              <div className=' float-right m-0'>
                                <Button
                                  className='btn-warning btn-small rounded-circle btn-icons btn-rounded mx-2 float-right'
                                  onClick={() => loadDocument(documentId)}
                                >
                                  <BsPencilSquare size={18} />
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
    <div className='documents'>
      <br />
      <span className='pb-3 m-3 h2 text-center service-title'> Medical Documents</span>
      <hr />
      <ListGroup>{!isLoading && renderDocumentsList(documents)}</ListGroup>
    </div>
  );
}
