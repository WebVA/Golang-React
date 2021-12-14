package controllers

import (
	"comp-performance/api/responses"
	// "comp-performance/api/utils/cors"
	"fmt"
	"io/ioutil"
	"net/http"

	// "log"
	"comp-performance/api/database"
	"os"
	"path/filepath"
	"strconv"
)

type msgToClient struct {
	Msg string `json:"msg"`
}

// UploadCompetitionImage will upload competition image
func UploadCompetitionImage(w http.ResponseWriter, r *http.Request) {
	// fmt.Println("Uploading .......")
	r.ParseMultipartForm(10 << 20)

	file, _, err := r.FormFile("image")

	if err != nil {
		fmt.Println("Error Retrieving the File")
		fmt.Println(err)
		return
	}

	defer file.Close()
	err = r.ParseForm()
	if err != nil {
		fmt.Println(err)
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	competitionID := r.Form["competitionID"][0]
	competitionName := r.Form["competitionName"][0]
	imageIndex := r.Form["index"][0]

	// fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	// fmt.Printf("File Size: %+v\n", handler.Size)
	// fmt.Printf("MIME Header: %+v\n", handler.Header)

	// Create a temporary file within our temp-images directory that follows
	// a particular naming pattern

	_, err = os.Stat(fmt.Sprintf("uploads/images/competitions/%s", competitionID))

	// fmt.Println(info, err)

	if os.IsNotExist(err) {
		os.Mkdir(fmt.Sprintf("uploads/images/competitions/%s", competitionID), os.ModePerm)
	}

	tempFile, err := ioutil.TempFile(fmt.Sprintf("uploads/images/competitions/%s", competitionID), fmt.Sprintf("%s-%s-*.jpg", competitionName, imageIndex))

	if err != nil {
		fmt.Println(err)
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	defer tempFile.Close()

	// read all of the contents of our uploaded file into a
	// byte array
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		fmt.Println(err)
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	// write this byte array to our temporary file
	tempFile.Write(fileBytes)

	// fmt.Println("added file name :  >>>>>>>>>> ", tempFile.Name())

	res := msgToClient{
		Msg: "Successfully Uploaded File",
	}

	responses.JSON(w, http.StatusOK, res)
}

func UploadCategoryImage(w http.ResponseWriter, r *http.Request) {
	// fmt.Println("Uploading .......")
	r.ParseMultipartForm(10 << 20)

	file, _, err := r.FormFile("image")

	if err != nil {
		fmt.Println("Error Retrieving the File")
		fmt.Println(err)
		return
	}

	defer file.Close()
	err = r.ParseForm()
	if err != nil {
		fmt.Println(err)
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	categoryID := r.Form["categoryID"][0]
	categoryName := r.Form["categoryName"][0]

	// fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	// fmt.Printf("File Size: %+v\n", handler.Size)
	// fmt.Printf("MIME Header: %+v\n", handler.Header)

	// Create a temporary file within our temp-images directory that follows
	// a particular naming pattern

	_, err = os.Stat(fmt.Sprintf("uploads/images/categories/%s", categoryID))

	// fmt.Println(info, err)

	if os.IsNotExist(err) {
		os.Mkdir(fmt.Sprintf("uploads/images/categories/%s", categoryID), os.ModePerm)
	}

	tempFile, err := ioutil.TempFile(fmt.Sprintf("uploads/images/categories/%s", categoryID), fmt.Sprintf("%s-*.jpg", categoryName))

	if err != nil {
		fmt.Println(err)
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	defer tempFile.Close()

	// read all of the contents of our uploaded file into a
	// byte array
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		fmt.Println(err)
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	// write this byte array to our temporary file
	tempFile.Write(fileBytes)

	fmt.Println("added file name :  >>>>>>>>>> ", tempFile.Name())

	res := msgToClient{
		Msg: "Successfully Uploaded File",
	}

	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close(db)

	cid, err := strconv.ParseInt(categoryID, 10, 64)
	addedFilePath := tempFile.Name()
	addFileName := filepath.Base(addedFilePath)

	err = db.Exec(fmt.Sprintf("UPDATE category SET image=\"%s\" WHERE id =%d", addFileName, cid)).Error

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, res)
}
