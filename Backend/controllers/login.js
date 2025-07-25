import User from '../models/User.js';
import { validationResult } from 'express-validator';
import * as Auth from '../lib/auth.js';


export default async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await Auth.verifyPw(req.body.password, user.password))){
      return res.status(401).json({ msg: 'Bad credentials' });
    }
    res.json({ access_token: Auth.signJWT(user.id) });
}