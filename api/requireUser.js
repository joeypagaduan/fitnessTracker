const requireUser = (req, res, next) => {
    if (!req.user) {
        next({
            name: "MissingUserError",
            message: "You must be logged in to perform this action"
        });
    } 
    
    req.user = {
        username: req.user.username,
        id: req.user.id,
    };

    next();
}
  
  module.exports = { requireUser }