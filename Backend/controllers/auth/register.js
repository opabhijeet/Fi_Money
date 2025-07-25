import { validationResult } from 'express-validator';
import User from '../../models/User.js';
import * as Auth from '../../lib/auth.js';

export default async (req, res) => {
    const valErr = validationResult(req);
    if (!valErr.isEmpty()) return res.status(400).json({ errors: valErr.array() });
    try {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(409).json({ msg: 'Username already exists' });
      }
      req.body.password = await Auth.hashPw(req.body.password);
      const user = await User.create(req.body);
      res.status(201).json({ msg: 'User created', userId: user.id });
    } catch (e) {
      res.status(409).json({ msg: 'Username already exists' });
    }
}