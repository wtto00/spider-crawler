import fetch from 'node-fetch';
import type { RequestInfo, RequestInit, FetchError } from 'node-fetch';

export default function request(url: RequestInfo, options?: RequestInit): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((res) => res.text())
      .then((res) => {
        resolve(res);
      })
      .catch((err: FetchError) => {
        reject(err);
      });
  });
}
