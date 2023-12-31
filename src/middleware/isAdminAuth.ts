import { NextFunction, Request, Response } from 'express';
import { IAuthToken } from '../types/token.types';
import decodeToken from '../utils/decodeToken';

// A middleware to check if the user is authenticated or not, before any action
const isAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['token'];

  if (!token) {
    return res.status(401).json({ message: 'Not LoggedIn as Admin' });
  }

  // Verify the token
  try {
    const authTokenData = decodeToken(token) as IAuthToken;

    // Check if data exits
    if (authTokenData.role != 'admin') {
      res.clearCookie('token');
      return res.status(401).json({ message: 'Not LoggedIn as Admin' });
    }

    // Adding token data to req
    req.body.authTokenData = authTokenData;

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Not LoggedIn as Admin' });
  }
};

export default isAdminAuth;
