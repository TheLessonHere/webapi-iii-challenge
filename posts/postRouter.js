const express = require('express');
const postdb = require('./postDb');
const router = express.Router();

router.get('/', (req, res) => {
    postdb.get()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error getting posts" })
    });
});

router.get('/:id', validatePostId, (req, res) => {
    const { id } = req.params;
    postdb.getById(id)
    .then(post => {
        res.status(200).json(post);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error getting post by id" })
    });
});

router.delete('/:id', validatePostId, (req, res) => {
    const { id } = req.params;
    postdb.remove(id)
    .then(response => {
        res.status(200).json({ message: `Post with id: ${id} successfully deleted` });      
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error removing post" });
    });
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
    const { id } = req.params;
    postdb.update(id, req.body)
    .then(post => {
        if(post) {
            res.status(201).json({ message: "Post updated successfully" });
        } else{
            res.status(500).json({ error: "Server error, no posts updated" });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error updating post" })
    });
});

// custom middleware

function validatePostId(req, res, next) {
    const { id } = req.params;
    if(id) {
        postdb.getById(id)
        .then(post => {
           if(post) {
               next();
           } else {
               res.status(404).json({ error: "Invalid post id"});
           }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Server error getting post by id"})
        })
    } else {
        next();
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