import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const SECRET = process.env.JWT_SECRET || 'change_me';

export const hashPw   = pwd => bcrypt.hash(pwd, 10);
export const verifyPw = (plain, hash) => bcrypt.compare(plain, hash);
export const signJWT  = uid => jwt.sign({ sub: uid }, SECRET, { expiresIn: '60m' });

export const authMid  = (req, res, next) => {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') && hdr.split(' ')[1];
  if (!token){
    return res.status(401).json({ msg: 'Missing token' });
  }
  try { 
    req.user = jwt.verify(token, SECRET).sub; next(); 
  }
  catch { 
    return res.status(401).json({ msg: 'Invalid/expired token' }); 
  }
};
