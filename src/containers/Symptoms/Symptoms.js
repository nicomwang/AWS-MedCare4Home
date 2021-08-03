import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../../libs/errorLib";
import { Form, Card, Row, Col } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import config from "../../config";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import "./Symptoms.css";
import { s3Upload } from "../../libs/awsLib";
import Datetime from "react-datetime";
import moment from "moment";
import "react-datetime/css/react-datetime.css";

export default function Symptoms() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [symptom, setSymptom] = useState(null);
  const [symptomName, setSymptomName] = useState("");
  const [symptomArea, setSymptomArea] = useState("");
  const [description, setDescription] = useState("");
  const [symptomDate, setSymptomDate] = useState(moment(new Date()).format("MM/DD/YYYY"));


  useEffect(() => {
    function loadSymptom() {
      return API.get("symptoms", `/symptoms/${id}`);
    }

    async function onLoad() {
      try {
        const symptom = await loadSymptom();
        const { symptomName, symptomArea, symptomDate, attachment, description } =
          symptom;

        if (attachment) {
          symptom.attachmentURL = await Storage.vault.get(attachment);
        }

        setSymptomName(symptomName);
        setSymptomArea(symptomArea);
        setSymptom(symptom);
        setSymptomDate(symptomDate);
        setDescription(description);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return symptomName.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function saveSymptom(symptom) {
    return API.put("symptoms", `/symptoms/${id}`, {
      body: symptom,
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

      await saveSymptom({
        symptomName,
        symptomArea,
        symptomDate,
        description,
        attachment: attachment || symptom.attachment,
      });
      history.push("/symptoms");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteSymptom() {
    return API.del("symptoms", `/symptoms/${id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this symptom?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteSymptom();
      history.push("/symptoms");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Symptoms">
      <Row className=" m-4">
        <Col xl={2} />
        <Col xl={8}>
          <Card>
            <Card.Header>
              <Card.Title>Edit Symptom</Card.Title>
            </Card.Header>
            <Card.Body>
              {symptom && (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="symptomName">
                    <Form.Label>Symptoms Name</Form.Label>
                    <Form.Control
                      value={symptomName}
                      as="select"
                      onChange={(e) => setSymptomName(e.target.value)}
                    >
                      <option value="Abdominal Cramps">Abdominal Cramps</option>
                      <option value="Acne">Acne</option>
                      <option value="Appetite Changes">Appetite Changes</option>
                      <option value="Bladder Incontinence">
                        Bladder Incontinence
                      </option>
                      <option value="Bruising">Bruising</option>
                      <option value="Chill">Chill </option>
                      <option value="Depression">Depression</option>
                      <option value="Diarrhoea">Diarrhoea</option>
                      <option value="Fatigue">Fatigue</option>
                      <option value="Nausea">Nausea</option>
                      <option value="Skin Rash">Skin Rash </option>
                      <option value="Vomiting">Vomiting</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="symptomArea">
                    <Form.Label>Which Part of your body?</Form.Label>
                    <Form.Control
                      value={symptomArea}
                      list="data"
                      as="select"
                      onChange={(e) => setSymptomArea(e.target.value)}
                    >
                      <option value="Head">Head</option>
                      <option value="Neck">Neck</option>
                      <option value="Back">Back</option>
                      <option value="Muscle">Muscle </option>
                      <option value="Stomach">Stomach</option>
                      <option value="Legs">Legs </option>
                      <option value="Arms">Arms</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      value={description}
                      as="textarea"
                      rows="3"
                      placeholder="add some description for your symptom..."
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Datetime
                    value={symptomDate}
                    timeFormat={false}
                    onChange={(e) => setSymptomDate(e.format("YYYY-MM-DD"))}
                    inputProps={{ placeholder: "Select Date" }}
                  />
                </Form.Group>
                  <Form.Group controlId="file">
                    <Form.Label>Attachment</Form.Label>
                    {symptom.attachment && (
                      <p>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={symptom.attachmentURL}
                        >
                          {formatFilename(symptom.attachment)}
                        </a>
                      </p>
                    )}
                    <Form.Control onChange={handleFileChange} type="file" />
                  </Form.Group>
                  <hr />
                  <Row className="mt-3">
                    <Col md={12} xl={6}>
                      <LoaderButton
                        block
                        size="lg"
                        type="submit"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                      >
                        <BsPencilSquare size={17} />
                        <span className="m-3">Update</span>
                      </LoaderButton>
                    </Col>
                    <Col md={12} xl={6}>
                      <LoaderButton
                        block
                        size="lg"
                        variant="danger"
                        onClick={handleDelete}
                        isLoading={isDeleting}
                      >
                        <BsTrash size={17} />
                        <span className="m-3">Delete</span>
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
