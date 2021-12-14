package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var prizeRoutes = []Route{
	{
		URI:           "/prizes",
		Method:        http.MethodGet,
		Handler:       controllers.GetAllPrizes,
		AuthRequired:  true,
	},
	{
		URI:           "/prizes",
		Method:        http.MethodPost,
		Handler:       controllers.CreatePrize,
		AuthRequired:  true,
		AdminRequired: true,
	},
	{
		URI:           "/prizes/id/{id}",
		Method:        http.MethodGet,
		Handler:       controllers.GetPrizeByID,
		AuthRequired:  true,
		AdminRequired: true,
	},
	{
		URI:           "/prizes/id/{id}",
		Method:        http.MethodDelete,
		Handler:       controllers.DeletePrizeByID,
		AuthRequired:  true,
		AdminRequired: true,
	},
	{
		URI:           "/prizes/id/{id}",
		Method:        http.MethodPost,
		Handler:       controllers.UpdatePrizeByID,
		AuthRequired:  true,
		AdminRequired: true,
	},
}
