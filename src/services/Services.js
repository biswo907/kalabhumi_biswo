import {APIURL} from '../constants/resource.jsx';
import {fetch} from 'react-native-ssl-pinning';
const apiUrl = APIURL.apiUrl;
export const generateOTP = data => {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'text/plain'},
    body: data,
    sslPinning: {
      certs: ['mycert'],
    },
  };
  console.log("BEFORE PROMISE----")
  return new Promise((resolve, reject) => {
    fetch(apiUrl + '/allowAll/generate-otp', requestOptions)
      .then(response => {
        console.log(response)
         return response.json()})
      .then(json => {
        resolve(json);
      })
      .catch(error => {
        console.log(error)
        return reject(error)});
    // .finally(() => );
  });
};
export const authenticateOTP = data => {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'text/plain'},
    body: data,
    sslPinning: {
      certs: ['mycert'],
    },
  };
  return new Promise((resolve, reject) => {
    fetch(apiUrl + '/allowAll/authenticate', requestOptions)
      .then(response => response.json())
      .then(json => {
        resolve(json);
      })
      .catch(error => reject(error));
    // .finally(() => );
  });
};
export const logOut = token => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: '',
    sslPinning: {
      certs: ['mycert'],
    },
  };
  return new Promise((resolve, reject) => {
    fetch(apiUrl + '/sign-off', requestOptions)
      .then(response => response.json())
      .then(json => {
        resolve(json);
      })
      .catch(error => reject(error));
    // .finally(() => );
  });
};
export const getUserProfile = token => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    body: '',
    sslPinning: {
      certs: ['mycert'],
    },
  };
  return new Promise((resolve, reject) => {
    fetch(apiUrl + '/user/get-profile', requestOptions)
      .then(response => response.json())
      .then(json => {
        resolve(json);
      })
      .catch(error => reject(error));
    // .finally(() => );
  });
};
export const getGalleryData = token => {
  // console.log('inside api -------', token);
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    // body: '',
    sslPinning: {
      certs: ['mycert'],
    },
  };
  return new Promise((resolve, reject) => {
    fetch(apiUrl + '/mst/all-gallery', requestOptions)
      .then(response => response.json())
      .then(json => {
        // console.log(json);
        resolve(json);
      })
      .catch(error => reject(error));
    // .finally(() => );
  });
};
export const getQRCodeData = (base64data, token) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    body: base64data,
    sslPinning: {
      certs: ['mycert'],
    },
  };
  return new Promise((resolve, reject) => {
    fetch(apiUrl + '/qr/fetch-data', requestOptions)
      .then(response => response.json())
      .then(json => {
        console.log('result---------------------', json);
        resolve(json);
      })
      .catch(error => reject(error));
    // .finally(() => );
  });
};
export const getArtifactData = (base64data, token) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    body: base64data,
    sslPinning: {
      certs: ['mycert'],
    },
  };
  return new Promise((resolve, reject) => {
    fetch(apiUrl + '/qr/get-artifact', requestOptions)
      .then(response => response.json())
      .then(json => {
        console.log('result---------------------', json);
        resolve(json);
      })
      .catch(error => reject(error));
    // .finally(() => );
  });
};
export const getRatingByQRCode = (base64data, token) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    body: base64data,
    sslPinning: {
      certs: ['mycert'],
    },
  };
  return new Promise((resolve, reject) => {
    fetch(apiUrl + '/rating/list', requestOptions)
      .then(response => response.json())
      .then(json => {
        console.log('result---------------------', json);
        resolve(json);
      })
      .catch(error => reject(error));
    // .finally(() => );
  });
};
export const getSectionData = (base64data, token) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    body: base64data,
    sslPinning: {
      certs: ['mycert'],
    },
  };
  return new Promise((resolve, reject) => {
    fetch(apiUrl + '/qr/gallery-section-artifacts', requestOptions)
      .then(response => response.json())
      .then(json => {
        console.log('result---------------------', json);
        resolve(json);
      })
      .catch(error => reject(error));
    // .finally(() => );
  });
};
export const saveReview = (base64data, token) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    body: base64data,
    sslPinning: {
      certs: ['mycert'],
    },
  };
  return new Promise((resolve, reject) => {
    fetch(apiUrl + '/rating/save', requestOptions)
      .then(response => response.json())
      .then(json => {
        console.log('result---------------------', json);
        resolve(json);
      })
      .catch(error => reject(error));
    // .finally(() => );
  });
};
