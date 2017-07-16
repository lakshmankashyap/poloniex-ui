export default function jsonResponse(response) {
    let json;
    try {
      json = response.json();
    } catch (e) {
      return new Error(e);
    }

    if (response.status >= 200 && response.status < 300) {
      return json;
    } else {
      return json.then(Promise.reject.bind(Promise));
    }
  }