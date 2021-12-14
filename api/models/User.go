package models

import (
	"comp-performance/api/security"
	"errors"
	"html"

	// "time"

	"github.com/badoux/checkmail"
	"gorm.io/gorm"
)

// User Schema
type User struct {
	Email                  string               `gorm:"column:email; unique" json:"email"`
	Role                   string               `gorm:"column:role; default:Null" json:"role"`
	Password               string               `gorm:"column:password" json:"password"`
	FirstName              string               `gorm:"column:first_name;" json:"first_name"`
	LastName               string               `gorm:"column:last_name;" json:"last_name"`
	Username               string               `gorm:"column:username;" json:"username"`
	Phone                  string               `gorm:"column:phone;" json:"phone"`
	EmailVerified          bool                 `gorm:"column:email_verified; default:False" json:"email_verified"`
	Address                Address              `json:"address,omitempty"`
	AddressID              int                  `gorm:"column:address_id;foreignKey:AddressID;references:ID" json:"address_id"`
	ReceiveMessages        bool                 `gorm:"column:receive_messages; default:False;" json:"receive_messages,"`
	NotificationSettingsID int                  `gorm:"column:notification_settings_id;foreignKey:NotificationSettingsID;references:ID" json:"notification_settings_id"`
	NotificationSettings   NotificationSettings `json:"notification_settings"`
	RewardPoints           int                  `gorm:"column:reward_points; default:0; " json:"reward_points"`
	gorm.Model
}

// TableName : users
func (u *User) TableName() string {
	return "user"
}

// BeforeSave hash the user password
func (u *User) BeforeSave(*gorm.DB) error {
	hashedPassword, err := security.Hash(u.Password)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

// Prepare cleans the input
func (u *User) Prepare() {
	u.ID = 0
	u.Email = html.EscapeString(u.Email)
	u.Username = html.EscapeString(u.Username)
}

// Validate the user before saving
func (u *User) Validate(action string) error {
	switch action {
	case "login":
		{

			if u.Email == "" {
				return errors.New("Email is required")
			}
			if err := checkmail.ValidateFormat(u.Email); err != nil {
				return errors.New("Invalid email")
			}
			if u.Password == "" {
				return errors.New("Password is required")
			}

		}
	default:
		{
			if u.Email == "" {
				return errors.New("Email is required")
			}
			if err := checkmail.ValidateFormat(u.Email); err != nil {
				return errors.New("Invalid email")
			}
			if u.Username == "" {
				return errors.New("Username is required")
			}
			if u.Password == "" {
				return errors.New("Password is required")
			}

		}
	}
	return nil
}
