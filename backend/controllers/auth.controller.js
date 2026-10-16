import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json("required details")
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json("user already exists please login")
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashPassword
        })

        await newUser.save()

        return res.status(201).json("user signup successfully")
    } catch (error) {
        console.log(error)
        return res.status(500).json("internal server error")
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(401).json("required details")
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json("user not  exist please signup")
        }

        const validatePassword = await bcrypt.compare(password, user.password)
        if (!validatePassword) {
            return res.status(401).json("password not correct")

        }
        const token = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return res.status(200).json({ message: "user login successfully", token })
    } catch (error) {
        console.log(error)
        return res.status(401).json("internal server error")
    }

}