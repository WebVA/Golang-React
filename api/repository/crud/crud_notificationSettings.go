package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"errors"

	"gorm.io/gorm"
)

// RepositoryNotificationSettingsCrud organises all user curd with the db
type RepositoryNotificationSettingsCrud struct {
	db *gorm.DB
}

// NewRepositoryNotificationSettingsCrud constructor
func NewRepositoryNotificationSettingsCrud(db *gorm.DB) *RepositoryNotificationSettingsCrud {
	return &RepositoryNotificationSettingsCrud{db}
}

// Save new setting
func (r *RepositoryNotificationSettingsCrud) Save(setting models.NotificationSettings) (models.NotificationSettings, error) {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)
		err = r.db.Debug().Model(models.NotificationSettings{}).Create(&setting).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return setting, nil
	}

	return models.NotificationSettings{}, err
}

// FindAll users
func (r *RepositoryNotificationSettingsCrud) FindAll() ([]models.NotificationSettings, error) {
	var err error
	settings := []models.NotificationSettings{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.NotificationSettings{}).Find(&settings).Error
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if settings == nil {
		return nil, errors.New("No settings Found")
	}

	if channels.OK(done) {
		return settings, nil
	}
	return nil, err
}

// FindByID will Find user by ID
func (r *RepositoryNotificationSettingsCrud) FindByID(uid int) (models.NotificationSettings, error) {
	var err error
	setting := models.NotificationSettings{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.NotificationSettings{}).Find(&setting, "id = ?", uint(uid)).Error

		if err != nil {
			ch <- false
			return
		}

		if int(setting.ID) != uid {
			err = errors.New("record not found")
			ch <- false
			return

		}

		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return setting, err
		}
		return setting, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.NotificationSettings{}, errors.New("No setting with these data found")
	}

	if int(setting.ID) != uid {
		err = errors.New("No setting found")
		return setting, err

	}
	return models.NotificationSettings{}, err

}

// Update NotificationSettings data
func (r *RepositoryNotificationSettingsCrud) Update(id int, settings models.NotificationSettings) (models.NotificationSettings, error) {
	var err error
	ns := models.NotificationSettings{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.NotificationSettings{}).Find(&ns, "id = ?", uint(id)).Error
		if err != nil {
			ch <- false
			return
		}

		err = r.db.Debug().Model(&ns).Save(settings).Error
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if channels.OK(done) {

		return settings, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.NotificationSettings{}, errors.New("No NotificationSettings with these data found")
	}
	return models.NotificationSettings{}, err

}

// Delete a specific user by ID
func (r *RepositoryNotificationSettingsCrud) Delete(uid int) (int, error) {
	var rs *gorm.DB
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		rs = r.db.Debug().Model(&models.NotificationSettings{}).Where("id = ?", uid).Take(&models.NotificationSettings{}).Delete(&models.NotificationSettings{})
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
