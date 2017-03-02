import "whatwg-fetch";

const handleJson = (response) => {
  return response.json().catch(fatalError => {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }).then(json => {
    if(response.status >= 200 && response.status < 300) {
      return json;
    }
    throw json;
  })
};

export default (url, options) => {
  return fetch(url, options).then(handleJson);
};
