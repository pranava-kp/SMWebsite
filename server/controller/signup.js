const User = require("../model/user");
const Profile = require("../model/profile");
const bcrypt = require("bcrypt");
exports.signup = async (req, res) => {
    try {
        //fetch the data from the req body;
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
        } = req.body;
        if(!firstName || !lastName || !email || !password || !confirmPassword || !accountType){
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        //check user is already exist or not
        const response = await User.findOne({ email });
        if (!response) {
            //validate the password and cnf password
            if (password !== confirmPassword) {
                return res.status(400).json({
                    message: "Password and Confirm Password does not match",
                });
            }
            let hashedPassword;
            try {
                hashedPassword = await bcrypt.hash(password, 10);
            } catch (error) {
                return res.status(500).json({
                    message: "Error while hashing the password",
                    error: error,
                });
            }
            
            //Create entry in DB
            const profileDetails = await Profile.create({
                dateOfBirth: null,
                phoneNumber: null,
                gender: null,
                department: null,
                leaves: [],
            });
            console.log(profileDetails);

            const user = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                accountType,
                additionalDetails: profileDetails,
                image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
            });
            return res
                .status(200)
                .json({ message: "User is created", success: true });
        } else {
            return res.status(400).json({ message: "User already exist" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error ", error: error });
    }
};
