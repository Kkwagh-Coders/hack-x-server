import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as userServices from '../services/user.services';
import { IUser } from '../types';
import { IAuthToken } from '../types/token.types';
import decodeToken from '../utils/decodeToken';
import generateAuthToken from '../utils/generateAuthToken';

const EXPIRY_DAYS = 180;

type COOKIE_OPTIONS = {
  sameSite: 'none' | 'lax';
  secure: boolean;
  httpOnly: boolean;
  maxAge: number;
};

const cookieOptions: COOKIE_OPTIONS = {
  sameSite: process.env['NODE_ENV'] === 'production' ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
  secure: process.env['NODE_ENV'] === 'production', // must be true if sameSite='none',
  httpOnly: true,
  maxAge: EXPIRY_DAYS * (24 * 60 * 60 * 1000),
};

export const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  // if email or password is undefined
  if (!email || !password) {
    return res.status(401).json({
      message: 'Incorrect Username or Password',
    });
  }

  try {
    const user = await userServices.findUser(email);

    // if no such user found.
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Incorrect Username or Password' });
    }

    // compare the passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: 'Incorrect Username or Password' });
    }

    // generate JWT token
    const token = generateAuthToken(user._id, email);

    //setting cookie
    res.cookie('token', token, cookieOptions);

    const userResponseData = {
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      designation: user.designation,
      department: user.department,
      role: user.role,
    };

    // Remove the password
    return res.status(200).json({
      message: 'Login Successful',
      user: userResponseData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong.....' });
  }
};

export const register = async (req: Request, res: Response) => {
  const {
    firstName,
    middleName,
    lastName,
    email,
    designation,
    department,
    role,
  } = req.body;

  if (
    !firstName ||
    !middleName ||
    !lastName ||
    !email ||
    !designation ||
    !department ||
    !role
  ) {
    return res
      .status(401)
      .json({ message: 'Please enter all required fields ' });
  }

  try {
    // check if email is registered
    const oldUser = await userServices.findUser(email);
    if (oldUser) {
      return res.status(404).json({ message: 'Email already exists' });
    }
    // generate random password
    const password = uuidv4();

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 12);

    // TODO : no token ?

    const userData: IUser = {
      firstName,
      middleName,
      lastName,
      email,
      designation,
      department,
      role,
      password: hashPassword,
    };

    // create user account
    const user = await userServices.createUser(userData);

    return res.status(200).json({ message: 'Account created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong.....' });
  }
};

export const getLoginStatus = async (req: Request, res: Response) => {
  const token = req.cookies['token'];

  // We are using 200 because the request was successful and we return isLoggedIn false
  if (!token) {
    return res.status(200).json({ isLoggedIn: false, user: null });
  }

  try {
    // Verify the token
    const authTokenData = decodeToken(token) as IAuthToken;

    // Check if the user
    const user = await userServices.findUser(authTokenData.email);

    if (!user) {
      return res.status(200).json({
        isLoggedIn: false,
        user: null,
      });
    }

    const userResponseData = {
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      designation: user.designation,
      department: user.department,
      role: user.role,
    };

    return res.status(200).json({
      isLoggedIn: true,
      user: userResponseData,
    });
  } catch (err) {
    // We return 400 because the request failed for unknown reason
    return res
      .status(400)
      .json({ isLoggedIn: false, isAdmin: false, admin: null, user: null });
  }
};

export const editUser = async (req: Request, res: Response) => {};
