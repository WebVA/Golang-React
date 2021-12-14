import React from "react";

export default function WinnerInfoTable({ ticket }) {
  return (
    <>
      <div className="col-12  w-100">
        <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg ">
          <table className="table" style={{ fontSize: "12px" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Buyer ID</th>
                <th>Sold</th>
                <th>Sold At</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tr>
              <td>{ticket?.ID}</td>
              <td>{ticket?.buyer_id}</td>
              <td>{ticket?.sold ? "Yes" : "No"}</td>
              <td>{ticket?.UpdatedAt }</td>
              <td>
                {ticket?.CreatedAt}
                
              </td>
            </tr>
          </table>
        </div>
        {/* <pre>
          {Object.keys(ticket).map((key, i) => {
            return (
              <p>
                {" "}
                {key} == {JSON.stringify(ticket[key], null, 2)}{" "}
              </p>
            );
          })}
        </pre> */}
      </div>
    </>
  );
}
