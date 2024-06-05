const express = require('express');
const controller = require('../controllers/mainController');

const router = express.Router();

//GET / - goes to index.ejs file in mainController
router.get('/', controller.index);

//GET /about - goes to about.ejs file in mainController
router.get('/about', controller.about);

//GET /contact - goes to contact.ejs file in mainController
router.get('/contact', controller.contact);

module.exports = router;