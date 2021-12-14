package controllers

import (
	"comp-performance/api/database"
	"comp-performance/api/models"
	"comp-performance/api/repository"
	"comp-performance/api/repository/crud"
	"comp-performance/api/responses"
	"encoding/json"
	// "fmt"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
)

// UpdateNotificationSettingsByID will accept the preflight request and pass it to the actual request
func UpdateNotificationSettingsByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uid, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	ns := models.NotificationSettings{}
	err = json.NewDecoder(r.Body).Decode(&ns)

	// fmt.Println("ns >>>>>>>>>>>>>>>", ns)

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db);

	repo := crud.NewRepositoryNotificationSettingsCrud(db)

	func(nsRepo repository.NotificationSettingsRepository) {
		rows, err := nsRepo.Update(int(uid), ns)
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}

		responses.JSON(w, http.StatusOK, rows)

	}(repo)

}
