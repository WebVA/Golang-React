package auth

import (
	"comp-performance/api/database"
	"comp-performance/api/models"
	"comp-performance/api/security"
	"comp-performance/api/utils/channels"
	"comp-performance/api/utils/types"
	"comp-performance/config"
	"fmt"
	"gorm.io/gorm"
)

// SignIn method
func SignIn(email string, password string) (types.LoginResponse, error) {
	res := types.LoginResponse{}
	user := models.User{}
	var err error
	var db *gorm.DB

	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		db, err = database.Connect()
		if err != nil {
			ch <- false
			return
		}
		defer database.Close(db)
		err = db.Debug().Model(models.User{}).Where("email = ?", email).Take(&user).Error
		if err != nil {
			ch <- false
			return
		}

		err = security.VerifyPassword(user.Password, password)
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if channels.OK(done) {
		user.Password = ""
		token, err := GenerateJWT(user)
		if err != nil {
			return res, err
		}
		res.Token = string(token)
		res.User = user
		return res, nil
	}
	return res, err

}

func SendVerificationEmail(user models.User) (string, error) {

	token, err := GenerateJWTEmailToken(user.Email)

	if err != nil {
		return token, err
	}

	from_email := "noreply@comp-performance.co.uk"
	from_name := "Comp Performance Limited"
	to_email := user.Email
	to_name := user.FirstName

	htmlContent := ` <p> Hi  ` + user.FirstName + ` </p>
	<p> Thank for you for registering, please verify your account by clicking the link below  </p>
	<p>` + fmt.Sprintf("<a href=\"%s/verify-email/%s\">%s/verify-email/%s</a>", config.CLIENTURL, token, config.CLIENTURL, token) + `</p>
	<br>
	<p>Thanks</p>
	<p>Comp Performance Team</p>
	`

	err = SendEmail(from_email, from_name, to_email, to_name, "Confirm Your Email", "", htmlContent)

	if err != nil {
		return token, err
	}

	return token, nil
}

func SendPasswordRecoveryEmail(email string) (string, error) {

	token, err := GenerateJWTEmailToken(email)

	if err != nil {
		return token, err
	}

	from_email := "noreply@comp-performance.co.uk"
	from_name := "comp-performance team"
	to_email := email
	to_name := "comp-performance user"

	htmlContent := fmt.Sprintf(`<p> You are requesting a new password recovery.</p>
	<p>if you request this message by mistake, or you don't recognize this activity please ignore this message </p>
	<p>to set new password, please follow the link  below: </p>

	<a href="%s/set-new-password/%s">%s/set-new-password/%s</a>

	`, config.CLIENTURL, token, config.CLIENTURL, token)

	err = SendEmail(from_email, from_name, to_email, to_name, "confirm your email", "", htmlContent)

	if err != nil {
		return token, err
	}

	return token, nil
}
