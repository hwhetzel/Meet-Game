const Event = require('../models/event');

//checks if user is a guest
exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        return next();
    }else{
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

//checks if user is authenticated
exports.isLoggedIn = (req, res, next)=>{
    if(req.session.user){
        return next();
    }else{
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
};

//checks if user is author of the event
exports.isHost = (req, res, next)=>{
    let id = req.params.id;
    Event.findById(id)
    .then(event=>{
        if(event){
            if(event.hostName == req.session.user){
                return next();
            }else{
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        }else{
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

//checks if the user is not the author of the event/maybe dont need
exports.isNotHost = (req, res, next)=>{
    let id = req.params.id;
    Event.findById(id)
    .then(event=>{
        if(event){
            if(event.hostName == req.session.user){
                let err = new Error('You are the host of this event');
                err.status = 401;
                return next(err);
            }else{
                return next();
            }
        }else{
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};