/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  _profile,
  _token,
} from "../../../../app/user/userSlice";
import { useSelector } from "react-redux";
import {
  addContactToSendGridList,
  getMarketingListsSubscribedByUser,
  removeContactFromSendGridList,
} from "../../../../app/helpers/sendGrid-helpers.js";
import { listsIDs } from "../../../../app/constants/sendGrid";
import Loading from "../../layout/Loading";

export default function NotificationForm() {
  const profile = useSelector(_profile);
  const token = useSelector(_token);
  const [settings, setSettings] = useState({
    NewCompList: false,
    EndingSoonList: false,
    SpecialDiscountList: false,
    WinnerEmailList: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [alreadySubscribed, setAlreadySubscribed] = useState([]);
  const [sendgridContactID, setSendgridContactID] = useState(null);
  const [wait, setWait] = useState(false);

  useEffect(() => {
    // setSettings({ ...profile?.notification_settings });
  }, [profile]);

  useEffect(() => {
    (async () => {
      setWait(true);
      const sendgridRes = await getMarketingListsSubscribedByUser(
        profile?.email,
        token
      );
      setAlreadySubscribed([...sendgridRes.list_ids]);
      setSendgridContactID(sendgridRes.id);
      setWait(false);
    })();
  }, [profile]);

  useEffect(() => {
    const keysIDS = Object.keys(listsIDs);
    const valuesIDs = Object.values(listsIDs);
    const settingsObject = {
      NewCompList: false,
      EndingSoonList: false,
      SpecialDiscountList: false,
      WinnerEmailList: false,
    };
    alreadySubscribed.forEach((lid) => {
      if (valuesIDs.includes(lid)) {
        const key = keysIDS.find((k) => listsIDs[k] === lid);
        settingsObject[key] = true;
      }
    });

    setSettings({ ...settingsObject });
  }, [alreadySubscribed]);

  const onFormChange = (e) => {
    // e.preventDefault();
    // if (settings?.ID) {
    setSettings({ ...settings, [e.target.name]: !settings[e.target.name] });
    // }
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    setWait(true);

    const listsToSubscribe = [];
    const listsToUnsubscribe = [];
    const contactInfo = {
      email: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
    };

    for (const key in settings) {
      if (settings[key]) {
        listsToSubscribe.push(listsIDs[key]);
      } else {
        listsToUnsubscribe.push(listsIDs[key]);
      }
    }

    // subscribe request
    const r = await addContactToSendGridList(listsToSubscribe, contactInfo);
    const r2 = await removeContactFromSendGridList(
      token,
      listsToUnsubscribe,
      sendgridContactID
    );

    setSuccess("Changes saved!");
    setWait(false);
  };

  return (
    <>
      <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
        <div className="py-2 p-md-3">
          <h1 className="h3 mb-3 pb-2 text-center text-sm-left">
            Notifications
          </h1>
          <div id="notification-settings">
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
            <div className="bg-secondary rounded-lg p-4 font-size-sm text-heading">
              Use the switch on the left hand side to{" "}
              <span className="font-weight-medium">
                enable / disable the notification. Changes might take few
                minutes to take effect.
              </span>
            </div>
            {wait ? (
              <Loading />
            ) : (
              <>
                <div className="border-bottom py-4 p-sm-4">
                  <div className="custom-control custom-switch">
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      id="nf-competition-added"
                      checked={settings?.NewCompList}
                      name="NewCompList"
                      onChange={onFormChange}
                    />
                    <label
                      className="custom-control-label text-heading"
                      htmlFor="nf-competition-added"
                    >
                      New competition notifications
                    </label>
                  </div>
                  <small className="form-text">
                    Send an email when a new competition is added.
                  </small>
                </div>
                <div className="border-bottom py-4 p-sm-4">
                  <div className="custom-control custom-switch">
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      id="nf-competition-discount"
                      checked={settings?.SpecialDiscountList}
                      name="SpecialDiscountList"
                      onChange={onFormChange}
                    />
                    <label
                      className="custom-control-label text-heading"
                      htmlFor="nf-competition-discount"
                    >
                      Special discount notifications
                    </label>
                  </div>
                  <small className="form-text">
                    Send an email when a competition is reduced.
                  </small>
                </div>
                <div className="border-bottom py-4 p-sm-4">
                  <div className="custom-control custom-switch">
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      id="nf-competition-ending"
                      checked={settings?.EndingSoonList}
                      name="EndingSoonList"
                      onChange={onFormChange}
                    />
                    <label
                      className="custom-control-label text-heading"
                      htmlFor="nf-competition-ending"
                    >
                      Ending soon notifications
                    </label>
                  </div>
                  <small className="form-text">
                    Send an email when a competition is ending soon.
                  </small>
                </div>
                <div className="border-bottom py-4 p-sm-4">
                  <div className="custom-control custom-switch">
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      id="nf-competition-finished"
                      checked={settings?.WinnerEmailList}
                      name="WinnerEmailList"
                      onChange={onFormChange}
                    />
                    <label
                      className="custom-control-label text-heading"
                      htmlFor="nf-competition-finished"
                    >
                      Winner notifications
                    </label>
                  </div>
                  <small className="form-text">
                    Send an email when a competition has finished and a winner
                    chosen.
                  </small>
                </div>

                {/* <div className="border-bottom py-4 p-sm-4">
              <div className="custom-control custom-switch">
                <input
                  className="custom-control-input"
                  type="checkbox"
                  id="nf-competition-entry"
                  checked={settings?.competition_entry_details}
                  name="competition_entry_details"
                  onChange={onFormChange}
                />
                <label
                  className="custom-control-label text-heading"
                  htmlFor="nf-competition-entry"
                >
                  Competition entry detail notifications
                </label>
              </div>
              <small className="form-text">
                Send an email when I enter a new competition.
              </small>
            </div> */}
                <div className="text-center text-sm-right mt-4 pt-2">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={saveChanges}
                  >
                    <i className="fe-save font-size-lg mr-2"></i>Save changes
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
