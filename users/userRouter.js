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
    userdb.get()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error getting users" })
    });
});

router.get('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    userdb.getById(id)
    .then(user => {
        res.status(200).json(user);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error getting user by id" })
    });
});

router.get('/:id/posts', validateUserId, (req, res) => {
    const { id } = req.params;
    userdb.getUserPosts(id)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error getting user's posts" })
    });
});

router.delete('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    userdb.remove(id)
    .then(response => {
        res.status(200).json({ message: `User with id: ${id} successfully deleted` });      
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error removing user" });
    });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
    const { id } = req.params;
    userdb.update(id, req.body)
    .then(user => {
        if(user) {
            res.status(201).json({ message: "User updated successfully" });
        } else{
            res.status(500).json({ error: "Server error, no users updated" });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error updating user" })
    });
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
            res.status(500).json({ error: "Server error getting user by id"})
        });
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