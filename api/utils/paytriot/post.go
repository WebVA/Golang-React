package paytriot

import (
	"bytes"
	"comp-performance/config"
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

func generateSign(data map[string]string, keys []string) string {
	strToSign := ""

	for _, key := range keys {
		if key != "" {
			strToSign += key + ":" + data[key] + ":"
		}
	}
	strToSign += config.PAYTRIOT_MERCHANT_SECRET_KEY

	hash := md5.Sum([]byte(strToSign))
	return hex.EncodeToString(hash[:])
}

func postRequest(url string, postBody map[string]string, keys []string) (string, error) {

	postBody["key"] = config.PAYTRIOT_MERCHANT_KEY

	sign := generateSign(postBody, keys)
	postBody["sign"] = sign

	jsonBody, _ := json.Marshal(postBody)

	requestBody := bytes.NewBuffer(jsonBody)
	resp, err := http.Post(url, "application/json", requestBody)

	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	//Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	c := string(body)
	return c, nil
}
