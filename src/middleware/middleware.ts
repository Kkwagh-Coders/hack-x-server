import { NextFunction, Request, Response } from 'express';
import { IAuthToken } from '../types/token.types';
import decodeToken from '../utils/decodeToken';

// A middleware to check if the user is authenticated or not, before any action
const isUserAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['token'];

  if (!token) {
    return res.status(401).json({ message: 'User not LoggedIn' });
  }

  try {
    // Verify the token
    const authTokenData = decodeToken(token) as IAuthToken;

    // Adding token data to req
    req.body.authTokenData = authTokenData;

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'User not LoggedIn' });
  }
};

export default isUserAuth;
