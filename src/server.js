const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const MONGOURL = 'mongodb+srv://admin:AAleUri78rYmkfzI@cluster.zy0jq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}

const app = express();

mongoose.connect(MONGOURL, options)
.then(() => console.log("DB connected"))
.catch(error => console.log(error));

const { User } = require('./schema/user');
const e = require('express');

app.use(bodyParser.json());

app.post('/api/user/signup', (req, res) => {
    console.log(req.body);
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }).save((err, response) => {
        if (err)
            res.status(400).send(err);
        res.status(200).send(response);
    })
})

app.post ('api/user/signin', (req, res) => {
    User.findOne({'email': req.body.email}, (err, user)=> {
        console.log(user);
        if(!user)
            res.json({message: 'Login failed, user not found'});
        else
            user.compareP(req.body.password, (err, isMatch) => {
                if (err)
                    throw err;
                else if (!isMatch)
                    return res.status(400).json({message: 'Wrong Password'});
                else
                    res.status(200).send('Logged in successfully');
            })
    })
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`server running on ${port}`);
})