package routes

import (
	"net/http"
	"comp-performance/api/controllers"
)

var notificationSettingsRoutes = []Route{
	{
		URI: "/notification-settings/{id}",
		Method: http.MethodPost,
		Handler: controllers.UpdateNotificationSettingsByID,
		AuthRequired: true,
	},
}
