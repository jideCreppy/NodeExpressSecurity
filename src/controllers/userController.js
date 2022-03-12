"use strict"

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import {userSchema} from '../models/userModel';
import {validationResult} from 'express-validator';

// TODO add csurf csrf protection
// TODO update api to use secure cookie

const User = mongoose.model('User', userSchema);
const tokenSecret = 'RESTFULLAPIs';

export const loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized user!' });
    }
}

export const register = async (req, res) => {
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {
        return res.status(400).json({ errors : validationErrors.array() })
    }

    const newUser = new User(req.body);
    newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);
    try{
        let user = await newUser.save();
        user.hashPassword = undefined; // Never return back the password in response
        return res.json(user);
    } catch(err) {
        return res.status(400).send({ message: `An error occured ${err}` });
    }
}

export const login = async (req, res) => {

    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {
        return res.status(400).json({ errors : validationErrors.array() })
    }

    try{
        let user = await  User.findOne({ email: req.body.email });
        if (!user) {
            res.status(401).json({ message: 'User unauthorized. No user found' });
        } else if (user) {
            if (!user.comparePassword(req.body.password, user.hashPassword)) {
                res.status(401).json({ message: 'Auth failed. Invalid password' });
            } else {
                return res.json({token: jwt.sign({ email: user.email, username: user.username, _id: user.id}, tokenSecret)});
            }
        }
    } catch (err) {
        throw err;
    }
}

export const dummyRoute = (req,res,next) => {
    console.log('dummy route');
    res.send('Success');
}