package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var ticketRoutes = []Route{
	{
		URI:          "/tickets/cid/{competitionID}",
		Method:       http.MethodGet,
		Handler:      controllers.GetAllTickets,
		AuthRequired: false,
	},
	{
		URI:           "/tickets/cid/{competitionID}",
		Method:        http.MethodPost,
		Handler:       controllers.CreateTicket,
		AuthRequired:  true,
		AdminRequired: true,
	},
	{
		URI:          "/tickets/cid/{competitionID}/tid/{ticketID}",
		Method:       http.MethodGet,
		Handler:      controllers.GetTicketByID,
		AuthRequired: false,
	},
	{
		URI:           "/tickets/cid/{competitionID}/tid/{ticketID}",
		Method:        http.MethodDelete,
		Handler:       controllers.DeleteTicketByID,
		AuthRequired:  true,
		AdminRequired: true,
	},
	{
		URI:          "/tickets/lock-ticket/cid/{competitionID}",
		Method:       http.MethodPost,
		Handler:      controllers.LockTicket,
		AuthRequired: false,
	},
	{
		URI:           "/tickets/cid/{competitionID}/tid/{ticketID}",
		Method:        http.MethodPost,
		Handler:       controllers.UpdateTicketByID,
		AuthRequired:  true,
		AdminRequired: true,
	},
}
