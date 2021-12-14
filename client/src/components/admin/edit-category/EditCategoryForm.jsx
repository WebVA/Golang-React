import React, { useState, useEffect } from "react";
import { _token } from "../../../app/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchDeleteJSON } from "../../../app/helpers/api-helpers";
import Loading from "../../pages/layout/Loading";
import ErrorMessage from "../../shared/ErrorMessage";
import SuccessMessage from "../../shared/SuccessMessage";
import {
  updateCategory,
  uploadCategoryImage,
} from "../../../app/competition/categorySlice";

export default function EditCategoryForm({ catToEdit }) {
  const [cat, setCat] = useState({});
  const token = useSelector(_token);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [wait, setWait] = useState(false);
  const dispatch = useDispatch();
  const [newImage, setNewImage] = useState(null);

  const saveNewName = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!cat?.ID) {
      setError("category ID is required");
      return;
    }

    setWait(true);

    const r = await dispatch(updateCategory(cat.ID, { name: cat?.name }));

    if (r.error) {
      setError(r.error);
      setWait(false);
      return;
    }

    setError("");
    setSuccess("name changed successfully");
    setWait(false);
  };

  const saveNewImage = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const urlImage = cat?.image;

    if (!urlImage) {
      setError("can't delete this image");
      return;
    }

    if (!cat?.ID) {
      setError("category ID is required");
      return;
    }
    setWait(true);
    const r = await fetchDeleteJSON(urlImage, token);
    if (r.error) {
      setError(r.error);
      setWait(false);
      // return;
    }

    const done = await uploadCategoryImage(cat?.ID, cat?.name, newImage, token);

    if (done) {
      setError("");
      setSuccess("image changed successfully");
      setWait(false);
      return;
    }

    setError("uploading failed, please try again");
    setWait(false);
  };

  useEffect(() => {
    setCat({ ...catToEdit });
  }, [catToEdit]);

  const onFormChange = (e) => {
    setCat({ ...cat, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="col-lg-8">
        <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
          <div className="py-2 p-md-3">
            <div className="d-sm-flex align-items-center justify-content-between pb-2">
              <h1 className="h3 mb-3 text-center text-sm-left">
                Edit Category
              </h1>
            </div>
            {error && <ErrorMessage msg={error} />}
            {success && <SuccessMessage msg={success} />}
            {wait ? (
              <Loading />
            ) : (
              <>
                <form className="needs-validation p-2">
                  <div className="row mb-4">
                    <div className="col-12 form-group">
                      <label
                        className="form-label"
                        htmlFor="titleProductCreate"
                      >
                        competition ID:
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        value={catToEdit.ID}
                        readOnly
                      />
                    </div>
                    <div className="col-12 form-group">
                      <label
                        className="form-label"
                        htmlFor="titleProductCreate"
                      >
                        Title:
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="titleProductCreate"
                        placeholder="An Exciting Item"
                        name="name"
                        value={cat?.name}
                        onChange={onFormChange}
                        required
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    type="button"
                    id="btnProductSubmit"
                    onClick={saveNewName}
                    // disabled={!formValid()}
                  >
                    Save changes
                  </button>
                </form>
                <br />
                <form>
                  <div className="row">
                    <div className="col-6 form-group">
                      <label
                        className="form-label"
                        htmlFor="titleProductCreate"
                      >
                        Image:
                      </label>
                      <div>
                        {newImage ? (
                          <img
                            src={URL.createObjectURL(newImage)}
                            className=""
                            alt=""
                            width="200"
                          />
                        ) : (
                          <img
                            src={cat.image}
                            className=""
                            alt=""
                            width="200"
                          />
                        )}
                      </div>
                    </div>

                    <div className="col-6 form-group">
                      <label
                        className="form-label"
                        htmlFor="titleProductCreate"
                      >
                        Actions:
                      </label>
                      <div className="custom-file">
                        <input
                          className="custom-file-input"
                          type="file"
                          id="photoOneProductCreate"
                          accept=".jpg"
                          required
                          name="image"
                          onChange={(e) => setNewImage(e.target.files[0])}
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="photoOneProductCreate"
                        >
                          upload new Image...
                        </label>
                      </div>
                      <br /> <br />
                      <button
                        className="btn btn-info d-block"
                        onClick={saveNewImage}
                      >
                        Save New Image
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
            {/* <pre>{JSON.stringify(catToEdit, null, 4)}</pre> */}
          </div>
        </div>
      </div>
    </>
  );
}
