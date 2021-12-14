import React from "react";
import ClipLoader from "react-spinners/ClipLoader";


const NewLoading = ({ size = null, color = null }) => (
  <ClipLoader color={color ? color : "#766df4"} size={size ? size : 35} />
);

export default NewLoading;
