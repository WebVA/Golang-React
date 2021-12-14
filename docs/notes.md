# Notes

1. use this to redirect ur client

```go
    w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, user.ID))
```
