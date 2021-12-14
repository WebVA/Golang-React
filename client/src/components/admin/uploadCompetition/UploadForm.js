import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { _categories } from "../../../app/competition/categorySlice";
import { saveCompetitionToServer } from "../../../app/competition/competitionSlice";
import LoadingSpinner from "../../pages/layout/Loading";
import { competitionValid, quizValid } from "../../../app/helpers/validators";
import {
  emptyCompetition,
  emptyCategory,
  emptyQuiz,
} from "../../../app/helpers/default-types";

export default function UploadForm() {
  const categories = useSelector(_categories);
  const dispatch = useDispatch();
  const [competition, setCompetition] = useState({ ...emptyCompetition });
  const [category, setCategory] = useState({ ...emptyCategory });
  const [quiz, setQuiz] = useState({ ...emptyQuiz });
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [wait, setWait] = useState(false);

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

  const onChangeImage = (e) => {
    e.preventDefault();
    const index = e.target.name.match(/\d+/)[0];
    let temp = [...images];
    if (index) {
      temp[Number(index) - 1] = e.target.files[0];
    }
    setImages([...temp]);
  };

  const submitFormFunc = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formValid()) {
      return;
    }

    const comp = {
      title: competition.title,
      price: parseFloat(competition.price),
      reduced_price: competition.reduced_price
        ? parseFloat(competition.reduced_price)
        : 0,
      number_of_tickets: parseInt(competition.number_of_tickets),
      max_tickets_per_person: parseInt(competition.max_tickets_per_person),
      tickets_for_early_draw: parseInt(competition.tickets_for_early_draw),
      Trending: false,
      description: competition.description,
      headline: competition.headline ? competition.headline : "",
      features: competition.features ? competition.features : "",
      category_id: parseInt(competition.category_id),
      end_time: new Date(competition.end_time),
      category: category,
      quiz: { ...quiz, correct_answer: parseInt(quiz.correct_answer) },
    };

    const req = {
      competition: comp,
      images: images,
    };

    setWait(true);
    const res = await dispatch(saveCompetitionToServer(req));

    if (res.error) {
      setError("error: " + res.error);
      setWait(false);
      return;
    }

    setSuccess("success, competition uploaded ");
    setCategory({ ...emptyCategory });
    setQuiz({ ...emptyQuiz });
    setCompetition({ ...emptyCompetition });
    setImages([]);
    setWait(false);
  };

  const formValid = () => {
    let formErrors = "";

    if (images.length < 1) {
      formErrors +=
        "you did not upload any images, at least one image is required. \n ";
    }
    const compErrors = competitionValid(competition, "create");
    const quizErrors = quizValid(quiz, "create");
    formErrors += compErrors;
    formErrors += quizErrors;
    if (!formErrors) {
      return true;
    }
    setError(formErrors);
    return false;
  };

  return (
    <>
      <div className="col-lg-8">
        <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
          <div className="py-2 p-md-3">
            <div style={{ display: "block" }}>
              {error && (
                <div className="alert alert-danger alert-dismissible fade show text-center">
                  {error.split(".").map((e, i) => (
                    <p key={`error-p-comp-${i}`} className="text-left">
                      {e}
                    </p>
                  ))}
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
                Upload New Competition
              </h1>
            </div>
            <p className="font-size-sm">
              Please fill in the form below. Photo's have to be JPGs, price in
              pence.
            </p>
            {wait ? (
              <LoadingSpinner />
            ) : (
              <form className="needs-validation p-2">
                <div className="row mb-4">
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

                  <div className="col-12 form-group">
                    <label
                      className="form-label"
                      htmlFor="categoryProductCreate"
                    >
                      Category:
                    </label>
                    <select
                      className="form-control custom-select"
                      id="categoryProductCreate"
                      onChange={(e) => {
                        const catId = Number(e.target.value);
                        setCategory(categories[catId - 1]);
                        setCompetition({ ...competition, category_id: catId });
                      }}
                    >
                      <option>Choose category</option>
                      {categories &&
                        categories.map((cat, i) => (
                          <option
                            key={"cat-option-" + cat.ID + "-i-" + i}
                            value={cat.ID}
                          >
                            {cat.name}
                          </option>
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
                      onChange={onFormChange}
                      required
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
                      Product End Time:
                    </label>
                    <input
                      className="form-control"
                      type="datetime-local"
                      id="endDTProductCreate"
                      name="competition.end_time"
                      value={competition.end_time}
                      onChange={onFormChange}
                    />
                  </div>

                  <div className="col-sm-6 form-group">
                    <label
                      className="form-label"
                      htmlFor="questionProductCreate"
                    >
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
                      <option value={1}>Answer 1</option>
                      <option value={2}>Answer 2</option>
                      <option value={3}>Answer 3</option>
                      <option value={4}>Answer 4</option>
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
                      Description:
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

                  <div className="col-sm-6 form-group">
                    <label className="form-label" htmlFor="photoOne">
                      Picture One:
                    </label>
                    <div className="custom-file">
                      <input
                        className="custom-file-input"
                        type="file"
                        id="photoOneProductCreate"
                        accept=".jpg"
                        required
                        name="image1"
                        onChange={onChangeImage}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="photoOneProductCreate"
                      >
                        Choose file...
                      </label>
                    </div>
                    {images &&
                      images.length > 0 &&
                      (images[0] ? (
                        <img
                          src={URL.createObjectURL(images[0])}
                          alt=""
                          key={"img1"}
                        />
                      ) : (
                        <></>
                      ))}
                  </div>

                  <div className="col-sm-6 form-group">
                    <label className="form-label" htmlFor="photoTwo">
                      Picture Two:
                    </label>
                    <div className="custom-file">
                      <input
                        className="custom-file-input"
                        type="file"
                        id="photoTwoProductCreate"
                        accept=".jpg"
                        required
                        name="image2"
                        onChange={onChangeImage}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="photoTwoProductCreate"
                      >
                        Choose file...
                      </label>
                    </div>
                    {images &&
                      images.length > 1 &&
                      (images[1] ? (
                        <img
                          src={URL.createObjectURL(images[1])}
                          alt=""
                          key={"img2"}
                        />
                      ) : (
                        <></>
                      ))}
                  </div>

                  <div className="col-sm-6 form-group">
                    <label className="form-label" htmlFor="photoThree">
                      Picture Three:
                    </label>
                    <div className="custom-file">
                      <input
                        className="custom-file-input"
                        type="file"
                        id="photoThreeProductCreate"
                        accept=".jpg"
                        required
                        name="image3"
                        onChange={onChangeImage}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="photoThreeProductCreate"
                      >
                        Choose file...
                      </label>
                    </div>
                    {images &&
                      images.length > 2 &&
                      (images[2] ? (
                        <img
                          src={URL.createObjectURL(images[2])}
                          alt=""
                          key={"img3"}
                        />
                      ) : (
                        <></>
                      ))}
                  </div>

                  <div className="col-sm-6 form-group">
                    <label className="form-label" htmlFor="photoFour">
                      Picture Four:
                    </label>
                    <div className="custom-file">
                      <input
                        className="custom-file-input"
                        type="file"
                        id="photoFourProductCreate"
                        accept=".jpg"
                        required
                        name="image4"
                        onChange={onChangeImage}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="photoFourProductCreate"
                      >
                        Choose file...
                      </label>
                    </div>
                    {images &&
                      images.length > 3 &&
                      (images[3] ? (
                        <img
                          src={URL.createObjectURL(images[3])}
                          alt=""
                          key={"img4"}
                        />
                      ) : (
                        <></>
                      ))}
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  id="btnProductSubmit"
                  onClick={submitFormFunc}
                  // disabled={!formValid()}
                >
                  Upload Product
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
