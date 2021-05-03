const { User } = require('../schema/user');

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
                user.compareP(req.body.password, (err, isMatch) => {
                    if (err)
                        throw err;
                    else if (!isMatch)
                        return res.status(400).json({message: 'Wrong Password'});
                    else
                        res.status(200).send('Logged in successfully');
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