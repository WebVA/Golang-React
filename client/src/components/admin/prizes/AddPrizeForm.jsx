import React, { useState } from 'react'
import Loading from '../../pages/layout/Loading'
import ErrorMessage from '../../shared/ErrorMessage';
import SuccessMessage from '../../shared/SuccessMessage';
import { PRIZE_TYPES } from '../../../app/constants/constants.js'
import { createNewPrize } from '../../../app/prize/prizeSlice.js';
import { useDispatch } from 'react-redux';

export const emptyPrize = {
    title: "",
    description: "",
    points_required: 0,
    prize_value: 0,
    type: PRIZE_TYPES.percent_off
}


export default function AddPrizeForm() {
    const [prize, setPrize] = useState({ ...emptyPrize });
    const [wait, setWait] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const dispatch = useDispatch();

    const onFormChange = (e) => {
        setPrize({ ...prize, [e.target.name]: e.target.value })
    }

    const validateForm = () => {
        let msg = '';

        if (!prize.title) msg += "Title can't be empty.";
        if (!prize.description) msg += "Description can't be empty.";
        if (!(+prize.points_required)) msg += "Points Required can't be empty.";
        if (!prize.type) msg += "Type can't be empty.";
        if (!(+prize.prize_value)) msg += "Prize Value can't be empty.";

        return msg;
    }

    const submitFormFunc = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setWait(true);

        // validation
        const formErr = validateForm();

        if (formErr) {
            setError(formErr);
            setWait(false);
            return;
        }

        const prizeData = { ...prize }
        prizeData.points_required = Number(prizeData.points_required);
        prizeData.prize_value = Number(parseFloat(prizeData.prize_value));

        const r = await dispatch(createNewPrize(prizeData));

        if (r.error) {
            setError(r.error);
            setWait(false);
            return;
        }

        setSuccess("prize, successfully created");
        setWait(false);
        setPrize({ ...emptyPrize })

    }


    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between pb-2">
                <h1 className="h3 mb-3 text-center text-sm-left">
                    Add New Prize
              </h1>
            </div>
            {error && <ErrorMessage msg={error} multiple />}
            {success && <SuccessMessage msg={success} />}
            {wait ? (
                <Loading />
            ) : (
                <form className="needs-validation p-2">
                    <div className="row">
                        <div className="col-12 form-group">
                            <label className="form-label" htmlFor="titleProductCreate">
                                Prize Type:
                            </label>
                            <select className="form-control"
                                type="text"
                                id="titleProductCreate"
                                placeholder="prize title"
                                name="type"
                                onChange={onFormChange}
                                required >
                                <option value={PRIZE_TYPES.percent_off}>Percent Off</option>
                                <option value={PRIZE_TYPES.amount_off} >Amount Off</option>
                            </select>

                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 form-group">
                            <label className="form-label" htmlFor="titleProductCreate">
                                Title:
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                id="titleProductCreate"
                                placeholder="prize title"
                                name="title"
                                value={prize.title}
                                onChange={onFormChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 form-group">
                            <label className="form-label" htmlFor="titleProductCreate">
                                Description:
                            </label>
                            <textarea
                                className="form-control"
                                type="text"
                                id="titleProductCreate"
                                placeholder="prize description"
                                name="description"
                                value={prize.description}
                                onChange={onFormChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6 form-group">
                            <label className="form-label" htmlFor="titleProductCreate">
                                Points Required:
                            </label>
                            <input
                                className="form-control"
                                type="number"
                                id="titleProductCreate"
                                placeholder="prize points_required"
                                name="points_required"
                                value={prize.points_required}
                                onChange={onFormChange}
                                required
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label className="form-label" htmlFor="titleProductCreate">
                                Prize Value:
                            </label>
                            <input
                                className="form-control"
                                type="number"
                                id="titleProductCreate"
                                placeholder="prize prize_value"
                                name="prize_value"
                                value={prize.prize_value}
                                onChange={onFormChange}
                                required
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
                        Add new Prize
                </button>
                </form>
            )}

        </>
    )
}