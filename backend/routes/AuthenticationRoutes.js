const express = require("express")
const bcrypt = require('bcrypt');
const User = require("../schemas/User")
const router = express.Router()

const saltRounds = 10;

router.get("/test", (req, res) => {
    res.send({ msg: "gotcha!" })
})

router.get("/getAllUsers", async (req, res) => {
    try {
        const allUsers = await User.find();
        res.json(allUsers);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error. Could not retrieve users." });
    }
});

router.get("/getUser/:username", async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (user) res.json(user);
    res.status(404).json({ message: "User not found" })
})

router.post("/createUser", async (req, res) => {
    const userData = req.body;

    try {
        const hashedPassword = await bcrypt.hash(userData["password"], saltRounds);
        userData["password"] = hashedPassword;

        const newUser = await User.create(userData);
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error. Could not create user." });
    }
});

router.put("/updateUser", async (req, res) => {
    const usernameToUpdate = req.body.username;
    const updateData = req.body;

    try {
        const existingUser = await User.findOne({ username: usernameToUpdate });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }

        const updatedUser = await User.findOneAndUpdate({ username: usernameToUpdate }, updateData, {
            new: true,
            runValidators: true,
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error. Could not update user." });
    }
});

router.delete("/deleteUser", async (req, res) => {
    const usernameToDelete = req.body.username;

    try {
        const existingUser = await User.findOne({ username: usernameToDelete });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findOneAndDelete({ username: usernameToDelete });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error. Could not delete user." });
    }
});

module.exports = router