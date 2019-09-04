const express = require('express');
const userdb = require('./userDb');
const postdb = require('../posts/postDb');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
    userdb.insert(req.body)
    .then(({ id }) => {
        userdb.getById(id)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Server error retrieving user" })
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error inserting user" })
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const newUserPost = {
        text: text,
        user_id: id
    };
    postdb.insert(newUserPost)
    .then(response => {
        res.status(201).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error inserting user post" })
    });
});

router.get('/', (req, res) => {

});

router.get('/:id', (req, res) => {

});

router.get('/:id/posts', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;
    if(id) {
        userdb.getById(id)
        .then(user => {
            if(user) {
                next();
            } else {
                res.status(404).json({ error: "Invalid user id" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Server error finding user by id"})
        })
    } else {
        next();
    }
};

function validateUser(req, res, next) {
    if(Object.keys(req.body).length === 0) {
        res.status(400).json({ error: "Missing user data" });
    } else {
        if(req.body.name) {
            next();
        } else {
            res.status(400).json({ error: "Missing required name field" });
        }
    }
};

function validatePost(req, res, next) {
    if(Object.keys(req.body).length === 0) {
        res.status(400).json({ error: "Missing post data" });
    } else {
        if(req.body.text) {
            next();
        } else {
            res.status(400).json({ error: "Missing required text field" });
        }
    }
};

module.exports = router;
