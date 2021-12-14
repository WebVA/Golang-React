import React from "react";
// import "./loading.css";
import styled, { keyframes } from "styled-components";

const LoadingDiv = styled.div`
  width: 100%;
  height: 70vh;
  -webkit-transition: all 0.4s 0.2s ease-in-out;
  transition: all 0.4s 0.2s ease-in-out;
  background-color: #fff;
  opacity: 1;
  visibility: visible;
  z-index: 9999;
`;

const LoadingDivInner = styled.div`
  text-align: center;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  -webkit-transition: opacity 0.2s ease-in-out;
  transition: opacity 0.2s ease-in-out;
  opacity: 1;
`;

const LoadingSpan = styled.span`
  display: block;
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: normal;
  color: #737491;
`;

const spinningFrame = keyframes`
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 2.75rem;
  height: 2.75rem;
  margin-bottom: 0.75rem;
  vertical-align: text-bottom;
  border: 0.15em solid #766df4;
  border-right-color: transparent;
  border-radius: 50%;
  -webkit-animation: ${spinningFrame} 0.75s linear infinite;
  animation: ${spinningFrame} 0.75s linear infinite;
`;

export default function Loading({ width, height }) {
  const LoadingCore = () => (
    <>
      <LoadingDiv>
        <LoadingDivInner className="cs-page-loading-inner">
          <LoadingSpinner className="cs-page-spinner"></LoadingSpinner>
          <LoadingSpan>Loading...</LoadingSpan>
        </LoadingDivInner>
      </LoadingDiv>
    </>
  );
  return (
    <>
      {width && height ? (
        <div style={{ width: width, height: height }}> {LoadingCore()} </div>
      ) : (
        LoadingCore()
      )}
    </>
  );
}
