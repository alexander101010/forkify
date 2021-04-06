import { async } from 'regenerator-runtime';
import { FETCH_TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchProm = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchProm, timeout(FETCH_TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err; // throw a second error so the promise will reject when this function is used in the model.js module, passing the correct error on
  }
};

/* 
export const getJSON = async function (url) {
  try {
    const fetchProm = fetch(url);
    const res = await Promise.race([fetchProm, timeout(FETCH_TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err; // throw a second error so the promise will reject when this function is used in the model.js module, passing the correct error on
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchProm = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchProm, timeout(FETCH_TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err; // throw a second error so the promise will reject when this function is used in the model.js module, passing the correct error on
  }
};
*/
