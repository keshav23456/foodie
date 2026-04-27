const express = require("express");
const router = express.Router();
const User = require("../models/userModel")

router.post("/login", async (req, res) => {

    const { email, password } = req.body
    console.log(email,password);
    try {
        const user = await User.find({ email, password })
        // const user = await User.find()
        // console.log(user)
        if (user.length > 0) 
        {
            const currentUser={
            name: user[0].name,
            email:user[0].email,
            isAdmin:user[0].isAdmin,
            _id:user[0]._id
            }
            res.send(currentUser);
        }
        else {
         console.log("here");
            return res.status(400).json({ message: 'User Login Failed' });
        
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
});


router.post("/register", async (req, res) => {

    const { name, email, password } = req.body

    const newUser = new User({ name, email, password })

    try {
        newUser.save()
        res.send('user Register Successfully')
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

module.exports = router