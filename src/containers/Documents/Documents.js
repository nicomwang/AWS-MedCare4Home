import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../../libs/errorLib";
import Form from "react-bootstrap/Form";
import LoaderButton from "../../components/LoaderButton";
import config from "../../config";
import "./Documents.css";
import { s3Upload } from "../../libs/awsLib";

export default function Documents() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [document, setDocument] = useState(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    function loadDocument() {
      return API.get("documents", `/documents/${id}`);
    }

    async function onLoad() {
      try {
        const document = await loadDocument();
        const { fileName, attachment } = document;

        if (attachment) {
          document.attachmentURL = await Storage.vault.get(attachment);
        }

        setFileName(fileName);
        setDocument(document);
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
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function saveDocument(document) {
    return API.put("documents", `/documents/${id}`, {
      body: document,
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
        attachment: attachment || document.attachment,
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteDocument() {
    return API.del("documents", `/documents/${id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteDocument();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Documents">
      {document && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="file Name">
            <Form.Control
              as="input"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            {document.attachment && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={document.attachmentURL}
                >
                  {formatFilename(document.attachment)}
                </a>
              </p>
            )}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
}
