package controllers

import (
	
	"comp-performance/api/responses"
	// "fmt"
	"net/http"
)

type welcomeMessage struct {
	Msg         string `json:"msg"`
	Description string `json:"description"`
}

// Welcome is the entry point of our api
func Welcome(w http.ResponseWriter, r *http.Request) {
	fs := http.FileServer(http.Dir("./client/build/index.html"))
	// fmt.Println(fs)
	http.Handle("/", fs)
	return
	// message := welcomeMessage{
	// 	Msg:         "welcome to comp-performance api",
	// 	Description: "We're tired of big prizes with even bigger odds and constantly extending entry dates. Our mission is to provide good competitions with incredible odds. Join our ever extending winners list!",
	// }
	// responses.JSON(
	// 	w,
	// 	http.StatusOK,
	// 	message,
	// )
}

// WelcomeLogin is to check login token
func WelcomeLogin(w http.ResponseWriter, r *http.Request) {
	message := welcomeMessage{
		Msg:         "true",
		Description: "Authorized!",
	}
	responses.JSON(
		w,
		http.StatusOK,
		message,
	)
}

// WelcomeAdmin is to  check admin's token
func WelcomeAdmin(w http.ResponseWriter, r *http.Request) {
	message := welcomeMessage{
		Msg:         "true",
		Description: "Admin",
	}
	responses.JSON(
		w,
		http.StatusOK,
		message,
	)
}

