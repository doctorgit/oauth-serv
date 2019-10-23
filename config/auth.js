module.exports = {
    ensureAuthenticated: (request, response, next) => {
        if (request.isAuthenticated()) {
            return next();
        }

        request.flash('error_msg', 'Please log in to view this resource');
        response.redirect('/users/login');
    }
};