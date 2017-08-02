/**
 * Handles an HTTP response with JSON body
 * @param {Object} response  - An HTTP response object
 * @returns {Promise}
 */
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