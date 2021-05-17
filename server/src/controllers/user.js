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
                    to validate your account.<br>
                    or copy this link: ${link}</p>

                    <p>We hope you like our app! ;D</p>`
                }).catch(console.error);
                console.log('email successfully delivered');
            } else {
                console.log('email not delivered: account already created');
                return res.status(400).send({error: 'User already exist'})
            }
        });
        new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }).save((err, response) => {
            console.log(err);
            if (err)
                res.status(400).send(err);
            else
                res.status(200).send({message: 'User register.'});
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
    data: (req, res) => {
        res.json(req.user);
    },
    allRooms: (req, res) => {
        User.findOne({username: req.params.username}).populate("rooms oldRooms", "name")
        .then((user) => {
            if (!user)
                res.json({error: "This user does not exist"});
            else
                res.json({rooms: user.rooms, oldRooms: user.oldRooms});
        }).catch((err) => {
            res.status(400).send(err);
        })
    },
    setStatus: (req, res) => {
        User.findOneAndUpdate({username: req.params.username}, {status: req.body.status}, (err, user) => {
            if (!user)
                res.status(400).json({error: "This user does not exist"});
            else
                res.json({status: user.status});
        });
    },
    forgotPassword: (req, res) => {
        const {email} = req.body;

        User.findOne({email}, (err, user) => {
            if(err || !user) {
                return res.status(400).json({error: "User with this email does not exists."});
            }

            const token = jwt.sign({_id: user._id}, process.env.RESET_PASSWORD_KEY, {expiresIn: '20m'});
            const data = {
                from: 'noreplay@hello.com',
                to: email,
                subject: 'Account Activation Link',
                html: `
                    <h2>Please click on given link to reset your password</h2>
                    <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
                `
            };

            return user.updateOne({resetLink: token}, (err, success) => {
                if(err) {
                    return res.status(400).json({error: "reset password link error"});
                } else {
                    const token = Str.random(24);
                    const invitation = new Invitation({
                        user: user.id,
                        room: room.id,
                        token: token
                    }).save((err, response) => {
                        if (err)
                            res.status(400).send(err);
                        else
                            transporter.sendMail({
                                to: data.to,
                                from: process.env.SENDER_MAIL,
                                subject: 'Account activation Link',
                                html: `
                                    <h2>Please click on given link to reset your password</h2>
                                    <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
                                `,
                            }).then((response) => {
                                res.status(200).json({message: "An invitation has been sent."});
                            }).catch((err) => {
                                res.status(400).send(err);
                            });
                    })
                }
            })
        })
    }
}

module.exports = UserController;