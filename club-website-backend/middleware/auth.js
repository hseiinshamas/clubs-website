// middleware/auth.js
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing auth header' });

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { userId, role, clubId }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.authorizeSuper = (req, res, next) => {
  if (req.user.role !== 'superadmin')
    return res.status(403).json({ error: 'Superadmin only' });
  next();
};

exports.authorizeClubOrSuper = (req, res, next) => {
  const { role, clubId } = req.user;
  const targetClubId = Number(req.params.id);
  if (role === 'superadmin' || (role === 'admin' && clubId === targetClubId)) {
    return next();
  }
  res.status(403).json({ error: 'Forbidden' });
};
