import React, { useState, useEffect } from "react";
import StandardBackground from "../StandardBackground";
import SideBar from "../SideBar";
import PrizesTable from "./PrizesTable";
import AddPrizeForm from "./AddPrizeForm";
import EditPrizeForm from "./EditPrizeForm";
import RewardRateForm from "./RewardRateForm";
import { useDispatch, useSelector } from "react-redux";
import { getAllPrizesFromServer, _prizes } from '../../../app/prize/prizeSlice.js';

export default function PrizesManagement() {
    const [selectedPrizeToEdit, setSelectedPrizeToEdit] = useState({});
    const dispatch = useDispatch();
    const prizes = useSelector(_prizes);

    useEffect(() => {
        dispatch(getAllPrizesFromServer());
    }, [])
    return (
        <>
            <StandardBackground />
            <div
                className="container bg-overlay-content pb-4 mb-md-3"
                style={{ marginTop: "-350px" }}
            >
                <div className="row full-height">
                    <SideBar />
                    <div className="col-lg-8">
                        <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
                            <div className="py-2 p-md-3">
                                <div style={{ display: "block" }}>
                                    <RewardRateForm />
                                    <br /><hr /> <br />
                                    <PrizesTable prizes={prizes} setSelectedPrizeToEdit={setSelectedPrizeToEdit} />

                                    {selectedPrizeToEdit && selectedPrizeToEdit.ID ? <>
                                        <br /><hr /> <br />
                                        <EditPrizeForm
                                            prizeToEdit={selectedPrizeToEdit}
                                            setSelectedPrizeToEdit={setSelectedPrizeToEdit} />
                                    </> : <></>}
                                    <br /><hr /> <br />
                                    <AddPrizeForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
