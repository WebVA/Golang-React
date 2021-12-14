import { shuffle, isDatePassed } from "./utils";

export function findTrendingCompetitions(competitions) {
  if (!Array.isArray(competitions)) {
    return null;
  }
  const result = [];

  competitions.forEach((c) => {
    const finished = isDatePassed(c.end_time);
    if (finished != null) {
      if (!finished && c.trending) {
        result.push(c);
      }
    }
  });

  return result;
}

/**
 *
 * @param {array} competitions
 * @return {array } running competitions
 */
export function findRunningCompetitions(competitions) {
  if (!Array.isArray(competitions)) {
    return null;
  }

  const result = [];

  competitions.forEach((c) => {
    const finished = isDatePassed(c.end_time);
    if (finished != null) {
      if (!finished) {
        result.push(c);
      }
    }
  });

  return result;
}

export function findRunningCompetitionsWithSameCategory(competitions, catID) {
  if (!Array.isArray(competitions)) {
    return null;
  }

  const result = [];

  competitions.forEach((c) => {
    const finished = isDatePassed(c.end_time);
    if (finished != null) {
      if (!finished && c.category?.ID === Number(catID)) {
        result.push(c);
      }
    }
  });

  return result;
}

export function findAllCompetitionsWithSameCategory(competitions, catID) {
  if (!Array.isArray(competitions)) {
    return null;
  }

  const result = [];

  competitions.forEach((c) => {
    if (c.category?.ID === Number(catID)) {
      result.push(c);
    }
  });

  return result;
}

export function findFeaturedCompetitions(competitions) {
  if (!Array.isArray(competitions)) {
    return null;
  }
  const result = [];

  competitions.forEach((c) => {
    const finished = isDatePassed(c.end_time);
    if (finished != null) {
      if (!finished && c.featured) {
        result.push(c);
      }
    }
  });

  return result;
}

export function findNewCompetitions(competitions) {
  if (!Array.isArray(competitions)) {
    return null;
  }
  const result = findRunningCompetitions(competitions);

  const sorted = result.sort((a, b) => {
    if (Number(a.ID) >= Number(b.ID)) {
      return -1;
    }
    return +1;
  });

  return sorted;
}

export function findNewCompetitionsWithWinners(competitions) {
  if (!Array.isArray(competitions)) {
    return null;
  }

  const result = [];

  competitions.forEach((c) => {
    const finished = isDatePassed(c.end_time);
    if (finished != null) {
      if (finished && c.winner?.ID) {
        result.push(c);
      }
    }
  });

  return result;
}

export function findYouMightLikCompetitions(competitions, catID) {
  if (!Array.isArray(competitions)) {
    return [];
  }

  const withCategory = findRunningCompetitionsWithSameCategory(
    competitions,
    catID
  );
  const running = findRunningCompetitions(competitions);
  let len = 0;

  const suggestions = [];
  const IDsInSuggestions = [];

  for (const i in withCategory) {
    const c = withCategory[i];
    if (!IDsInSuggestions.includes(c.ID)) {
      IDsInSuggestions.push(c.ID);
      suggestions.push(c);
    }
  }

  const max = Math.min(running.length, 10);

  while (suggestions.length < max) {
    let index = Math.floor(Math.random() * Math.floor(max));
    const c = running[index];
    if (!IDsInSuggestions.includes(c.ID)) {
      IDsInSuggestions.push(c.ID);
      suggestions.push(c);
    }
  }

  const result = shuffle([...suggestions]);
  return result.slice(0, 4);
}

export function sortDesc(competitions) {}

export function findAllFinishedCompetitionsWithNoWinner(competitions) {
  if (!Array.isArray(competitions)) {
    return null;
  }

  const result = [];

  competitions.forEach((c) => {
    const finished = isDatePassed(c.end_time);
    if (finished != null) {
      if (finished && !c.winner?.ID) {
        result.push(c);
      }
    }
  });

  return result;
}

export function findMorePreviousWinnersSuggestions(competitions) {
  if (!Array.isArray(competitions)) {
    return null;
  }

  const result = [];

  competitions.forEach((c) => {
    const finished = isDatePassed(c.end_time);
    if (finished != null) {
      if (finished && c.winner?.ID) {
        result.push(c);
      }
    }
  });

  const shuffled = shuffle([...result]);

  return shuffled;
}

export function isCompetitionFinished(comp) {
  return isDatePassed(comp.end_time);
}
