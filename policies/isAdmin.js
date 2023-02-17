module.exports = (req, res, next) => {
  if(req.user.permissions.search(/admin/) > -1){
    return next();
  }
  return res.status(403).json({
    errors: 'Invalid Admin User'
  });
};