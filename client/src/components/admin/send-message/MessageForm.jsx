import React, { useState } from "react";
import { saveMessageToServer } from "../../../app/message/messageSlice";
import { useDispatch } from "react-redux";

export default function MessageForm() {
  const [msg, setMsg] = useState("");
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const saveMsg = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!title) {
      setError("title is empty");
      return;
    }
    if (!msg) {
      setError("message body is empty");
      return;
    }
    const res = await dispatch(saveMessageToServer({ title, message: msg }));
    if (res.error) {
      setError("error: " + res.error);
      return;
    }

    setSuccess("success, message sent!");
    setMsg("");
    setTitle("");
  };
  return (
    <>
      <div className="col-lg-8">
        <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
          <div className="py-2 p-md-3">
            <div style={{ display: "block" }}>
              {error && (
                <div className="alert alert-danger alert-dismissible fade show text-center">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success alert-dismissible fade show text-center">
                  {success}
                </div>
              )}
            </div>

            <div className="d-sm-flex align-items-center justify-content-between pb-2">
              <h1 className="h3 mb-3 text-center text-sm-left">
                Add New Message
              </h1>
            </div>
            <p className="font-size-sm">Use normal text or HTML code.</p>
            <form className="needs-validation p-2">
              <div className="row mb-4">
                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="titleProductCreate">
                    Title:
                  </label>

                  <input
                    className="form-control"
                    type="text"
                    id="titleProductCreate"
                    placeholder="msg title"
                    name="competition.title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="titleProductCreate">
                    Message:
                  </label>

                  <textarea
                    className="form-control"
                    type="text"
                    id="titleProductCreate"
                    placeholder="An Exciting Item"
                    name="competition.title"
                    rows="10"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                className="btn btn-primary"
                type="button"
                id="btnProductSubmit"
                onClick={saveMsg}
                disabled={!msg}
              >
                Send Message to All Users
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
