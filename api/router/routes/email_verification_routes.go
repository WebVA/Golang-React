package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var emailVerificationRoutes = []Route{
	{
		URI:          "/verify-email/{token}",
		Method:       http.MethodGet,
		Handler:      controllers.VerifyUserAccount,
		AuthRequired: false,
	},
	{
		URI:          "/resend-email-verification",
		Method:       http.MethodPost,
		Handler:      controllers.ResendVerificationEmail,
		AuthRequired: true,
	},
}
