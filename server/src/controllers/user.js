const { User } = require('../schema/user');
const jwt = require('jsonwebtoken');

const UserController = {
    signup: (req, res) => {
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
    },
    signin: (req, res) => {
        User.findOne({'email': req.body.email}, (err, user)=> {
            console.log(user);
            if(!user)
                res.json({message: 'Login failed, user not found'});
            else
                user.comparePassword(req.body.password, (err, isMatch) => {
                    if (err)
                        throw err;
                    else if (!isMatch)
                        return res.status(400).json({message: 'Wrong Password'});
                    else
                        var token = jwt.sign({ email: user.email, username: user.username, iat: Math.floor(Date.now() / 1000) + ((60 * 60) * 2190) }, process.env.TOKEN_SECRET); //1h * le nombre d'heure en 3 mois
                        return res.status(200).json({message: 'Logged in successfully', token: token});
                })
        })
    },
    data: (req, res) => {
        res.json(req.user);
    },
    allRooms: (req, res) => {
        User.findOne({username: req.params.username}).populate("rooms", "name")
        .then((user) => {
            if (!user)
                res.json({message: "This user does not exist"});
            else
                res.json({rooms: user.rooms});
        }).catch((err) => {
            res.status(400).send(err);
        })
    },
    setStatus: (req, res) => {
        User.findOneAndUpdate({username: req.params.username}, {status: req.body.status}, (err, user) => {
            if (!user)
                res.status(400).json({message: "This user does not exist"});
            else
                res.json({status: user.status});
        });
    }
}

module.exports = UserController;