import express from "express"
import mongoose from "mongoose"
import { AuthModel } from "./model/AuthModel.js"
import { AsyncWrapper } from "./middleware/AsyncWrapper.js"
import { errorHandler } from "./middleware/ErrorHandler.js"
import { notFound } from "./middleware/NotFound.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config();
const mongoDBURL = process.env.mongoDBURL;
const app = express()


app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).send("hello and welcome to my Website")
})

app.get("/data", AsyncWrapper(async (req, res) => {
    const data = await AuthModel.find({})
    res.status(200).json(data);
}))


app.post("/register", AsyncWrapper(async (req, res) => {
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    const data = await AuthModel.create({ username: req.body.username, password: hashPassword })
    res.status(200).json({ message: "now you can login" })
}))

app.post("/login", AsyncWrapper(async (req, res) => {
    const user = await AuthModel.find({ username: req.body.username })
    if (user.length === 0) {
        return res.status(404).json({ message: "user not found" })
    }
    if (await bcrypt.compare(req.body.password, user[0].password)) {
        return res.status(200).json({ message: "success login" })
    }
    else {
        res.status(400).json({ message: "creds are wrong not allowed to login" })
    }

}))

app.use(notFound)
app.use(errorHandler)

mongoose.connect(mongoDBURL)
    .then(() => {
        console.log("connected to Database")
        app.listen(5000, () => {
            console.log("listening to port 5000")
        })
    })

































// import express from "express"
// import bcrypt from "bcrypt"
// const app = express();

// app.use(express.json())

// const users = []

// app.get("/users", (req, res) => {
//     res.status(200).json(users)
// })

// app.post("/users", async (req, res) => {
//     try {
//         const salt = await bcrypt.genSalt(10)
//         const cryptPassword = await bcrypt.hash(req.body.password, salt)
//         const data = { name: req.body.name, password: cryptPassword }
//         users.push(data)
//         res.status(200).send()
//     } catch (error) {
//         console.log(error.message)
//         res.status(400).json({ message: error.message })
//     }
// })

// app.post("/users/login", async(req, res) => {
//     const user = users.find(user => user.name === req.body.name)
//     if(!user){
//         return res.status(404).json("not found")
//     }
//     try {
//         if(await bcrypt.compare(req.body.password, user.password)){
//             return res.status(200).json("success")
//         }
//         else{
//             return res.status(200).json("not allowed")
//         }
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).json({ message: error.message })
//     }
// })

// app.listen(5000, () => {
//     console.log(`listening to port 5000`)
// })
