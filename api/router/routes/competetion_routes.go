package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var competitionRoutes = []Route{
	{
		URI:          "/competitions",
		Method:       http.MethodGet,
		Handler:      controllers.GetAllCompetitions,
		AuthRequired: false,
	},
	{
		URI:          "/competitions",
		Method:       http.MethodPost,
		Handler:      controllers.CreateCompetition,
		AuthRequired: true,
		AdminRequired: true,
	},
	{
		URI:          "/competitions/id/{id}",
		Method:       http.MethodGet,
		Handler:      controllers.GetCompetitionByID,
		AuthRequired: false,
	},
	{
		URI:          "/competitions/id/{id}",
		Method:       http.MethodDelete,
		Handler:      controllers.DeleteCompetitionByID,
		AuthRequired: true,
		AdminRequired: true,
	},
	{
		URI:          "/competitions/id/{id}",
		Method:       http.MethodPost,
		Handler:      controllers.UpdateCompetitionByID,
		AuthRequired: true,
		AdminRequired: true,
	},
}
