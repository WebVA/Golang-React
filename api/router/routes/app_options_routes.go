package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var appOptionsRoues = []Route{
	{
		URI:          "/get-app-options",
		Method:       http.MethodGet,
		Handler:      controllers.GetAppOptions,
		AuthRequired: false,
	},
	{
		URI:           "/add-app-options",
		Method:        http.MethodPost,
		Handler:       controllers.AddAppOptions,
		AuthRequired:  true,
		AdminRequired: true,
	},
	{
		URI:           "/update-app-options",
		Method:        http.MethodPost,
		Handler:       controllers.UpdateAppOptions,
		AuthRequired:  true,
		AdminRequired: true,
	},
}
