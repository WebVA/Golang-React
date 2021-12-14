/* eslint-disable react-hooks/exhaustive-deps */
import CategoryCarousel from "./CategoryCarousel";
import Features from "./Features";
import FeaturedProducts from "./FeaturedProducts";
import NewArrivals from "./NewArrivals";
import TrendingCompetitions from "../competitions/TrendingCompetitions";
import NewsLetterForm from "./NewsLetterForm";
// import TrustPilot from "./TrustPilot.jsx";
import useWaitCompsAndCats from "../../hooks/useWaitCompsAndCats.jsx";
import { useState, useEffect } from "react";
import Loading from "../layout/Loading";
import useScreenSize from '../../hooks/useScreenSize'

export default function HomePage() {
  const [wait, setWait] = useState(true);
  const allFetched = useWaitCompsAndCats();
  const screen = useScreenSize();

  useEffect(() => {
    if (allFetched) {
      if (screen === 'phone') {
        setTimeout(() => {
          setWait(false);
        }, 1000);
      } else {
        setTimeout(() => {
          setWait(false);
        }, 500);
      }
    }

  }, [allFetched]);

  return (
    <>
      {wait ? <Loading /> : <></>}
      <div style={{ display: wait ? "none" : "block" }}>
        <FeaturedProducts limit={3} />
        <CategoryCarousel />
        <div style={{ display: "block", height: "10vh" }}></div>
        <TrendingCompetitions limit={4} />
        <NewArrivals limit={6} />
        <Features />
        {/* <TrustPilot /> */}
        <NewsLetterForm />
      </div>
    </>
  );
}
