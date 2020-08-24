var express = require('express');
var router = express.Router();

router.get('/', function (req,res, next) {
    res.render('index', {title : 'Form Validation',success:false,errors:req.session.errors});
    req.session.errors = null;
})

router.post('/api/coins', function (req, res, next) {
    req.check('ticker','Inavlid ticker').isEmpty().isAlphanumeric().isLength({min:3, max: 5});
    req.check('name', 'Invalid name').isEmpty().isAlphanumeric().isLength({min:1, max: 20});

    var errors = req.validationErrors();
    if (errors) {
        req.session.errors =errors;
    }
    res.redirect('/');
});
module.exports= router;