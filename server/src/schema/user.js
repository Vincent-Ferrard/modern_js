const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const salt = 10;

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: 1,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    }],
    status: {
        type: Boolean,
        default: false,
    },
    validated: {
        type: Boolean,
        default: false,
    }
});

userSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(salt, (err, salt) => {
            if (err)
                return next(err);

            bcrypt.hash (user.password, salt, (err, hash) => {
                if (err)
                    return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function (candidateP, checkP) {
    bcrypt.compare(candidateP, this.password, (err, isMatch) => {
        if (err)
            return checkP(err);
        checkP(null, isMatch);
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User };