package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var imageRoutes = []Route{
	{
		URI:          "/image/cid/{competitionID}/f/{fileName}",
		Method:       http.MethodGet,
		Handler:      controllers.ServeCompetitionImage,
		AuthRequired: false,
	},
	{
		URI:          "/image/cat-id/{categoryID}/f/{fileName}",
		Method:       http.MethodGet,
		Handler:      controllers.ServeCategoryImage,
		AuthRequired: false,
	},

	{
		URI:          "/image/cat-id/{categoryID}/f/{fileName}",
		Method:       http.MethodDelete,
		Handler:      controllers.RemoveCategoryImage,
		AuthRequired: false,
	},
}
