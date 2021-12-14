import { useState, useEffect } from "react";
import { _competitionsFetched } from "../../app/competition/competitionSlice";
import { _categoriesFetched } from "../../app/competition/categorySlice";
import { useSelector } from "react-redux";

/***
 * useAll fetched will return true when all categories and competitions have been fetched.
 */
export default function useAllFetched() {
  const [fetched, setAllFetched] = useState(false);
  const competitionsFetched = useSelector(_competitionsFetched);
  const categoriesFetched = useSelector(_categoriesFetched);

  useEffect(() => {
    if (competitionsFetched && categoriesFetched) {
      setAllFetched(true);
    }
  }, [competitionsFetched, categoriesFetched]);

  return fetched;
}
