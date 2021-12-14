import React from "react";
import { useRef, useEffect } from "react";

export default function TrustPilot() {
  const trustRef = useRef();
  useEffect(() => {
    if (window.Trustpilot) {
      window.Trustpilot.loadFromElement(trustRef.current, true);
    }
  }, []);
 
  return (
    <section className="bg-secondary pt-4 pb-4">
      <div
        className="trustpilot-widget"
        ref={trustRef}
        data-locale="en-GB"
        data-template-id="5419b6a8b0d04a076446a9ad"
        data-businessunit-id="5f67a4f0b755570001c3f195"
        data-style-height="24px"
        data-style-width="100%"
        data-theme="light"
      >
        <a
          href="https://uk.trustpilot.com/review/comp-performance.co.uk"
          target="_blank"
          rel="noopener noreferrer"
        >
          Trustpilot
        </a>
      </div>
    </section>
  );
}
