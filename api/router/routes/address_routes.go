package routes

import (
	"net/http"
	"comp-performance/api/controllers"
)

var addressRoutes = []Route{
	{
		URI: "/address/{id}",
		Method: http.MethodPost,
		Handler: controllers.UpdateAddressByID,
		AuthRequired: true,
	},
}
