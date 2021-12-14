package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var indexRoutes = []Route{
	// {
	// 	URI:          "/",
	// 	Method:       http.MethodGet,
	// 	Handler:      controllers.Welcome,
	// 	AuthRequired: false,
	// },

	{
		URI:          "/check-user-token",
		Method:       http.MethodPost,
		Handler:      controllers.WelcomeLogin,
		AuthRequired: true,
	},
	{
		URI:           "/check-admin-token",
		Method:        http.MethodPost,
		Handler:       controllers.WelcomeAdmin,
		AuthRequired:  true,
		AdminRequired: true,
	},
}
