const express = require('express')
const mongoose = require('mongoose');
const router = require('./routes/user-routes.js')
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({credentials: true, origin: "https://mai-cadenza.onrender.com"}));//stavi: http://localhost:3000 za localhost
app.use(cookieParser());
app.use(express.json());
app.use('/api', router);
app.get("/*", function (req, res) {
    path.join(__dirname, "../client/build/index.html"),
    function(err) {
        res.status(500).send(err);
    }
});

const PORT = process.env.PORT || 5000;
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.r3ypmfa.mongodb.net/`).then(()=>{
    app.listen(PORT);
    console.log("database is connected");
    console.log("listening to 5000");
}).catch((err)=>console.log(err)); 
