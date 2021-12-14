package controllers

import (
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/gorilla/mux"

	// "log"
	"comp-performance/api/responses"
)

// ServeCompetitionImage will serve competition imgs for frontend
func ServeCompetitionImage(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)

	competitionID := vars["competitionID"]
	fileName := vars["fileName"]

	var path = fmt.Sprintf("uploads/images/competitions/%s/%s", competitionID, fileName)

	img, err := os.Open(path)
	if err != nil {
		fmt.Println(err) // perhaps handle this nicer
		responses.ERROR(w, http.StatusBadRequest, err)

	}
	defer img.Close()
	w.Header().Set("Content-Type", "image/jpg")
	io.Copy(w, img)
}

// ServeCategoryImage will serve competition imgs for frontend
func ServeCategoryImage(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)

	categoryID := vars["categoryID"]
	fileName := vars["fileName"]

	var path = fmt.Sprintf("uploads/images/categories/%s/%s", categoryID, fileName)

	img, err := os.Open(path)
	if err != nil {
		fmt.Println(err) // perhaps handle this nicer
		responses.ERROR(w, http.StatusBadRequest, err)

	}
	defer img.Close()
	w.Header().Set("Content-Type", "image/jpg")
	io.Copy(w, img)
}

func RemoveCategoryImage(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	categoryID := vars["categoryID"]
	fileName := vars["fileName"]

	var path = fmt.Sprintf("uploads/images/categories/%s/%s", categoryID, fileName)

	err := os.Remove(path)
	if err != nil {
		fmt.Println(err) // perhaps handle this nicer
		responses.ERROR(w, http.StatusBadRequest, err)

	}

	responses.JSON(w, http.StatusOK, 1)

}
