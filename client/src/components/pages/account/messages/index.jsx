/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import SideBar from "../SideBar";
import BackgroundSvg from "../BackgroundSvg";
import SingleMessage from "./SingleMessage";
import {
  _messages,
  getAllMessagesFromServer,
} from "../../../../app/message/messageSlice";
import { _profile } from "../../../../app/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import MessageModal from "./MessageModal";

export default function AccountMessages() {
  const messages = useSelector(_messages);
  const { ID: userId } = useSelector(_profile);
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(5);
  const [show, setShow] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const select_Message = (ID) => {
    const m = messages.find((msg) => Number(msg.ID) === Number(ID));
    if (m.ID) {
      setSelectedMessage({ message: m?.message, title: m.title });
    }
  };

  useEffect(() => {
    (async () => {
      dispatch(getAllMessagesFromServer(userId));
    })();
  }, [0]);

  const slicedMessages = messages.slice(0, limit);
  return (
    <>
      <BackgroundSvg />
      <MessageModal
        msg={selectedMessage}
        show={show}
        handleShow={handleModalShow}
        handleClose={handleModalClose}
      />
      {/* <!-- Page content--> */}
      <div
        className="container bg-overlay-content pb-4 mb-md-3"
        style={{ marginTop: "-350px" }}
      >
        <div className="row">
          {/* <!-- Sidebar--> */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <SideBar />
          </div>
          {/* <!-- Content--> */}
          <div className="col-lg-8">
            <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
              <div className="py-2 p-md-3">
                {/* <!-- Title --> */}
                <div className="d-sm-flex align-items-center justify-content-between pb-2 text-center text-sm-left">
                  <h1 className="h3 mb-3 text-nowrap">
                    Messages
                    {/* <span className="d-inline-block align-middle bg-faded-success text-success font-size-ms font-weight-medium rounded-sm py-1 px-2 ml-2">
                      1
                    </span> */}
                  </h1>
                </div>
                {/* <!-- Toolbar--> */}
                {/* <div className="d-flex align-items-center justify-content-between bg-secondary py-2 px-3">
                  <div className="py-1">
                    <div className="custom-control custom-checkbox">
                      <input
                        className="custom-control-input"
                        type="checkbox"
                        id="select-all"
                        data-master-checkbox-for="#message-list"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="select-all"
                      >
                        Select all
                      </label>
                    </div>
                  </div>
                  <div className="py-1">
                    <div className="btn-group dropdown">
                      <button
                        className="dropdown-toggle btn btn-light btn-sm"
                        type="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Actions
                      </button>
                      <div
                        className="dropdown-menu dropdown-menu-right"
                        style={{}}
                      >
                        <a className="dropdown-item" href="#">
                          <i className="fe-eye-off mr-2"></i>Mark unread
                        </a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item text-danger" href="#">
                          <i className="fe-trash-2 mr-2"></i>Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* <!-- Message list (table)--> */}
                <table className="table table-hover border-bottom">
                  <tbody id="message-list">
                    {slicedMessages?.map((msg, i) => (
                      <SingleMessage
                        msg={msg}
                        key={"msg-" + i}
                        handleModalShow={handleModalShow}
                        select_Message={select_Message}
                      />
                    ))}
                  </tbody>
                </table>

                {/* <!-- Pagination--> */}
                <nav className="d-md-flex justify-content-between align-items-center text-center text-md-left pt-3">
                  <div className="d-md-flex align-items-center w-100">
                    <span className="font-size-sm text-muted mr-md-3">
                      Showing{" "}
                      {limit > messages?.length ? messages?.length : limit} of{" "}
                      {messages.length} messages
                    </span>
                    <div
                      className="progress w-100 my-3 mx-auto mx-md-0"
                      style={{ maxWidth: "10rem", height: "4px" }}
                    >
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${
                            messages.length > 0
                              ? Math.floor((limit / messages.length) * 100)
                              : 0
                          }%`,
                        }}
                        aria-valuenow={
                          messages.length > 0
                            ? Math.floor((limit / messages.length) * 100)
                            : 0
                        }
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  {messages.length > limit && (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      type="button"
                      onClick={() => setLimit(limit * 2)}
                    >
                      Load older messages
                    </button>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
