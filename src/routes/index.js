import express from 'express';
import {check} from 'express-validator';

import {loginRequired, register, login, dummyRoute} from '../controllers/userController';

import csrf from 'csurf';

const router = express.Router();

const csrfProtection = csrf({ cookie: true });

export const routes = () => {
    //TODO add validation
    router.post('/register', [
        check('username').trim().isLength({min: 3, max: 20}).escape().withMessage('Username is required'),
        check('email').trim().isEmail().normalizeEmail().withMessage('Email is required'),
        check('password').trim().isStrongPassword({minLength: 10, minSymbols: 3}).withMessage('A Strong password is required')
    ], register);
    router.post('/login', [ [
        check('email').trim().isLength({min: 3, max: 20}).escape().withMessage('Username is required'),
        check('password').trim().isLength({min: 8, max: 20}).withMessage('A Strong password is required')
    ]], login);
    router.get('/contacts', csrfProtection, loginRequired, dummyRoute);

    return router;
}