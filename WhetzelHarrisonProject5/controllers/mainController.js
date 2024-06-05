const model = require('../models/user');

//renders the index.ejs file
exports.index = (req, res)=>{
    let id = req.session.user;
    model.findById(id)
    .then(user=>{
        //const [user, events] = results;
        res.render('index', {user});
    })
    
};

//renders the about.ejs file
exports.about = (req, res)=>{
    let id = req.session.user;
    model.findById(id)
    .then(user=>{
        //const [user, events] = results;
        res.render('about', {user});
    })

};

//renders the contact.ejs file
exports.contact = (req, res)=>{
    let id = req.session.user;
    model.findById(id)
    .then(user=>{
        //const [user, events] = results;
        res.render('contact', {user});
    })

};