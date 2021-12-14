package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/repository"
	"comp-performance/api/security"
	"comp-performance/api/utils/channels"
	"errors"
	// "fmt"

	// "log"

	"gorm.io/gorm"
)

// RepositoryUserCrud organises all user curd with the db
type RepositoryUserCrud struct {
	db *gorm.DB
}

// NewRepositoryUserCrud constructor
func NewRepositoryUserCrud(db *gorm.DB) *RepositoryUserCrud {
	return &RepositoryUserCrud{db}
}

// Save new user
func (r *RepositoryUserCrud) Save(user models.User) (models.User, error) {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)

		if user.Role == "admin" {
			ch <- false
			err = errors.New("401, you are not authprized")
			return
		}

		err = r.db.Debug().Model(models.User{}).Create(&user).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return user, nil
	}

	return models.User{}, err
}

// FindAll users
func (r *RepositoryUserCrud) FindAll() ([]models.User, error) {
	var err error
	users := []models.User{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.User{}).Find(&users).Error
		if err != nil {
			ch <- false
			return
		}
		for i := range users {

			err = r.db.Preload("Address", "id = ?", users[i].AddressID).Find(&users[i]).Error
			if err != nil {
				ch <- false
				return
			}

			err = r.db.Preload("Country", "code = ?", users[i].Address.CountryCode).Find(&users[i].Address).Error
			if err != nil {
				ch <- false
				return
			}

			err = r.db.Preload("NotificationSettings", "id = ?", users[i].NotificationSettingsID).Find(&users[i]).Error
			if err != nil {
				ch <- false
				return
			}
		}

		ch <- true
	}(done)

	if users == nil {
		return nil, errors.New("No users Found")
	}

	if channels.OK(done) {
		return users, nil
	}
	return nil, err
}

// FindByID will Find user by ID
func (r *RepositoryUserCrud) FindByID(uid int) (models.User, error) {
	var err error
	user := models.User{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.User{}).Find(&user, "id = ?", uint(uid)).Error

		if err != nil {
			ch <- false
			return
		}

		if int(user.ID) != uid {
			err = errors.New("record not found")
			ch <- false
			return

		}
		err = r.db.Preload("Address", "id = ?", user.AddressID).Find(&user).Error
		if err != nil {
			ch <- false
			return
		}

		err = r.db.Preload("Country", "code = ?", user.Address.CountryCode).Find(&user.Address).Error
		if err != nil {
			ch <- false
			return
		}

		err = r.db.Preload("NotificationSettings", "id = ?", user.NotificationSettingsID).Find(&user).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return user, err
		}
		return user, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.User{}, errors.New("No user with these data found")
	}

	if int(user.ID) != uid {
		err = errors.New("No user found")
		return user, err

	}
	return models.User{}, err

}

// FindByEmail will Find user by ID
func (r *RepositoryUserCrud) FindByEmail(email string) (models.User, error) {
	var err error
	user := models.User{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.User{}).Find(&user, "email = ?", email).Error

		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return user, err
		}
		return user, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.User{}, errors.New("No user with these data found")
	}
	return models.User{}, err

}

// UpdateRewardPoints
func (r *RepositoryUserCrud) UpdateRewardPoints(user models.User) error {
	err := r.db.Debug().Model(&user).Update("reward_points", user.RewardPoints).Error
	if err != nil {
		return err
	}

	return nil
}

// Update User data
func (r *RepositoryUserCrud) Update(uid int, user models.User) (int, error) {
	var err error
	var u = models.User{}

	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err = r.db.Debug().Model(&models.User{}).Find(&u, "id = ?", uint(uid)).Error
		// err = r.db.Debug().Table("user").Save(&user).Error
		if err != nil {
			ch <- false
			return
		}

		if user.Role == "admin" {
			ch <- false
			err = errors.New("401, you are not authprized")
			return
		}

		err = r.db.Debug().Model(&u).Updates(user).Error
		// err = r.db.Save(&user).Error;
		// err = r.db.Debug().Clauses(r.db.Model(&models.User{}).Where("id = ?", uint(uid))).OnConflict{DoNothing: true}.Updates(user)

		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return 0, err
		}
		return 1, nil
	}

	return 0, nil
}

// Delete a specific user by ID
func (r *RepositoryUserCrud) Delete(uid int) (int, error) {
	var rs *gorm.DB
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		rs = r.db.Debug().Model(&models.User{}).Where("id = ?", uid).Take(&models.User{}).Delete(&models.User{})
		ch <- true
	}(done)

	if channels.OK(done) {
		if rs.Error != nil {
			return 0, rs.Error
		}

		return int(rs.RowsAffected), nil
	}

	return 0, rs.Error
}

// AttachAddressAndCountryToUser repopulate Address and  country and return them back with the user data
func (r *RepositoryUserCrud) AttachAddressAndCountryToUser(db *gorm.DB, user models.User) (models.User, error) {
	if user.ID == 0 {
		return user, nil
	}
	addr := models.Address{}
	ctr := models.Country{}
	var err error

	repoAddress := NewRepositoryAddressCrud(db)
	repoCountry := NewRepositoryCountryCrud(db)

	func(addressRepository repository.AddressRepository) {
		addr, err = addressRepository.FindAddressByID(user.AddressID)
	}(repoAddress)

	if err != nil {
		return user, err
	}

	func(countryRepository repository.CountryRepository) {
		ctr, err = countryRepository.FindCountryByCode(addr.CountryCode)
	}(repoCountry)

	if err != nil {
		return user, err
	}

	addr.Country = ctr

	user.Address = addr

	return user, nil
}

// VerifyAccount will verify user account
func (r *RepositoryUserCrud) VerifyAccount(db *gorm.DB, email string) error {
	repo := NewRepositoryUserCrud(db)

	user, err := repo.FindByEmail(email)
	if err != nil {
		return err
	}

	err = r.db.Debug().Model(&user).Update("email_verified", true).Error
	if err != nil {
		return err
	}

	return nil
}

// UpdatePassword will verify user account
func (r *RepositoryUserCrud) UpdatePassword(db *gorm.DB, email string, pass string) error {
	repo := NewRepositoryUserCrud(db)

	user, err := repo.FindByEmail(email)
	if err != nil {
		return err
	}

	hashedPassword, err := security.Hash(pass)
	if err != nil {
		return err
	}

	// fmt.Println("hasing password >>>>>>>>", pass, string(hashedPassword))

	err = r.db.Debug().Model(&user).Update("password", string(hashedPassword)).Error
	if err != nil {
		return err
	}

	return nil
}
