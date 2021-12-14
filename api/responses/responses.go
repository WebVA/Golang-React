package responses

import (
	"comp-performance/api/utils/cors"
	"encoding/json"
	"net/http"
)

// JSON will encode data into response body as JSON format
func JSON(w http.ResponseWriter, statusCode int, data interface{}) {
	cors.EnableCors(&w)
	w.WriteHeader(statusCode)
	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		w.Write([]byte(err.Error()))
	}
}

// ERROR will encode errors into response body as JSON format
func ERROR(w http.ResponseWriter, statusCode int, err error) {
	cors.EnableCors(&w)
	if err != nil {
		JSON(w, statusCode, struct {
			Error string `json:"error"`
		}{
			Error: err.Error(),
		})
		return
	}
	JSON(w, statusCode, nil)

}
