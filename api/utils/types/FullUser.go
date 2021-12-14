package types

import (
	"comp-performance/api/models"
	"gorm.io/gorm"
)

// FullUser  represents the user
type FullUser struct {
	Email                  string               `gorm:"column:email; unique" json:"email"`
	Role                   string               `gorm:"column:role; default:Null" json:"role"`
	Password               string               `gorm:"column:password" json:"password"`
	FirstName              string               `gorm:"column:first_name;" json:"first_name"`
	LastName               string               `gorm:"column:last_name;" json:"last_name"`
	Username               string               `gorm:"column:username;" json:"username"`
	EmailVerified          bool                 `gorm:"column:email_verified; default:False" json:"email_verified"`
	Address                models.Address              `json:"address"`
	AddressID              int                  `gorm:"column:address_id;foreignKey:AddressID;references:ID" json:"address_id"`
	ReceiveMessages        bool                 `gorm:"column:receive_messages; default:False;" json:"receive_messages"`
	NotificationSettingsID int                  `gorm:"column:notification_settings_id;foreignKey:NotificationSettingsID;references:ID" json:"notification_settings_id"`
	NotificationSettings   models.NotificationSettings `json:"notification_settings"`
	gorm.Model
}
