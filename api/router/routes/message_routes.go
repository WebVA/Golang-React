package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var messageRoutes = []Route{
	{
		URI:          "/messages/{id}",
		Method:       http.MethodGet,
		Handler:      controllers.GetAllMessagesByUserId,
		AuthRequired: false,
	},
	{
		URI:           "/messages",
		Method:        http.MethodPost,
		Handler:       controllers.CreateMessage,
		AuthRequired:  false,
		AdminRequired: true,
	},
}
