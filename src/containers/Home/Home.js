import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../../libs/contextLib";
import { onError } from "../../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";

export default function Home() {
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
    return API.get("documents", "/documents");
  }
 
  function renderDocumentsList(documents) {
    return (
      <>
        <LinkContainer to="/documents/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new document</span>
          </ListGroup.Item>
        </LinkContainer>
        {documents.map(({ documentId, fileName, createdAt }) => (
          <LinkContainer key={documentId} to={`/documents/${documentId}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {fileName.trim().split("\n")[0]}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Home Medical Care</h1>
        <p className="text-muted">Cloud Computing Project</p>
      </div>
    );
  }

  function renderDocuments() {
    return (
      <div className="documents">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Health Documents</h2>
        <ListGroup>{!isLoading && renderDocumentsList(documents)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderDocuments() : renderLander()}
    </div>
  );
}