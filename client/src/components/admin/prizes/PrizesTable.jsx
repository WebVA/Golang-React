import React from 'react'

export default function PrizesTable({ prizes, setSelectedPrizeToEdit }) {
    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between pb-2">
                <h1 className="h3 mb-3 text-center text-sm-left">
                    All Prizes
              </h1>
            </div>

            <table className="table" style={{ fontSize: "12px" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>title</th>
                        <th>type</th>
                        <th>points required</th>
                        <th>prize value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                {prizes?.filter(p => p.points_required).map((p) => {
                    return (
                        <tr key={"pr-tr-" + p.ID}>
                            <td>{p.ID}</td>
                            <td> {p.title}</td>
                            <td>{p.type}</td>
                            <td> {p.points_required}</td>
                            <td>{p.prize_value}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => { setSelectedPrizeToEdit(p) }}>Edit </button>
                            </td>
                        </tr>
                    );
                })}
            </table>
        </>
    )
}
