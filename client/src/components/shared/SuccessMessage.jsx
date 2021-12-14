import React from 'react'

export default function ErrorMessage({msg}) {
    return (
      <div className="alert alert-success alert-dismissible fade show text-center">
        {msg}
      </div>
    );
}
