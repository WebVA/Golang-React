import React, {useState} from "react";
import { Modal, InputGroup } from "react-bootstrap";

export default function CouponModal({ show, handleClose, handleApply }) {
  const [couponCode, setCouponCode] = useState('');
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="w-100">
            Coupon Code
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="needs-validation">
            <InputGroup>
              <input
                className="form-control"
                type="text"
                placeholder="Your coupon code"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                required
              />
              <div className="input-group-append">
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    if (couponCode) {
                      e.preventDefault();
                      handleApply(couponCode);
                    }
                  }}
                >
                  Apply code
                </button>
              </div>
            </InputGroup>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
