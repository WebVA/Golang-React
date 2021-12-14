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

// GetAllPrizes will return the first 100 coupons
func GetAllPrizes(w http.ResponseWriter, r *http.Request) {
	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close(db)

	repo := crud.NewRepositoryPrizeCrud(db)

	func(couponRepository repository.PrizeRepository) {
		coupons, err := couponRepository.FindAll()

		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
		}

		responses.JSON(w, http.StatusOK, coupons)

	}(repo)
}

// CreatePrize will save new coupon to the db and redirect to its page
func CreatePrize(w http.ResponseWriter, r *http.Request) {
	coupon := models.Prize{}
	err := json.NewDecoder(r.Body).Decode(&coupon)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryPrizeCrud(db)

	func(couponRepository repository.PrizeRepository) {
		coupon, err := couponRepository.Save(coupon)
		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, coupon.ID))
		responses.JSON(w, http.StatusCreated, err)
	}(repo)
}

// GetPrizeByID  will return the coupon with id specifies in the request
func GetPrizeByID(w http.ResponseWriter, r *http.Request) {
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

	repo := crud.NewRepositoryPrizeCrud(db)

	func(couponRepository repository.PrizeRepository) {
		coupon, err := couponRepository.FindByID(int(uid))

		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		responses.JSON(w, http.StatusOK, coupon)
	}(repo)
}

// UpdatePrizeByID will replace the coupon data with ones that comes form client
func UpdatePrizeByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uid, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	coupon := models.Prize{}
	err = json.NewDecoder(r.Body).Decode(&coupon)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryPrizeCrud(db)

	func(couponRepository repository.PrizeRepository) {
		rows, err := couponRepository.Update(int(uid), coupon)
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}

		responses.JSON(w, http.StatusOK, rows)

	}(repo)

}

// DeletePrizeByID will delete a coupon by its ID
func DeletePrizeByID(w http.ResponseWriter, r *http.Request) {
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

	repo := crud.NewRepositoryPrizeCrud(db)

	func(couponRepository repository.PrizeRepository) {
		_, err := couponRepository.Delete(int(uid))
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}
		w.Header().Set("Entity", fmt.Sprintf("%d", uid))
		responses.JSON(w, http.StatusNoContent, "")

	}(repo)

}
