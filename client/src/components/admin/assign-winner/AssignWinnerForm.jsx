import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  _competitions,
  updateCompetition,
} from "../../../app/competition/competitionSlice";
import { useSelector, useDispatch } from "react-redux";
import { getAllTicketsFromServer } from "../../../app/ticket/ticketSlice.js";
import { fetchWinnerInfo } from "../../../app/admin/adminSlice.js";
import WinnerInfoTable from "./WinnerInfoTable";
import WinningTicketTable from "./WinningTicketTable";

export default function AssignWinnerForm() {
  const { compID } = useParams();
  const competitions = useSelector(_competitions);
  const [compToAssignTo, setCompToAssignTo] = useState(null);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    winner_id: 0,
    winner_ticket_number: 0,
    winner_number_of_entries: 0,
  });
  const [error, setError] = useState("");
  const [winnerInfo, setWinnerInfo] = useState({});
  const [success, setSuccess] = useState("");
  const [winningTicketData, setWiningTicketData] = useState({});

  useEffect(() => {
    if (compID) {
      const f = competitions.find((c) => Number(c.ID) === Number(compID));
      setCompToAssignTo(f);
    }
  }, [competitions, compID]);

  const onFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const formValid = () => {
    setError("");
    if (!formData.winner_id) {
      setError("can't complete without winner ID, please specify one");
      return false;
    }

    if (!formData.winner_ticket_number) {
      setError(
        "can't complete without winner Ticket Number, please specify one"
      );
      return false;
    }

    if (!formData.winner_number_of_entries) {
      setError(
        "can't complete without winner number of entries, please specify one"
      );
      return false;
    }

    setError("");
    return true;
  };

  const calculateWinner = async () => {
    setError("");
    if (!compID) {
      setError("can't complete without competition ID");
      return;
    }

    // if (!formData.winner_id) {
    //   setError("can't complete without winner ID");
    //   return;
    // }

    const r = await dispatch(getAllTicketsFromServer(compID));

    if (r.error) {
      setError(r.error);
      return;
    }

    const allTickets = r.result;

    const winningTicket = allTickets.find(
      (t) => Number(t.ID) === Number(formData.winner_ticket_number)
    );

    if (!winningTicket) {
      setError(
        "no ticket with this number, for this competition, please double check"
      );
      return;
    }

    setWiningTicketData({ ...winningTicket });

    if (!winningTicket?.buyer_id) {
      setError("This Ticket has no buyer");
      return;
    }

    const u = await dispatch(fetchWinnerInfo(winningTicket.buyer_id));

    if (u.error) {
      setError(u.error);
      setWinnerInfo({});
      return;
    }

    const user = u.result;

    if (!user?.ID) {
      setError("there is no such user at our data, please double check");
      setWinnerInfo({});
      return;
    }

    setWinnerInfo({ ...user });

    if (Number(winningTicket?.buyer_id) !== Number(user.ID)) {
      setError(
        "This user did not buy this ticket, change from DB if you insist"
      );
      return;
    }

    let nOfEntries = 0;

    allTickets.forEach((t) => {
      if (Number(t.buyer_id) === Number(user.ID)) {
        nOfEntries++;
      }
    });

    setFormData({
      ...formData,
      winner_number_of_entries: nOfEntries,
      winner_id: user.ID,
    });
    setError("");
  };

  const submitFormFunc = async (e) => {
    e.preventDefault();
    if (!formValid()) return;

    const r = await dispatch(
      updateCompetition(compID, {
        ID: Number(compID),
        ...formData,
      })
    );

    if (r.error) {
      setError(r.error);
      return;
    }

    setError("");
    setSuccess("Done, Winner Assigned Successfully");
  };

  return (
    <>
      <div className="col-lg-8">
        <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
          <div className="py-2 p-md-3">
            <div style={{ display: "block" }}>
              <div className="d-sm-flex align-items-center justify-content-between pb-2">
                <h1 className="h3 mb-3 text-center text-sm-left">
                  Assign Winner Form
                </h1>
              </div>
              <p className="font-size-sm">
                Please fill in the form below. you need to calculate number of
                entries and save it manually.
              </p>

              {!success && compToAssignTo?.winner_id && (
                <div className="alert alert-warning alert-dismissible fade show text-center">
                  <h1 className="text-display">
                    {" "}
                    This competition already has a winner, continue filling this
                    form to change winner information.
                  </h1>
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

              <form className="needs-validation p-2">
                <div className="row mb-4">
                  <div className="col-12 form-group">
                    <label className="form-label" htmlFor="titleProductCreate">
                      Competition ID:
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      value={compToAssignTo?.ID}
                      readOnly
                    />
                  </div>
                  <div className="col-12 form-group">
                    <label className="form-label" htmlFor="titleProductCreate">
                      Competition Title:
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      value={compToAssignTo?.title}
                      readOnly
                    />
                  </div>

                  <div className="col-12 form-group">
                    <label className="form-label" htmlFor="titleProductCreate">
                      Competition End Time:
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      value={compToAssignTo?.end_time}
                      readOnly
                    />
                  </div>

                  <div className="col-sm-6 form-group">
                    <label className="form-label" htmlFor="priceProductCreate">
                      Winning Ticket Number:
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="priceProductCreate"
                      placeholder=""
                      name="winner_ticket_number"
                      value={
                        formData?.winner_ticket_number ||
                        compToAssignTo?.winner_ticket_number
                      }
                      onChange={onFormChange}
                      required
                    />
                  </div>

                  <div className="col-sm-6 form-group">
                    <label className="form-label" htmlFor="priceProductCreate">
                      user and entries will show down
                    </label>
                    <input
                      className="form-control btn btn-warning"
                      type="button"
                      onClick={calculateWinner}
                      value="Fetch winning info "
                    />
                  </div>

                  <div className="col-sm-6 form-group">
                    <label className="form-label" htmlFor="priceProductCreate">
                      Winner ID:
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="priceProductCreate"
                      placeholder=""
                      name="winner_id"
                      value={formData?.winner_id || compToAssignTo?.winner_id}
                      onChange={onFormChange}
                      required
                    />
                  </div>

                  <div className="col-sm-6 form-group">
                    <label className="form-label" htmlFor="priceProductCreate">
                      Number of Entries:
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="priceProductCreate"
                      placeholder=""
                      name="winner_number_of_entries"
                      value={
                        formData?.winner_number_of_entries ||
                        compToAssignTo?.winner_number_of_entries
                      }
                      onChange={onFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <br />
                    {Object.keys(winnerInfo).length ? (
                      <>
                        <p className="pl-4">Winner Info</p>
                        <WinnerInfoTable winner={winnerInfo} />
                      </>
                    ) : null}
                  </div>

                  <div className="form-group">
                    <br />
                    {Object.keys(winnerInfo).length ? (
                      <>
                        <p className="pl-4">Ticket Info</p>
                        <WinningTicketTable ticket={winningTicketData} />
                      </>
                    ) : null}
                  </div>

                  <div className="col-sm-6 form-group">
                    <br />
                    <button
                      className="form-control btn btn-primary"
                      type="button"
                      onClick={submitFormFunc}
                    >
                      Assign a winner to this competition
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
