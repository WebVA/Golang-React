/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  _profile,
  UpdateUser,
  updateUserAddress,
  fetchUserInfo,
} from "../../../../app/user/userSlice";
import { useSelector, useDispatch } from "react-redux";

export default function ProfileForm() {
  const profile = useSelector(_profile);
  const [formProfile, setFormProfile] = useState({});
  const [formAddress, setFormAddress] = useState({});
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setFormProfile(profile);
    setFormAddress(profile?.address);
  }, [profile]);

  useEffect(() => {
    if (!profile?.address?.ID) {
      (async () => {
        await dispatch(fetchUserInfo());
      })();
    }
  }, []);

  const onProfileFormChange = (e) => {
    setFormProfile({ ...formProfile, [e.target.name]: e.target.value });
  };

  const onFormAddressChange = (e) => {
    setFormAddress({ ...formAddress, [e.target.name]: e.target.value });
  };

  const saveChangesToProfile = async (e) => {
    e.preventDefault();
    const res1 = dispatch(updateUserAddress(profile?.address_id, formAddress));
    if (res1.error) {
      setError(res1.error);
      return;
    }

    const res = await dispatch(UpdateUser(profile.ID, formProfile));
    if (res.error) {
      setError(res.error);
      return;
    }

    setSuccess("Changes saved!");
  };
  return (
    <>
      <div class="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
        <div class="py-2 p-md-3">
          {/* <!-- Title + Delete link--> */}
          <div style={{ display: "block" }}>
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
          <div class="d-sm-flex align-items-center justify-content-between pb-4 text-center text-sm-left">
            <h1 class="h3 mb-2 text-nowrap">Profile info</h1>
            <div class="btn btn-link text-danger font-weight-medium btn-sm mb-2">
              <i class="fe-trash-2 font-size-base mr-2"></i>Delete account{" "}
            </div>
          </div>
          {/* <!-- Content--> */}
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label for="account-fn">First Name</label>
                <input
                  class="form-control"
                  type="text"
                  id="account-fn"
                  name="first_name"
                  onChange={onProfileFormChange}
                  value={formProfile?.first_name}
                />
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label for="account-ln">Last Name</label>
                <input
                  class="form-control"
                  type="text"
                  id="account-ln"
                  name="last_name"
                  onChange={onProfileFormChange}
                  value={formProfile?.last_name}
                />
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label for="account-email">Email address</label>
                <input
                  class="form-control"
                  type="text"
                  id="account-email"
                  name="email"
                  onChange={onProfileFormChange}
                  value={formProfile?.email}
                />
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label for="account-username">Username</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">@</span>
                  </div>
                  <input
                    class="form-control"
                    type="text"
                    id="account-username"
                    name="username"
                    onChange={onProfileFormChange}
                    value={formProfile?.username}
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label for="account-country">Country</label>
                <select class="custom-select" id="account-country">
                  <option value>Select country</option>
                  <option value="UK" selected>
                    United Kingdom
                  </option>
                </select>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label for="account-city">City</label>
                <input
                  class="form-control"
                  type="text"
                  id="account-city"
                  name="city"
                  onChange={onFormAddressChange}
                  value={formAddress?.city}
                />
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label for="account-address">Address Line</label>
                <input
                  class="form-control"
                  type="text"
                  id="account-address"
                  name="address_line"
                  onChange={onFormAddressChange}
                  value={formAddress?.address_line}
                />
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label for="account-zip">ZIP Code</label>
                <input
                  class="form-control"
                  type="text"
                  id="account-zip"
                  name="zip_code"
                  onChange={onFormAddressChange}
                  value={formAddress?.zip_code}
                />
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label for="account-phone">Phone</label>
                <input
                  class="form-control"
                  type="text"
                  id="account-phone"
                  name="phone"
                  onChange={onProfileFormChange}
                  value={formProfile?.phone}
                />
              </div>
            </div>
            <div class="col-12">
              <hr class="mt-2 mb-4" />
              <div class="d-flex flex-wrap justify-content-between align-items-center">
                <button
                  class="btn btn-primary mt-3 mt-sm-0"
                  type="button"
                  onClick={saveChangesToProfile}
                >
                  <i class="fe-save font-size-lg mr-2"></i>Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
