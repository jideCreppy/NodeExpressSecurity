import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import {routes} from './src/routes';
import jsonwebtoken from 'jsonwebtoken';
import helmet from "helmet";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public'))); 

// Mogoose connection
mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://root:root@cluster0.ezyie.mongodb.net/crm?retryWrites=true&w=majority')
.then( () => console.log('connected to mongoose'))
.catch(err => console.log('Mongoose connection failed'));

// Secure Header setup
app.use(helmet());

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