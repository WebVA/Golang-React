import React from "react";

export default function WinnerInfoTable({ winner }) {
  return (
    <>
      <div className="col-12  w-100">
        <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg ">
          <table className="table" style={{ fontSize: "12px" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Stripe Customer ID</th>
                <th>Address</th>
              </tr>
            </thead>
            <tr>
              <td>{winner?.ID}</td>
              <td>{winner?.email}</td>
              <td>{winner?.first_name + " " + winner?.last_name}</td>
              <td>
                {winner?.address?.address_line + "  , " + winner?.address?.city}
                <br />
                {winner?.address?.zip_code}
              </td>
            </tr>
          </table>
        </div>
        {/* <pre>
          {Object.keys(winner).map((key, i) => {
            return (
              <p>
                {" "}
                {key} == {JSON.stringify(winner[key], null, 2)}{" "}
              </p>
            );
          })}
        </pre> */}
      </div>
    </>
  );
}
