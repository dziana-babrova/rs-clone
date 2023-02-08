import * as express from 'express';
import AuthController from "../controllers/AuthController";
import { check, cookie } from "express-validator";

export const authRouter = express.Router();
const controller = new AuthController();

authRouter.post('/signup', [
  check('email').trim()
    .notEmpty().withMessage('Email should not be empty').bail()
    .isEmail().withMessage('Email must match the pattern'),
  check('username').trim()
    .notEmpty().withMessage('Username should not be empty').bail()
    .isLength({min: 3}).withMessage('Username length must be more than 3 characters'),
  check('password')
    .notEmpty().withMessage('Password should not be empty').bail()
    .isString().withMessage('Password should be string').bail()
    .isLength({min: 6}).withMessage('Password length must be more than 6 characters')
], controller.signUp)
authRouter.post('/signin', [
  check('email').trim()
    .notEmpty().withMessage('Email should not be empty').bail()
    .isEmail().withMessage('Email must match the pattern'),
  check('password')
    .notEmpty().withMessage('Password should not be empty').bail()
    .isString().withMessage('Password should be string').bail()
    .isLength({min: 6}).withMessage('Password length must be more than 6 characters')
], controller.signIn)
authRouter.get('/signout', [
  cookie('refreshToken', 'RefreshToken cookie required.').notEmpty()
], controller.signOut)
authRouter.get('/refresh', controller.refresh)