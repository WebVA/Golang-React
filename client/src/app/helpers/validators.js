/***
 * @return true if the competition is valid
 */
export const competitionValid = (c, type) => {
  if (type === "create") {
    // for create function
    let errors = "";
    if (!c.title) errors += "competition title is empty. \n";
    if (!c.price) errors += "competition price is empty. \n";
    if (!c.max_tickets_per_person)
      errors += "competition max_tickets_per_person is empty. \n";
    if (!c.number_of_tickets)
      errors += "competition number_of_tickets is empty. \n";
    if (!c.category_id) errors += "competition category_id is empty. \n";
    return errors;
  }

  return "";
};

export const quizValid = (q, type) => {
  if (type === "create") {
    let errors = "";
    if (!q.question) errors += "quiz question is empty. \n";
    if (!q.option1) errors += "quiz option1 is empty. \n";
    if (!q.option2) errors += "quiz option2 is empty. \n";
    if (!q.option3) errors += "quiz option3 is empty. \n";
    if (!q.option4) errors += "quiz option4 is empty. \n";
    if (!q.correct_answer) errors += "quiz correct_answer is empty. \n";
    return errors;
  }

  return "";
};
