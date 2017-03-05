import "whatwg-fetch";
import action from '../action';

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

export default (url, options, method, body) => {
  return fetch(url, method === action.POST ? { ...options, method: 'POST', body } : options ).then(handleJson);
};
