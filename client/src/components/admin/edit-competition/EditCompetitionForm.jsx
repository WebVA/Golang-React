import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  _categories,
  getAllCategoriesFromServer,
} from "../../../app/competition/categorySlice";
import { _loading } from "../../../app/appState/appSlice";
import { updateCompetition, _competitions, updateQuiz } from "../../../app/competition/competitionSlice";
import Loading from "../../pages/layout/Loading";
// import { competitionValid, quizValid } from "../../../app/helpers/validators";
import {
  emptyCompetition,
  emptyCategory,
  emptyQuiz,
} from "../../../app/helpers/default-types";
import { isDatePassed } from "../../../app/helpers/utils.js";

export default function EditCompetitionForm({ compToEdit }) {
  const categories = useSelector(_categories);
  const loading = useSelector(_loading);
  const dispatch = useDispatch();
  const [competition, setCompetition] = useState({ ...emptyCompetition });
  const competitions = useSelector(_competitions)

  const [category, setCategory] = useState({ ...emptyCategory });

  const [quiz, setQuiz] = useState({ ...emptyQuiz });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (categories && categories.length === 0) {
      dispatch(getAllCategoriesFromServer());
    }
  }, [categories]);

  useEffect(() => {
    if (compToEdit) {
      setCompetition({ ...compToEdit });
      const cat = compToEdit?.category?.ID ? compToEdit.category : categories?.find(c => c.ID === compToEdit.category_id);
      setCategory({ ...cat });
      setQuiz({ ...compToEdit?.quiz });
    }
  }, [compToEdit, categories, competitions]);

  // useEffect(() => {
  //   if (categories) {
  //     setCategory({ name: categories[0].name, ID: categories[0].ID });
  //   }
  // }, [categories]);

  const onFormChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const [first, second] = name.split(".");
    // eslint-disable-next-line default-case
    switch (first) {
      case "competition": {
        setCompetition({ ...competition, [second]: e.target.value });
        break;
      }
      case "category": {
        setCategory({ ...category, [second]: e.target.value });
        break;
      }
      case "quiz": {
        setQuiz({ ...quiz, [second]: e.target.value });
        break;
      }
    }
  };

  const submitFormFunc = async (e) => {
    e.preventDefault();

    const co = {
      ID: competition.ID,
      title: competition.title,
      price: parseFloat(competition.price),
      reduced_price: competition.reduced_price
        ? parseFloat(competition.reduced_price)
        : 0,
      number_of_tickets: parseInt(competition.number_of_tickets),
      max_tickets_per_person: parseInt(competition.max_tickets_per_person),
      tickets_for_early_draw: parseInt(competition.tickets_for_early_draw),
      trending: String(competition.trending) === 'true',
      featured: String(competition.featured) === 'true',
      description: competition.description,
      headline: competition.headline ? competition.headline : "",
      features: competition.features ? competition.features.replace(/\r?\n|\r/g, "") : "",
      category_id: parseInt(competition.category_id),
      end_time: new Date(competition.end_time),
    };

    const qu = {
      ID: quiz.ID,
      ...quiz,
      correct_answer: parseInt(quiz.correct_answer),
    };

const r = await dispatch(updateCompetition(co.ID, {...co}));
    if (r.error) {
      setError("error: " + r.error);
      return;
    }

  const qr = await dispatch(updateQuiz(qu.ID, {...qu}))

    if (qr.error) {
      setError("error: " + qr.error);
      return;
    }

    setError("");
    setSuccess("success, competition edited ");
   
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="col-lg-8">
        <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
          <div className="py-2 p-md-3">
            <div style={{ display: "block" }}>
              {isDatePassed(competition?.end_time) && (
                <div className="alert alert-info alert-dismissible fade show text-center">
                  This competition has already ended.
                </div>
              )}
              {error && (
                <div className="alert alert-danger alert-dismissible fade show text-center">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success alert-dismissible fade show text-center">
                  {success}
                </div>
              )}
            </div>

            <div className="d-sm-flex align-items-center justify-content-between pb-2">
              <h1 className="h3 mb-3 text-center text-sm-left">
                Edit Competition
              </h1>
            </div>
            <p className="font-size-sm">
              Please fill in the form below. Photo's have to be JPGs, price in
              pence.
            </p>
            <form className="needs-validation p-2">
              <div className="row mb-4">
                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="titleProductCreate">
                    competition ID:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    value={competition.ID}
                    readOnly
                  />
                </div>
                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="titleProductCreate">
                    Title:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="titleProductCreate"
                    placeholder="An Exciting Item"
                    name="competition.title"
                    value={competition.title}
                    onChange={onFormChange}
                    required
                  />
                </div>

                {/* <div className="col-12 form-group">
                  <label className="form-label" htmlFor="titleProductCreate">
                    Category ID:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    value={competition?.category?.ID}
                    readOnly
                  />
                </div>

                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="titleProductCreate">
                    Category Name:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    value={competition?.category?.name}
                    readOnly
                  />
                </div> */}

                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="categoryProductCreate">
                    Change Category (don't touch if you don't want to change):
                  </label>
                  <select
                    className="form-control custom-select"
                    id="categoryProductCreate"
                    onChange={(e) => {
                      const catId = Number(e.target.value);
                      const selectedCat = categories.find(
                        (el) => Number(el.ID) === catId
                      );
                      setCategory(selectedCat);
                      setCompetition({ ...competition, category_id: catId });
                    }}
                  >
                    {categories &&
                      categories.map((cat) => (
                        <>
                          <option
                            key={"cat-option-" + cat.ID}
                            selected={Number(category.ID) === cat.ID}
                            value={cat.ID}
                          >
                            {cat.name}
                          </option>
                        </>
                      ))}
                  </select>
                </div>

                <div className="col-sm-6 form-group">
                  <label className="form-label" htmlFor="priceProductCreate">
                    Price:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="priceProductCreate"
                    placeholder="499"
                    name="competition.price"
                    value={competition.price}
                    onChange={onFormChange}
                    required
                  />
                </div>

                <div className="col-sm-6 form-group">
                  <label
                    className="form-label"
                    htmlFor="discountedPriceProductCreate"
                  >
                    Reduced Price ( Discount ):
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="discountedPriceProductCreate"
                    placeholder="197"
                    name="competition.reduced_price"
                    value={competition.reduced_price}
                    onChange={onFormChange}
                  />
                </div>

                <div className="col-sm-6 form-group">
                  <label
                    className="form-label"
                    htmlFor="maxTicketProductCreate"
                  >
                    Max Tickets:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="maxTicketProductCreate"
                    placeholder="500"
                    name="competition.number_of_tickets"
                    value={competition.number_of_tickets}
                    // onChange={onFormChange}
                    readOnly
                  />
                </div>

                <div className="col-sm-6 form-group">
                  <label
                    className="form-label"
                    htmlFor="maxTicketPerUserProductCreate"
                  >
                    Max Tickets Per User:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="maxTicketPerUserProductCreate"
                    placeholder="20"
                    name="competition.max_tickets_per_person"
                    value={competition.max_tickets_per_person}
                    onChange={onFormChange}
                  />
                </div>

                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="ticketsForEaryDraw">
                    Tickets Required For Early Draw:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="ticketsForEaryDraw"
                    name="competition.tickets_for_early_draw"
                    value={competition.tickets_for_early_draw}
                    onChange={onFormChange}
                  />
                </div>

                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="endDTProductCreate">
                    Featured:
                    <p>
                      <small>
                        Featured Competitions will appear on the top of the
                        front page
                      </small>
                    </p>
                  </label>
                  <select
                    className="form-control custom-select"
                    id="correctAnswerProductCreate"
                    name="competition.featured"
                    onChange={onFormChange}
                  >
                    <option selected={String(competition.featured) === 'true'} value={'true'}>
                      True
                    </option>
                    <option selected={String(competition.featured) !== 'true' } value={'false'}>
                      False
                    </option>
                  </select>
                </div>

                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="endDTProductCreate">
                    Trending:
                    <p>
                      <small>
                        Trending Competitions will appear on the front page, on
                        Trending section
                      </small>
                    </p>
                  </label>
                  <select
                    className="form-control custom-select"
                    id="correctAnswerProductCreate"
                    name="competition.trending"
                    onChange={onFormChange}
                  >
                    <option selected={String(competition.trending) === 'true'} value={'true'}>
                      True
                    </option>
                    <option selected={String(competition.trending) !== 'true'} value={'false'}>
                      False
                    </option>
                  </select>
                </div>

                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="endDTProductCreate">
                    Product End Time (make sure date matches this format:
                    YYYY-MM-DD(T)HH:MM:SS(Z)):
                    <p>
                      <small>
                        T and Z are mandatory, because DB needs to parse this
                        time
                      </small>
                    </p>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="endDTProductCreate"
                    name="competition.end_time"
                    value={competition.end_time}
                    onChange={onFormChange}
                  />
                </div>

                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="titleProductCreate">
                    Quiz ID:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    value={competition?.quiz?.ID}
                    readOnly
                  />
                </div>

                <div className="col-sm-6 form-group">
                  <label className="form-label" htmlFor="questionProductCreate">
                    Product Question:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="questionProductCreate"
                    placeholder="Who was the first man on the moon?"
                    name="quiz.question"
                    value={quiz.question}
                    onChange={onFormChange}
                  />
                </div>

                <div className="col-sm-6 form-group">
                  <label
                    className="form-label"
                    htmlFor="correctAnswerProductCreate"
                  >
                    Correct Answer:
                  </label>
                  <select
                    className="form-control custom-select"
                    id="correctAnswerProductCreate"
                    onChange={(e) => {
                      const ans = e.target.value;
                      setQuiz({ ...quiz, correct_answer: ans });
                    }}
                  >
                    <option value={null}> Choose Answer </option>
                    <option
                      selected={Number(quiz?.correct_answer) === 1}
                      value={1}
                    >
                      Answer 1
                    </option>
                    <option
                      selected={Number(quiz?.correct_answer) === 2}
                      value={2}
                    >
                      Answer 2
                    </option>
                    <option
                      selected={Number(quiz?.correct_answer) === 3}
                      value={3}
                    >
                      Answer 3
                    </option>
                    <option
                      selected={Number(quiz?.correct_answer) === 4}
                      value={4}
                    >
                      Answer 4
                    </option>
                  </select>
                </div>

                <div className="col-sm-6 form-group">
                  <label
                    className="form-label"
                    htmlFor="answerOneProductCreate"
                  >
                    Answer 1:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="answerOneProductCreate"
                    placeholder="Neil Armstrong"
                    required
                    name="quiz.option1"
                    value={quiz.option1}
                    onChange={onFormChange}
                  />
                </div>

                <div className="col-sm-6 form-group">
                  <label
                    className="form-label"
                    htmlFor="answerTwoProductCreate"
                  >
                    Answer 2:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="answerTwoProductCreate"
                    placeholder="Buzz Aldrin"
                    required
                    name="quiz.option2"
                    value={quiz.option2}
                    onChange={onFormChange}
                  />
                </div>

                <div className="col-sm-6 form-group">
                  <label
                    className="form-label"
                    htmlFor="answerThreeProductCreate"
                  >
                    Answer 3:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="answerThreeProductCreate"
                    placeholder="Pete Conrad"
                    required
                    name="quiz.option3"
                    value={quiz.option3}
                    onChange={onFormChange}
                  />
                </div>

                <div className="col-sm-6 form-group">
                  <label
                    className="form-label"
                    htmlFor="answerFourProductCreate"
                  >
                    Answer 4:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="answerFourProductCreate"
                    placeholder="Alan Bean"
                    required
                    name="quiz.option4"
                    value={quiz.option4}
                    onChange={onFormChange}
                  />
                </div>

                <div className="col-12 form-group">
                  <label
                    className="form-label"
                    htmlFor="descriptonProductCreate"
                  >
                    Headline:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="descriptonProductCreate"
                    placeholder="This is a basic headline."
                    required
                    name="competition.headline"
                    value={competition.headline}
                    onChange={onFormChange}
                  />
                </div>

                <div className="col-12 form-group">
                  <label
                    className="form-label"
                    htmlFor="descriptonProductCreate"
                  >
                    Descripton:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="This is a basic description."
                    required
                    name="competition.description"
                    value={competition.description}
                    onChange={onFormChange}
                  />
                </div>

                <div className="col-12 form-group">
                  <label
                    className="form-label"
                    htmlFor="descriptonProductCreate"
                  >
                    Features (text or HTML):
                  </label>
                  <textarea
                    className="form-control"
                    type="text"
                    rows="10"
                    placeholder="This is a basic features."
                    name="competition.features"
                    value={competition.features}
                    onChange={onFormChange}
                  />
                </div>
              </div>
              <button
                className="btn btn-primary"
                type="button"
                id="btnProductSubmit"
                onClick={submitFormFunc}
                // disabled={!formValid()}
              >
                Save changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
