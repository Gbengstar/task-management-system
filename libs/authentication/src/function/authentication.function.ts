import { Request } from 'express';

export const getToken = (req: Request) => {
  let token: string;

  switch (true) {
    case !!req.headers.cookie:
      req.headers.cookie.split('; ').forEach((item) => {
        const data = item.split('=');
        if (data[0] === 'token') token = data[1];
      });
      break;
    case req.headers.authorization?.startsWith('Bearer'):
      token = req.headers.authorization.split(' ')[1];
      break;
    case !!req.signedCookies?.token:
      token = req.signedCookies?.token;
      break;
  }

  return token;
};
