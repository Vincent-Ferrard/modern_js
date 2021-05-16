const { User } = require('../schema/user');
const jwt = require('jsonwebtoken');
const { transporter } = require('../services/nodemail');

const UserController = {
    signup: (req, res) => {
        User.findOne({'email': req.body.email}, async (err, user) => {
            if (!user) {
                const link = `localhost:3000/confirm/${req.body.email}`;
                await transporter.sendMail({
                    from: process.env.SENDER_MAIL,
                    to: req.body.email,
                    subject: 'email confirmation modern chat',
                    html: `<h1>Hello ${req.body.username}!</h1><br>
                    <p>You're receiving this email with nodemailer!</p>
                    <a href="${link}">Please click here</a>
                    to validate your account.</p>
                    <p>We hope you like our app! ;D</p>`
                }).catch(console.error);
                console.log('email successfully delivered');
            } else {
                console.log('email not delivered: account already created');
            }
        });
        new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }).save((err, response) => {
            if (err)
                res.status(400).send(err);
            res.status(200).send(response);
        })
    },
    confirm: (req, res) => {
        User.findOne({'email': req.body.email}, async (err, user) => {
            if (!user) {
                res.json({message: 'Confirmation failed, email not found. Be sure to confirm your account in the 12 hours following your inscription'});
            } else {
                await User.findOneAndUpdate({'email': req.body.email}, {validated: true});
                res.json({message: 'Email confirmed, welcome aboard'});
                console.log(`${req.body.email} confirmed`);
            }
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