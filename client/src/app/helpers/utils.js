export function formatDateToShow(d) {
  const _d = new Date(d);
  return _d.toLocaleString().replace(/(.*)\D\d+/, "$1");
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function countdown(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total: Math.abs(total),
    days: Math.abs(days),
    hours: Math.abs(hours),
    minutes: Math.abs(minutes),
    seconds: Math.abs(seconds),
  };
}

// shuffle array
export function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/**
 *
 * @param {date} d
 * @return {boolean} true if date has been passed, false otherwise, null in case of error
 */
export const isDatePassed = (d) => {
  const date = new Date(d).getTime();
  if (isNaN(date)) {
    return;
  }

  const now = Date.now();

  if (date < now) {
    return true;
  }
  return false;
};

export const createdLessThanWeekAgo = (d) => {
  const week = 86400000;
  const date = new Date(d).getTime();
  if (isNaN(date)) {
    return;
  }

  const now = Date.now();
  const diff = now - date;

  if (diff <= week) {
    return true;
  }

  return false;
};

export const sortInDescendingOrder = (arr) => {
  if (!Array.isArray(arr)) return;
  arr.slice().sort((a, b) => {
    const x = a.ID;
    const y = b.ID;
    return y - x;
  });
  // return arr;
};

/**
 * 
 * @param {string|number} price 
 * @returns price with 2 decimal points, it adds £ sign automatically
 */
export const displayPrice = (price) => {
  if (!price) return "£0.00"
  else if (isNaN(Number(price))) return "£0.00"
  else return "£" + Number(price).toFixed(2)
};


/**
 * 
 * @param {number |string} price 
 * @returns convert price into integer without any loss due to any rounding
 */
export const convertFloatPriceToInt = (price) => {
  const x1 = Number(price);
  // const x100 = x1 * 100;
  const fixed = x1.toFixed(2);
  return Number(fixed);
}

/**
 * 
 * @param {number |string} price 
 * @returns convert price  integer into normal price without any loss due to any rounding
 */
export const convertIntPriceToNormal = (intPrice) => {
  const x1 = Number(intPrice);
  const x100 = x1 / 100;
  const fixed = x100.toFixed(2);
  return Number(fixed);
}