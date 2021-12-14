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

// GetAllCategories will return the first 100 GetAllCategories
func GetAllCategories(w http.ResponseWriter, r *http.Request) {
	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close(db)

	repo := crud.NewRepositoryCategoryCrud(db)

	func(categoryRepository repository.CategoryRepository) {
		GetAllCategories, err := categoryRepository.FindAll()

		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
		}

		responses.JSON(w, http.StatusOK, GetAllCategories)

	}(repo)
}

// CreateCategory will save new cat to the db and redirect to its page
func CreateCategory(w http.ResponseWriter, r *http.Request) {
	cat := models.Category{}
	err := json.NewDecoder(r.Body).Decode(&cat)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryCategoryCrud(db)

	func(categoryRepository repository.CategoryRepository) {
		cat, err := categoryRepository.Save(cat)
		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, cat.ID))
		responses.JSON(w, http.StatusCreated, cat)
	}(repo)
}

// GetCategoryByID will return the cat with id specifies in the request
func GetCategoryByID(w http.ResponseWriter, r *http.Request) {
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

	repo := crud.NewRepositoryCategoryCrud(db)

	func(categoryRepository repository.CategoryRepository) {
		cat, err := categoryRepository.FindByID(int(uid))

		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		responses.JSON(w, http.StatusOK, cat)
	}(repo)
}

// UpdateCategoryByID will replace the cat data with ones that comes form client
func UpdateCategoryByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uid, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	cat := models.Category{}
	err = json.NewDecoder(r.Body).Decode(&cat)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}

	defer database.Close(db)
	repo := crud.NewRepositoryCategoryCrud(db)

	func(categoryRepository repository.CategoryRepository) {
		fmt.Printf("cat >>>>>>>>>>>>>> %v\n",  cat)
		rows, err := categoryRepository.Update(int(uid), cat)
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}

		responses.JSON(w, http.StatusOK, rows)

	}(repo)

}

// DeleteCategoryByID will delete a cat by its ID
func DeleteCategoryByID(w http.ResponseWriter, r *http.Request) {
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

	repo := crud.NewRepositoryCategoryCrud(db)

	func(categoryRepository repository.CategoryRepository) {
		_, err := categoryRepository.Delete(int(uid))
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}
		w.Header().Set("Entity", fmt.Sprintf("%d", uid))
		responses.JSON(w, http.StatusNoContent, "")

	}(repo)

}
