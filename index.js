const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute= require('./routes/auth')
const userRoute= require('./routes/users')
const moviesRoute= require('./routes/movies')
const listRoute= require('./routes/lists')

dotenv.config();    

mongoose.connect(process.env.Mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("DB connected successfully")).catch((err) => console.log(err));

app.use(express.json())
app.use('/api/auth',authRoute)
app.use('/api/users',userRoute)
app.use('/api/movies',moviesRoute)
app.use('/api/lists',listRoute)

app.listen(5000, () => {
    console.log("Backend Server is running!")
});


