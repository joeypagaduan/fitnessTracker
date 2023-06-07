const requireUser = (req, res, next) => {
    if (!req.user) {
        next({
            name: "Authorization Error",
            message: "You must be logged in to perform this action",
        });
    } else {
      console.log("Authorized");
      return next();
    }
  };
  
  module.exports = { requireUser };