// code away!
const port = 5000;

const server = require('./server');

const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});