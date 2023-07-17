const User = require('../models/usersModel')
const writeData = require("../lib/writeData");
const {USERLOGINLOGS} = require("../DB");

exports.login = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).send("Login Form is not completed!");
        } else {
            const user = await new User(null, username, password).login();
            const timeString = Math.floor(new Date().getTime());
            const userLoginLog = {
                id: String(timeString + (user.username + "")),
                username: user.username,
                logintime: new Date().toLocaleString(),
            };
            if (user) {
                userLoginLog.success = true;
                writeData(USERLOGINLOGS, userLoginLog, (data) => {
                    console.log("login log save successfully", data)
                });
                res.json({accessToken: user.accessToken, user: user.id});
            } else {
                userLoginLog.success = false;
                writeData(USERLOGINLOGS, userLoginLog, (error) => {
                    console.log("login log save failed", error);
                });
                res.status(400).json({error: 'Invalid username or password!'});
            }
        }
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
}