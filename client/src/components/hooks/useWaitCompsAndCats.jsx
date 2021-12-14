import { useState, useEffect } from "react";
import useAllFetched from "./useAllFetched";
/**
 *
 *  this function will wait till allFetched and return a waiting var
 * @returns boolean
 */
export default function useWaitCompsAndCats() {
  const [wait, setWait] = useState(false);

  const allFetched = useAllFetched();

  useEffect(() => {
    if (allFetched) {
      setWait(false);
    }

    if (!allFetched) {
      setWait(true);
    }
  }, [allFetched]);

  return wait;
}
