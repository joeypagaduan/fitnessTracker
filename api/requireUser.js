const requireUser = (req, res, next) => {
    if (!req.user) {
        next({
            error: "You are not logged in",
            message: "You must be logged in to perform this action",
            name: "MissingUserError"
        });
    } 
    
    req.user = {
        username: req.user.username,
        id: req.user.id,
    };

    next();
}
  
  module.exports = { requireUser }