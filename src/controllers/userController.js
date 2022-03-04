import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import {userSchema} from '../models/userModel';

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
    const newUser = new User(req.body);
    newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);
    try{
        let user = await newUser.save();
        user.hashPassword = undefined; // Never return back the password in response
        return res.json(user);
    } catch(err) {
        return res.status(400).send({message: err});
    }
}

export const login = (req, res) => {
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) throw err;
        if (!user) {
            res.status(401).json({message: 'User unauthorized. No user found'});
        } else if (user) {
            if(!user.comparePassword(req.body.password, user.hashPassword)) {
                res.status(401).json({message: 'Auth failed. Invalid password'});
            } else {
                return res.json({token: jwt.sign({ email: user.email, username: user.username, _id: user.id}, tokenSecret)});
            }
        }
    });
}

export const dummyRoute = (req,res,next) => {
    console.log('dummy route');
    res.send('Success');
}