package controllers

import (
	"comp-performance/api/database"
	"comp-performance/api/models"
	"comp-performance/api/repository"
	"comp-performance/api/repository/crud"
	"comp-performance/api/responses"
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
)

// UpdateAddressByID will accept the preflight request and pass it to the actual request
func UpdateAddressByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uid, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	addr := models.Address{}
	err = json.NewDecoder(r.Body).Decode(&addr)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db);

	repo := crud.NewRepositoryAddressCrud(db)

	func(userRepository repository.AddressRepository) {
		rows, err := userRepository.Update(int(uid), addr)
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}

		responses.JSON(w, http.StatusOK, rows)

	}(repo)

}
