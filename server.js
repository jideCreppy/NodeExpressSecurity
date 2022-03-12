import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import {routes} from './src/routes';
import jsonwebtoken from 'jsonwebtoken';
import helmet from "helmet";
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

// API rate limit
const limiter = rateLimit({
    windowMs: 15*60*1000, // 15 minutes,
    max: 10, // limit of number of request per IP
    delayMs: 0 // disables delays
});

// Mogoose connection
mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://root:root@cluster0.ezyie.mongodb.net/crm?retryWrites=true&w=majority')
.then( () => console.log('connected to mongoose'))
.catch(err => console.log('Mongoose connection failed'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// Apply the rate limiting middleware to all requests
app.use(limiter)

// Secure Header setup
app.use(helmet());

// Cookie required for csrf protection
app.use(cookieParser());

// JWT setup
const tokenSecret = 'RESTFULLAPIs';
app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] == 'JWT') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], tokenSecret, (err, decode) => {
            if (err) req.user == undefined;
            req.user = decode;
            next();
        });
    } else {
       req.user = undefined;
       next();
    }
});

// Routes
app.use('/', routes());

// Start up server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});