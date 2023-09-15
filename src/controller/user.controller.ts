import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import SendForgotPasswordMail from '../services/mail/SendForgotPasswordMail';
import * as userServices from '../services/user.services';
import { IUser } from '../types';
import { TypeRequestBody } from '../types/request.types';
import { IAuthToken, IForgotPasswordToken } from '../types/token.types';
import decodeToken from '../utils/decodeToken';
import generateAuthToken from '../utils/generateAuthToken';
import generateForgotPasswordToken from '../utils/token/generateForgotPasswordToken';

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
    const token = generateAuthToken(user._id, email, user.role);

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

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie('token', cookieOptions);
  return res.status(200).json({ message: 'User Logout successful' });
};

export const register = async (req: Request, res: Response) => {
  const { firstName, middleName, lastName, email, designation, department } =
    req.body;

  if (
    !firstName ||
    !middleName ||
    !lastName ||
    !email ||
    !designation ||
    !department
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
      role: 'teacher',
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

export const getAllUser = async (req: Request, res: Response) => {
  let search = req.query['search'] as string;
  let page = parseInt(req.query['page'] as string) - 1;
  let limit = parseInt(req.query['limit'] as string);
  let sortBy = req.query['sortBy'] as string;
  let type = parseInt(req.query['type'] as string);

  if (!search) search = '';
  if (!page || page < 0) page = 0;
  if (!limit || limit <= 0) limit = 10;

  if (limit > 100) {
    return res.status(500).json({ message: 'Limit cannot exceed 100' });
  }

  const skip = limit * page;
  try {
    const userList = await userServices.searchUser(
      search,
      limit,
      skip,
      sortBy,
      type == 1 || type == -1 ? type : 1,
    );

    if (userList.length === 0) {
      return res.status(200).json({
        message: 'No Users to display',
        data: [],
        page: { previousPage: page === 0 ? undefined : page },
      });
    }

    // as frontend is 1 based page index
    const nextPage = page + 2;

    // previous page is returned as page because for 1 based indexing page is the previous page as page-1 is done
    const previousPage = page === 0 ? undefined : page;

    return res.status(200).json({
      message: 'Users fetched successfully',
      data: userList,
      page: { nextPage, previousPage },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong...' });
  }
};

export const editUser = async (req: Request, res: Response) => {};

export const forgotPassword = async (
  req: TypeRequestBody<{ email?: string }>,
  res: Response,
) => {
  const email = req.body.email;

  // if email is undefined
  if (!email) {
    return res
      .status(401)
      .json({ message: 'Please enter all required fields ' });
  }

  try {
    // check if email is not-registered
    const user = await userServices.findUser(email);
    if (!user) {
      return res.status(401).json({ message: 'No such email found' });
    }

    // Creating a jwt token and sending it to the user
    const token = generateForgotPasswordToken(user._id, email, user.role);

    // send email to the user
    SendForgotPasswordMail(email, token);

    return res
      .status(200)
      .json({ message: `A password reset link is sent to ${email}` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error, Please try again later' });
  }
};

export const resetPassword = async (
  req: TypeRequestBody<{ email?: string; newPassword?: string }>,
  res: Response,
) => {
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  const resetPasswordToken = req.params['token'];

  if (!email) {
    return res.status(401).json({ message: 'Please enter Email' });
  }

  if (!newPassword) {
    return res.status(401).json({ message: 'Please enter new Password ' });
  }

  try {
    const tokenData = decodeToken(resetPasswordToken) as IForgotPasswordToken;

    if (email !== tokenData.email) {
      return res.status(403).json({ message: 'Reset Link is not valid' });
    }

    const user = await userServices.findUser(tokenData.email);
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Please create a new Reset Password Link' });
    }

    // Hash the password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Resetting the password
    await userServices.resetPassword(tokenData.email, hashedNewPassword);
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Error, generate new password link' });
  }
};

export const getDashboardCounts = async (req: Request, res: Response) => {
  try {
    let cardCount = await userServices.getDashboardCardCount();
    let temp = await userServices.getTotalInventoryCount();

    cardCount.push({
      role: 'inventoryCount',
      count: temp[0].totalWorking,
    });

    const result: any = {
      teacher: 0,
      admin: 0,
      staff: 0,
      inventoryCount: 0,
    };

    cardCount.forEach((item) => (result[item.role] = item.count));

    return res.status(200).json({ message: 'List', data: result });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Error, generate new password link' });
  }
};
