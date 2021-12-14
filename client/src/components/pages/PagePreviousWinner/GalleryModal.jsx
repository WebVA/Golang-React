import React, { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";

export default function GalleryModal({ imgs, current, show, handleClose }) {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    setImages([...imgs]);
  }, [imgs]);

  useEffect(() => {
    setCurrentImage(current);
  }, [current]);
  return (
    <>
      <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={2}>
              <div
                onClick={() => {
                  let prev = images.indexOf(currentImage);
                  if (prev - 1 < 0) {
                    prev = images.length - 1;
                  } else {
                    prev = prev - 1;
                  }
                  setCurrentImage(images[prev]);
                }}
              >
                prev
              </div>
            </Col>
            <Col>
              <img
                src={currentImage || ""}
                alt="gallery item"
              />
            </Col>

            <Col md={2}>
              <div
                onClick={() => {
                  let next = images.indexOf(currentImage);
                  if (next + 1 >= images.length) {
                    next = 0;
                  } else {
                    next = next + 1;
                  }
                  setCurrentImage(images[next]);
                }}
              >
                next
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}
