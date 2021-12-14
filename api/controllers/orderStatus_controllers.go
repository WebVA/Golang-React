package controllers

import (
	"comp-performance/api/database"
	"comp-performance/api/models"
	"comp-performance/api/repository"
	"comp-performance/api/repository/crud"
	"comp-performance/api/responses"
	// compErrors "comp-performance/api/utils/errors"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
)

// GetAllOrderStatuses will return the first 100 coupons
func GetAllOrderStatuses(w http.ResponseWriter, r *http.Request) {
	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close(db)

	repo := crud.NewRepositoryOrderStatusCrud(db)

	func(orderStatusRepository repository.OrderStatusRepository) {
		coupons, err := orderStatusRepository.FindAll()

		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
		}

		responses.JSON(w, http.StatusOK, coupons)

	}(repo)
}

// CreateOrderStatus will save new orderStatus to the db and redirect to its page
func CreateOrderStatus(w http.ResponseWriter, r *http.Request) {
	orderStatus := models.OrderStatus{}
	err := json.NewDecoder(r.Body).Decode(&orderStatus)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryOrderStatusCrud(db)

	func(orderStatusRepository repository.OrderStatusRepository) {
		orderStatus, err := orderStatusRepository.Save(orderStatus)
		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, orderStatus.ID))
		responses.JSON(w, http.StatusCreated, err)
	}(repo)
}

// GetOrderStatusByID will return the orderStatus with id specifies in the request
func GetOrderStatusByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uid, err := strconv.ParseInt(vars["id"], 10, 64)

	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryOrderStatusCrud(db)

	func(orderStatusRepository repository.OrderStatusRepository) {
		orderStatus, err := orderStatusRepository.FindByID(int(uid))

		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		responses.JSON(w, http.StatusOK, orderStatus)
	}(repo)
}

// UpdateOrderStatusByID will replace the orderStatus data with ones that comes form client
func UpdateOrderStatusByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uid, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	orderStatus := models.OrderStatus{}
	err = json.NewDecoder(r.Body).Decode(&orderStatus)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryOrderStatusCrud(db)

	func(orderStatusRepository repository.OrderStatusRepository) {
		rows, err := orderStatusRepository.Update(int(uid), orderStatus)
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}

		responses.JSON(w, http.StatusOK, rows)

	}(repo)

}

// DeleteOrderStatusByID will delete a orderStatus by its ID
func DeleteOrderStatusByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uid, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryOrderStatusCrud(db)

	func(orderStatusRepository repository.OrderStatusRepository) {
		_, err := orderStatusRepository.Delete(int(uid))
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}
		w.Header().Set("Entity", fmt.Sprintf("%d", uid))
		responses.JSON(w, http.StatusNoContent, "")

	}(repo)

}
