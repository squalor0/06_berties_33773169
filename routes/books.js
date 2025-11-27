// Create a new router
const express = require("express")
const router = express.Router()

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.redirect('/users/login') // redirect to the login page
    } else { 
        next()
    } 
}

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    let keyword = req.query.keyword;

    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";

    let searchValue = '%' + keyword + '%';

    db.query(sqlquery, [searchValue], (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render('search-result.ejs', {
                searchTerm: keyword,
                searchResults: result
            });
        }
    });
});


router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.render("list.ejs", {availableBooks: result});
        }
     });
});

router.get('/addbook', redirectLogin, function (req, res, next) {
    res.render('addbook.ejs');
});

router.get('/bargainbooks', function (req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render('bargainbooks.ejs', { bargainBooks: result });
        }
    });
});


router.post('/bookadded', function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    // execute sql query
    let newrecord = [req.body.name, req.body.price];

    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.send(
                'This book is added to database, name: ' +
                req.body.name +
                ' price ' +
                req.body.price
            );
        }
    });
});

// Export the router object so index.js can access it
module.exports = router
