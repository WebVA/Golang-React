/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";


export default function useScroll() {
  const [scrolled, setScrolled] = useState(0);

  const getDocumentHeight = () => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  };

  const calculateScrollDistance = () => {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = getDocumentHeight();

    let totalDocScrollLength = docHeight - windowHeight || 1;

    if (totalDocScrollLength < 15) {
      setScrolled(1);
      return;
    }

    const scrollPosition = Math.floor((scrollTop / totalDocScrollLength) * 100);

    if (isNaN(scrollPosition)) {
      setScrolled(0);
    } else {
      setScrolled(scrollPosition);
    }
  };
  const listenToScrollEvent = () => {
    document.addEventListener("scroll", () => {
      requestAnimationFrame(() => {
        // Calculates the scroll distance
        calculateScrollDistance();
      });
    });
  };
  useEffect(() => {
    listenToScrollEvent();
  }, []);

  return scrolled;
}
