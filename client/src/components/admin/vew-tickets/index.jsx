/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import StandardBackground from "../StandardBackground";
import SideBar from "../SideBar";
import { useParams } from "react-router-dom";
import { _tickets, getAllTicketsFromServer } from "../../../app/ticket/ticketSlice";
import { useSelector, useDispatch } from "react-redux";
import ViewTicketsTable from './ViewTicketsTable';
import { _competitions } from "../../../app/competition/competitionSlice";


export default function ViewTicketsRealTime() {
    const { compID } = useParams();
    const tickets = useSelector(_tickets);
    const dispatch = useDispatch();
    const competitions = useSelector(_competitions);
    const [compInfo, setCompInfo] = useState({});
    const [timerId, setTimerId] = useState(null);


    useEffect(() => {
        if (timerId) {
            clearInterval(timerId);
        }
        (async () => {
            await dispatch(getAllTicketsFromServer(compID));
            let timer = setInterval(async () => {
                await dispatch(getAllTicketsFromServer(compID));
            }, 5 * 1000);
            setTimerId(timer);
        })();
    }, [compID]);



    useEffect(() => {
        if (competitions) {
            const comp = competitions.find((c) => Number(c.ID) === Number(compID));
            setCompInfo({ ...comp });
        }
    }, [competitions, compID]);

    return (
        <>
            <StandardBackground />
            <div
                className="container bg-overlay-content pb-4 mb-md-3"
                style={{ marginTop: "-350px" }}
            >
                <div className="row full-height">
                    <SideBar />
                    <ViewTicketsTable tickets={tickets} comp={compInfo} />
                </div>
            </div>
        </>
    );
}
