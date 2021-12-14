import React from "react";

export default function ErrorMessage({ msg, multiple }) {

  if (multiple) {
    return <div className="alert alert-danger alert-dismissible fade show text-center">
      {msg.split(".").map((e, i) => (
        <p key={`error-p-comp-${i}`} className="text-left">
          {e}
        </p>
      ))}
    </div>;
  }


  return (
    <div className="alert alert-danger alert-dismissible fade show text-center">
      {msg}
    </div>
  );

}
