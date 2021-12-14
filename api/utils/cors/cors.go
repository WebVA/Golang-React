package cors

import (
	"net/http"
)

// EnableCors to solve cors problem
func EnableCors(res *http.ResponseWriter) {
	// res.Header().Set("Content-Type", "application/json")
	(*res).Header().Set("Access-Control-Allow-Origin", "*")
	(*res).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*res).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}
