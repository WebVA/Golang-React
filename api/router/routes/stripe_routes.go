package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var stripeRoutes = []Route{
	{
		URI:          "/stripe/create-session",
		Method:       http.MethodPost,
		Handler:      controllers.CreateCheckoutRedirectionSessionID,
		AuthRequired: true,
	},
	{
		URI:          "/stripe/get-session-data",
		Method:       http.MethodPost,
		Handler:      controllers.GetCheckoutSessionData,
		AuthRequired: true,
	},
	{
		URI:          "/stripe/create-coupon",
		Method:       http.MethodPost,
		Handler:      controllers.StripeCreateCoupon,
		AuthRequired: true,
	},
}
