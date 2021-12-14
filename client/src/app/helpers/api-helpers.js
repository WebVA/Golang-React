export async function fetchPostJSON({ url, token, data }) {
  const result = {
    error: null,
    result: null,
    statusCode: null,
  };

  // const headers = {
  //   // "Content-Type": "application/json",
  //   // 'Content-Type': 'application/x-www-form-urlencoded',
  //   "Content-Type": "text/plain",
  // };

  // const headersWithToken = {
  //   "Content-Type": "text/plain",
  //   Authorization: `Bearer ${token}`,
  // };
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      // mode: "cors", // no-cors, *cors, same-origin
      //   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      //   credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "text/plain",
        Authorization: token ? `Bearer ${token}` : null,
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data || {}), // body data type must match "Content-Type" header
    });

    result.statusCode = response.status;

    if (response.statusCode === 201) {
      return result;
    }

    if (response.statusCode === 404) {
      return result;
    }
    const _res = await response.json(); // parses JSON response into native JavaScript objects
    if (_res?.error) {
      result.error = _res.error;
      return result;
    }
    result.result = _res;
    return result;
  } catch (err) {
    // throw new Error(err.message);
    console.error(err.message);
    result.error = err.message;
    return result;
  }
}

export async function fetchGetJSON(url, token = null) {
  const result = {
    error: null,
    result: null,
  };
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      //   mode: "cors", // no-cors, *cors, same-origin
      //   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      //   credentials: "same-origin", // include, *same-origin, omit
      headers: {
        // "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        "Content-Type": "text/plain",
        Authorization: token ? `Bearer ${token}` : null,
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
    });

    if (response.statusCode === 201) {
      result.result = 1;
      return result;
    }
    const _res = await response.json(); // parses JSON response into native JavaScript objects
    if (_res?.error) {
      result.error = _res.error;
      return result;
    }
    result.result = _res;
    return result;
  } catch (err) {
    // throw new Error(err.message);
    console.error(err.message);
    result.error = err.message;
    return result;
  }
}

export async function fetchProtectedApi(url, method, key, data = null) {
  const result = {
    error: null,
    result: null,
  };
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data || {}), // body data type must match "Content-Type" header
    });
    const _res = await response.json(); // parses JSON response into native JavaScript objects
    if (_res?.errors) {
      result.error = _res.errors;
      return result;
    }
    result.result = _res;
    return result;
  } catch (err) {
    console.error(err);
    result.error = err;
    return result;
  }
}

export async function fetchDeleteJSON( url, token ) {
  const result = {
    error: null,
    result: null,
  };

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "text/plain",
        Authorization: token ? `Bearer ${token}` : null,
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });

    if (response.statusCode === 201) {
      return result;
    }
    if (response.statusCode === 404) {
      return result;
    }
    const _res = await response.json();
    if (_res?.error) {
      result.error = _res.error;
      return result;
    }
    result.result = _res;
    return result;
  } catch (err) {
    console.error(err.message);
    result.error = "something went wrong, can't complete the operation";
    // result.error = err.message;
    return result;
  }
}
