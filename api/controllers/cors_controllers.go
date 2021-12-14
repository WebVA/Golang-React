package controllers

import (
	"comp-performance/api/utils/cors"
	"net/http"
)

// AllowCors will accept the preflight request and pass it to the actual request
func AllowCors(w http.ResponseWriter, r *http.Request) {
	cors.EnableCors(&w)
}
