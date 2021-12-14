package controllers

import (
	"comp-performance/api/database"
	"comp-performance/api/models"
	"comp-performance/api/repository"
	"comp-performance/api/repository/crud"
	"comp-performance/api/responses"
	// compErrors "comp-performance/api/utils/errors"
	"comp-performance/api/auth"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
)

// GetAllOrders will return the first 100 coupons
func GetAllOrders(w http.ResponseWriter, r *http.Request) {
	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close(db)

	repo := crud.NewRepositoryOrderCrud(db)

	func(orderRepository repository.OrderRepository) {
		coupons, err := orderRepository.FindAll()

		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
		}

		responses.JSON(w, http.StatusOK, coupons)

	}(repo)
}

// GetAllFullOrders will return the first 100 coupons
func GetAllFullOrders(w http.ResponseWriter, r *http.Request) {
	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close(db)

	repo := crud.NewRepositoryOrderCrud(db)

	func(orderRepository repository.OrderRepository) {
		coupons, err := orderRepository.FindAllFullOrders()

		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
		}

		responses.JSON(w, http.StatusOK, coupons)

	}(repo)
}

// CreateOrder will save new order to the db and redirect to its page
func CreateOrder(w http.ResponseWriter, r *http.Request) {
	type reqData struct {
		Order models.Order
		User  models.User
	}
	// order := models.Order{}
	rr := reqData{}
	err := json.NewDecoder(r.Body).Decode(&rr)
	if err != nil {
		fmt.Println(err)
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	order := rr.Order
	user := rr.User

	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)
	repo := crud.NewRepositoryOrderCrud(db)

	func(orderRepository repository.OrderRepository) {
		dbOrder, err := orderRepository.Save(order)
		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		emailContent := crud.GenerateOrderEmail(order, dbOrder, user)

		fmt.Println(emailContent)

		from_email := "orders@comp-performance.co.uk"
		from_name := "Comp Performance Limited"
		to_email := user.Email
		to_name := user.FirstName + " " + user.LastName
		subject := fmt.Sprintf("Thanks for your order! #%d", int(dbOrder.ID))

		// err = auth.SendEmail(from_email, from_name, to_email, to_name, subject, "", emailContent)

		// // send BCC to comp-performance.co.uk+25b61e232f@invite.trustpilot.com
		trustPilotEmail := "comp-performance.co.uk+25b61e232f@invite.trustpilot.com"
		// err = auth.SendEmail(from_email, from_name, trustPilotEmail, to_name, subject, "", emailContent)

		err = auth.SendEmailWithBcc(to_name, to_email, trustPilotEmail, "", subject, from_name, from_email, emailContent)
		w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, order.ID))
		responses.JSON(w, http.StatusCreated, dbOrder)
	}(repo)
}

// GetOrderByID will return the order with id specifies in the request
func GetOrderByID(w http.ResponseWriter, r *http.Request) {
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

	repo := crud.NewRepositoryOrderCrud(db)

	func(orderRepository repository.OrderRepository) {
		order, err := orderRepository.FindByID(uint(uid))

		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		responses.JSON(w, http.StatusOK, order)
	}(repo)
}

// GetFullOrderByID will return the order with id specifies in the request
func GetFullOrderByID(w http.ResponseWriter, r *http.Request) {
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

	repo := crud.NewRepositoryOrderCrud(db)

	func(orderRepository repository.OrderRepository) {
		order, err := orderRepository.FindFullOrderByID(uint(uid))

		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		responses.JSON(w, http.StatusOK, order)
	}(repo)
}

// UpdateOrderByID will replace the order data with ones that comes form client
func UpdateOrderByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uid, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	order := models.Order{}
	err = json.NewDecoder(r.Body).Decode(&order)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryOrderCrud(db)

	func(orderRepository repository.OrderRepository) {
		rows, err := orderRepository.Update(int(uid), order)
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}

		responses.JSON(w, http.StatusOK, rows)

	}(repo)

}

// DeleteOrderByID will delete a order by its ID
func DeleteOrderByID(w http.ResponseWriter, r *http.Request) {
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

	repo := crud.NewRepositoryOrderCrud(db)

	func(orderRepository repository.OrderRepository) {
		_, err := orderRepository.Delete(int(uid))
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}
		w.Header().Set("Entity", fmt.Sprintf("%d", uid))
		responses.JSON(w, http.StatusNoContent, "")

	}(repo)

}

// GetOrdersByBuyerID will return the order with id specifies in the request
func GetOrdersByBuyerID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	buyerID, err := strconv.ParseInt(vars["id"], 10, 64)

	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryOrderCrud(db)

	func(orderRepository repository.OrderRepository) {
		orders, err := orderRepository.FindByBuyerID(uint(buyerID))

		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		responses.JSON(w, http.StatusOK, orders)
	}(repo)
}
