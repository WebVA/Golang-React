package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var loginRoutes = []Route{
	{
		URI:          "/login",
		Method:       http.MethodPost,
		Handler:      controllers.Login,
		AuthRequired: false,
	},
}
