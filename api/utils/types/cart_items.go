package types

// CartItem single
type CartItem struct {
	ID       uint   `json:"id"`
	Price    int    `json:"price"`
	Name     string `json:"name"`
	Image    string `json:"image"`
	Currency string `json:"currency"`
}

// CartItems array
type CartItems []struct {
	ID       uint   `json:"id"`
	Price    int    `json:"price"`
	Name     string `json:"name"`
	Image    string `json:"image"`
	Currency string `json:"currency"`
}
