const User = require('../models/usersModel')

exports.login = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).send("Login Form is not completed!");
        } else {
            const user = await new User(null, username, password).login();
            if (user) {
                res.json({accessToken: user.accessToken, user: user.id});
            } else {
                res.status(400).json({error: 'Invalid username or password!'});
            }
        }
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
}