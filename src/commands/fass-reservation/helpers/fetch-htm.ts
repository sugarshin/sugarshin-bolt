import request from 'request-promise-native';
import iconv from 'iconv-lite';

export const fetchHtm = (url: string) => {
  return request({
    url,
    method: 'GET',
    encoding: null,
    transform: body => iconv.decode(body, 'shift_jis'),
  });
};
