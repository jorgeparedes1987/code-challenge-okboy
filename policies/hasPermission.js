module.exports = (req, res, next) => {
  if (req.user && req.user.permissions.search(/admin/) > -1) {
    return next();
  }
  const { method } = req;
  if(method != 'PUT' && req.user.permissions.search(/write/) > - 1){
    return next();
  }
  if(req.user.permissions.search(/update/) > - 1){
    return next();
  }
  return res.status(403).json({
    errors: 'You dont have the right psermissions'
  });
};