import { useState, useEffect } from "react";

export default function useCountDown({ endtime }) {
  const [data, setData] = useState({
    total: null,
    days: null,
    hours: null,
    minutes: null,
    seconds: null,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const total = Date.parse(endtime) - Date.parse(new Date());
      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const days = Math.floor(total / (1000 * 60 * 60 * 24));

      setData({
        total,
        days,
        hours,
        minutes,
        seconds,
      });
    }, 1000 * 3);

    return () => clearInterval(interval);
  });

  return data;
}
