import React from "react";
import { formatDateToShow } from "../../../../app/helpers/utils";

export default function SingleMessage({
  msg,
  handleModalShow,
  select_Message,
}) {
  if (!msg) {
    return <></>;
  }
  return (
    <>
      {/* <!-- Message--> */}
      <tr id="item-message-1" className="w-100">
        {/* <td className="py-3 align-middle pl-2 pr-0" style={{ width: "2.5rem" }}>
          <div className="custom-control custom-checkbox ml-2 mr-0">
            <input
              className="custom-control-input"
              type="checkbox"
              id={"message-" + msg.ID}
              data-checkbox-toggle-classname="bg-faded-primary"
              data-target="#item-message-1"
            />
            <label
              className="custom-control-label"
              htmlFor={"message-" + msg.ID}
            ></label>
          </div>
        </td> */}
        <td className="py-3 align-middle">
          <a
            className="media d-block d-sm-flex align-items-center text-decoration-none"
            href="#"
          >
            <img
              id="ImageBorder"
              className="rounded-circle mb-2 mb-sm-0"
              width="42"
              src="/img/dashboard/messages/01.jpg"
              alt="Comp Perofrmance"
            />
            <div
              className="media-body font-size-sm pl-sm-3"
              onClick={() => {
                select_Message(msg.ID);
                handleModalShow();
              }}
            >
              <div className="d-sm-flex text-heading align-items-center">
                <div className="d-flex align-items-center">
                  <div
                    className="text-truncate font-weight-semibold"
                    style={{ maxWidth: "10rem" }}
                  >
                    Comp Performance
                  </div>
                </div>
                <div className="ml-sm-auto text-muted font-size-xs">
                  {formatDateToShow(msg.CreatedAt)}
                </div>
              </div>
              <div className="pt-1 text-heading">
                {/* <SanitizedHTML html={msg.message} /> */}
                {/* <div dangerouslySetInnerHTML={{ __html: msg.message }} /> */}
                <div>{msg?.title}</div>
              </div>
            </div>
          </a>
        </td>
      </tr>
    </>
  );
}
