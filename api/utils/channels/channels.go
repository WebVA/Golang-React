package channels

// OK return true if the operation is successful, false otherwise
func OK(done chan bool) bool {
	select {
	case ok := <-done:
		if ok {
			return ok
		}
		return false
	}
}
