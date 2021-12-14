package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var sendGridRoutes = []Route{
	{
		URI:          "/sendgrid/contacts/search",
		Method:       http.MethodPost,
		Handler:      controllers.SearchContactsByEmail,
		AuthRequired: true,
	},
	{
		URI:          "/sendgrid/contacts/remove-from-list",
		Method:       http.MethodPost,
		Handler:      controllers.RemoveContactFromList,
		AuthRequired: true,
	},
}
