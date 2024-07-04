const bcrypt = require('bcrypt');
const User = require("../models/User");
const { errorHandler, createAccessToken } = require('../auth.js');
const auth = require('../auth.js');


// [SECTION] User Registration
module.exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'User with this email already exists' });
        }

        if (typeof name !== 'string') {
            return res.status(400).send({ message: 'Name must be a string' });
        } else if (!email.includes('@')) {
            return res.status(400).send({ message: 'Invalid email format' });
        } else if (password.length < 8) {
            return res.status(400).send({ message: 'Password must be at least 8 characters long' });
        } else {
            let newUser = new User({
                name,
                email,
                password: bcrypt.hashSync(password, 10)
            });

            const user = await newUser.save();
            return res.status(201).send({ message: "Registered Successfully", user });
        }
    } catch (error) {
        console.error("Error in registration: ", error);
        return errorHandler(error, req, res);
    }
};


// [SECTION] User Login
module.exports.login = (req, res) => {
    if (req.body.email.includes("@")){
        return User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                return res.status(404).send({message: 'No email found'});
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.status(200).send({ message:'User logged in successfully',access : auth.createAccessToken(result)});
                } else {
                    return res.status(401).send({message: 'Incorrect email or password'});
                }
            }
        })
        .catch(error => errorHandler(error, req, res));
    } else {
        return res.status(400).send({message: 'Invalid email format'});
    }  
};

// [SECTION] Get User Profile
module.exports.getProfile = (req, res) => {
    const userId = req.user.id;

   return User.findById(userId)
        .then(user => {
            if (!user) {
                res.status(404).send({ error: 'User not found' });
            }
            user.password = undefined;
            return res.status(200).send({ user });
        })
        .catch(err => res.status(500).send({ error: 'Failed to fetch user profile', details: err }));
};
