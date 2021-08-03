import React, { useState, useEffect } from 'react';
import { ListGroup, Row, Col, Button, Card } from 'react-bootstrap';
import { useAppContext } from '../../libs/contextLib';
import { onError } from '../../libs/errorLib';
import './ListDocuments.css';
import { API, Storage } from 'aws-amplify';
import {
  BsPencilSquare,
  BsFolderSymlink,
  BsPlus,
  BsDownload
} from 'react-icons/bs';
import { LinkContainer } from 'react-router-bootstrap';
import NewDocument from './NewDocument';
import Documents from './Documents';

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
        documents.map((doc) => {
          getAttachment(doc.attachment).then((result) => {
            doc.attachmentURL = result;
          });
        });
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  async function getAttachment(attachment) {
    var attachmentURL;
    await Storage.vault.get(attachment).then(function (result) {
      attachmentURL = result;
    });
    return attachmentURL;
  }
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
              <LinkContainer className='text-center' to='/documents/new'>
                <ListGroup.Item
                  action
                  className=' font-weight-bold py-auto m-4 bg-success text-white'
                >
                  <BsPlus size={40} />
                  <span className='h3 my-auto'>Add Document</span>
                </ListGroup.Item>
              </LinkContainer>
            </div>

            <div className=' row '>
              {documents.length === 0 ? (
                <p className='h4 text-muted mx-auto'>There is no document</p>
              ) : (
                documents.map(
                  ({
                    documentId,
                    fileName,
                    createdAt,
                    attachment,
                    attachmentURL
                  }) => (
                    // <LinkContainer
                    //   key={documentId}
                    //   to={`/documents/${documentId}`}
                    // >

                    <Col className='m-4 ' md={12} xl={5}>
                      <Card className='p-3 bg-light h-100' key={documentId}>
                        <Card.Body className='m-4'>
                          <Card.Title>
                            Type:
                            {/* {attachmentURL ? attachmentURL : 'no URL'} */}
                            <span className='  m-3 alert alert-primary label'>
                              {fileName}
                            </span>
                          </Card.Title>
                          <Card.Text className='mt-3'>
                            <Card.Title> Attachment: </Card.Title>
                            {attachment ? (
                              <p className='m-3'>
                                <BsDownload size={17} />
                                <a
                                  // target='_blank'
                                  // rel='noopener noreferrer'
                                  href={attachmentURL}
                                >
                                  {' '}
                                  {formatFilename(attachment)}
                                </a>
                              </p>
                            ) : (
                              <span className='text-muted'>No files found</span>
                            )}
                          </Card.Text>
                        </Card.Body>
                        <hr />
                        <Row>
                          <Col sm={6} xl={8}>
                            <span className='text-muted text-small'>
                              Created: {new Date(createdAt).toLocaleString()}
                            </span>
                          </Col>
                          <LinkContainer
                            key={documentId}
                            to={`/documents/${documentId}`}
                          >
                            <Col sm={6} xl={4}>
                              <div className=' float-right m-0'>
                                <Button
                                  className='btn-warning btn-small rounded-circle btn-icons btn-rounded mx-2 float-right'
                                  onClick={() => loadDocument(documentId)}
                                >
                                  <BsPencilSquare size={17} />
                                </Button>

                                {/* <Button
                                className='btn-danger btn-small rounded-circle btn-icons btn-rounded mx-2 float-right'
                                onClick={(e) => deleteDocument(documentId)}
                              >
                                <BsTrash size={17} />
                              </Button> */}
                              </div>
                            </Col>
                          </LinkContainer>
                        </Row>
                      </Card>
                    </Col>
                  )
                )
              )}
            </div>
          </Col>
        </Row>
      </>
    );
  }

  function renderLander() {
    return (
      <div className='lander'>
        <h1>Home Medical Care</h1>
        <p className='text-muted'>Cloud Computing Project</p>
      </div>
    );
  }
  function renderDocuments() {
    return (
      <div className='documents'>
        <span className='pb-3 m-5 h2 text-center'>Your Health Documents</span>
        <hr />
        <ListGroup>{!isLoading && renderDocumentsList(documents)}</ListGroup>
      </div>
    );
  }

  return (
    <div className='Home'>
      {isAuthenticated ? renderDocuments() : renderLander()}
    </div>
  );
}
