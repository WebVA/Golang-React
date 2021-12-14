import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  saveCategoryToServer,
} from "../../../app/competition/categorySlice";
import {
  _loading,
} from "../../../app/appState/appSlice";
import LoadingSpinner from "../../pages/layout/Loading";

export default function UploadForm() {
  const loading = useSelector(_loading);
  const dispatch = useDispatch();
  const [category, setCategory] = useState({
    title: "",
    image: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const onFormChange = (e) => {
    e.preventDefault();
    // eslint-disable-next-line default-case
    switch (e.target.name) {
      case "title": {
        setCategory({ ...category, title: e.target.value });
        break;
      }
      case "image": {
        setCategory({ ...category, image: e.target.files[0] });
        break;
      }
    }
  };

  const submitFormFunc = async (e) => {
    e.preventDefault();
    const r1  = await dispatch(saveCategoryToServer(category));
    if(r1.error) {
      setError('error: ' + r1.error);
      return;
    }
    setSuccess("success, category uploaded!");
    setCategory({
      title: "",
      image: "",
    });
  };

  return (
    <>
      <div className="col-lg-8">
        <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
          <div className="py-2 p-md-3">
          <div style ={{display: 'block' }}>
          {error && (
            <div className="alert alert-danger alert-dismissible fade show text-center"  >
              {error}
            </div>
          )}
           {success && (
            <div className="alert alert-success alert-dismissible fade show text-center" >
              {success}
            </div>
          )}
          </div>
            <div className="d-sm-flex align-items-center justify-content-between pb-2">
              <h1 className="h3 mb-3 text-center text-sm-left">
                Upload New Category
              </h1>
            </div>
            <p className="font-size-sm">
              Please fill in the form below. Photo's have to be JPGs, category capitalisation matters.
            </p>
            <form className="needs-validation p-2">
              <div className="row mb-4">
                <div className="col-12 form-group">
                  <label className="form-label" htmlFor="titleProductCreate">
                    Category Name:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="titleProductCreate"
                    placeholder="Technology"
                    name="title"
                    value={category.title}
                    onChange={onFormChange}
                    required
                  />
                </div>

                <div className="col-sm-6 form-group">
                  <label className="form-label" htmlFor="photoOne">
                    Category Picture:
                  </label>
                  <div className="custom-file">
                    <input
                      className="custom-file-input"
                      type="file"
                      id="photoOneProductCreate"
                      accept=".jpg"
                      required
                      name="image"
                      onChange={onFormChange}
                    />
                    <label
                      className="custom-file-label"
                      htmlFor="photoOneProductCreate"
                    >
                      Choose file...
                    </label>
                  </div>
                  {category.image && (
                    <img src={URL.createObjectURL(category.image)} alt="" />
                  )}
                </div>
              </div>
              <button
                className="btn btn-primary"
                type="button"
                id="btnProductSubmit"
                onClick={submitFormFunc}
                disabled={!category.title || !category.image}
              >
                Upload Category
              </button>
            </form>
          </div>
        </div>
        <div>{loading && <LoadingSpinner width="200px" height="200px" />}</div>
      </div>
    </>
  );
}
