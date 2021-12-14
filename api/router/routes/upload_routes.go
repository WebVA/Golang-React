package routes

import (
	"net/http"
	"comp-performance/api/controllers"
)

var uploadRoutes = []Route{
	{
		URI:    "/upload/competition-image",
		Method: http.MethodPost,
		Handler: controllers.UploadCompetitionImage,
		AuthRequired: true,
		AdminRequired: true,
	},
	{
		URI:    "/upload/category-image",
		Method: http.MethodPost,
		Handler: controllers.UploadCategoryImage,
		AuthRequired: true,
		AdminRequired: true,
	},
}
