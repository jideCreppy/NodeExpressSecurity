import express from 'express';

import {loginRequired, register, login, dummyRoute} from '../controllers/userController';

const router = express.Router();

export const routes = () => {
    
    router.post('/register', register);
    router.post('/login', login);
    router.get('/contacts', loginRequired, dummyRoute);

    return router;
}

// export const routes = () => {
    
//     router.get('/contacts', loginRequired, dummyRoute);

//     return router;
// }