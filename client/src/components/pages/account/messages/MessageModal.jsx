import React from "react";
import { Button, Modal, Row, Col } from "react-bootstrap";

export default function MessageModal({ msg, show, handleShow, handleClose }) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="w-100">
            <Row>
              <Col xs={2}>
                <img
                  id="ImageBorder"
                  className="rounded-circle mb-0 pb-0"
                  width="35"
                  src="/img/dashboard/messages/01.jpg"
                  alt="Comp Perofrmance"
                />
              </Col>
              <Col xs={9}>
                <div className="media-body font-size-sm mb-2">
                  <div className="d-flex align-items-center vertical-align-center pt-2">
                    <div className="text-truncate font-weight-semibold">
                      {msg?.title}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <SanitizedHTML html={body} /> */}
          <div dangerouslySetInnerHTML={{ __html: msg?.message }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
