package router

import (
	"comp-performance/api/router/routes"
	"github.com/gorilla/mux"
)

// New Router will be created, with all routes supplied ready.
func New() *mux.Router {
	r := mux.NewRouter().StrictSlash(true)
	return routes.SetupRoutesWithMiddlewares(r)
}
