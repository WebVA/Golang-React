package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var paytriotRoutes = []Route{
	{
		URI:          "/paytriot/create-link",
		Method:       http.MethodPost,
		Handler:      controllers.CreatePaymentRequest,
		AuthRequired: true,
	},
}
