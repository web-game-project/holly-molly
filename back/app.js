const express = require('express');
const Http = require('http');

const app = express();
const http = Http.createServer(app);
const { User } = require('./models');

const PORT = 8080;

app.use(express.json());
app.get('/dbtest', async (req, res) => {
    try {
        const user = await User.create({
            user_name: 'hy',
        });
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(400).send({ message: 'DB not Connection' });
    }
});

http.listen(PORT, () => {
    console.log(`listening at ${PORT}`);
});
