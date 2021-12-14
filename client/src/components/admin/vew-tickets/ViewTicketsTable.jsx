import React from 'react';
import { isDatePassed } from "../../../app/helpers/utils";
import { useHistory } from "react-router-dom";

export default function ViewTicketsTable({ tickets, comp }) {
    const history = useHistory();
    return (
        <div className="col-lg-8">
            <div className="d-flex flex-column h-100 bg-light rounded-lg box-shadow-lg p-4">
                <div className="py-2 p-md-3">
                    <div style={{ display: "block" }}>
                        <div className="row mb-3">
                            <div className="col-3 text-primary text-center" ><button className="btn btn-primary" onClick={() => history.goBack()}>back &#129152; </button></div>
                            <div className="col-8"><h1>{comp?.title}</h1></div>
                        </div>
                        <div className="row">
                            {tickets.map((t, i) => {
                                const sold = t.sold === true;
                                const locked = !t.sold && !isDatePassed(t.locked_till);
                                const free = !sold && !locked
                                return (
                                    <React.Fragment key={`ticket-view-${i}-${i + Math.random()}`}>
                                        {sold && <TicketCell ticket={t} status='sold' />}
                                        {locked && <TicketCell ticket={t} status='locked' />}
                                        {free && <TicketCell ticket={t} status='free' />}
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const TicketCell = ({ ticket, status }) => {
    let bgColor = '#67e088';
    if (status === 'sold') { bgColor = 'red' }
    else if (status === 'locked') { bgColor = '#f19638' }
    return (<div style={{ display: "block", width: "75px", color: "white", backgroundColor: bgColor, height: '28px', margin: '5px 5px', fontSize: '1rem', padding: '2px' }} className="text-center" >{ticket.ID}</div>);
}
