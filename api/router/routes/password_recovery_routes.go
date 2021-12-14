package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var passwordRecoveryRoutes = []Route{
	{
		URI:          "/request-new-password",
		Method:       http.MethodPost,
		Handler:      controllers.RegisterNewPasswordRecoveryRequest,
		AuthRequired: false,
	},
	{
		URI:          "/set-new-password/{token}",
		Method:       http.MethodPost,
		Handler:      controllers.SetNewPassword,
		AuthRequired: false,
	},
}
