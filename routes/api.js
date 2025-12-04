// routes/api.js

const express = require("express");
const router = express.Router();

router.get('/books', function (req, res, next) {
    let sqlquery = "SELECT * FROM books";
    let conditions = [];
    let params = [];

    // --- Search by name ---
    if (req.query.search) {
        conditions.push("name LIKE ?");
        params.push('%' + req.query.search + '%');
    }

    // --- Price range ---
    if (req.query.minprice) {
        conditions.push("price >= ?");
        params.push(req.query.minprice);
    }

    if (req.query.maxprice) {
        conditions.push("price <= ?");
        params.push(req.query.maxprice);
    }

    // Add WHERE
    if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ");
    }

    // --- Sorting ---
    if (req.query.sort === 'name') {
        sqlquery += " ORDER BY name";
    } else if (req.query.sort === 'price') {
        sqlquery += " ORDER BY price";
    }

    // Execute the SQL query
    db.query(sqlquery, params, (err, result) => {
        if (err) {
            res.json(err);
            return next(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
