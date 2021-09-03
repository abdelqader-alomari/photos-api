const express = require('express')
const app = express();
app.use(express.json());
require('dotenv').config();
const axios = require('axios');
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose')
mongoose.connect(`${process.env.MONGO_URL}/photos`, { useNewUrlParser: true });

const PORT = process.env.PORT || 8050

const photosSchema = new mongoose.Schema({
    likes: String,
    raw: String,
    alt_description: String,
    email: String,
})
const photosModel = mongoose.model('photos', photosSchema)


app.get('/', (req, res) => {
    res.send('Welcome to home')
})
app.get('/api', (req, res) => {
    const { search } = req.query
    axios.get(`${process.env.API}&query=${search}&client_id=${process.env.CLIENT_ID}`)
        .then(result => { res.send(result.data) })
})
app.post('/add', (req, res) => {
    const { likes, raw, alt_description, email } = req.body
    const photos = new photosModel({
        likes: likes,
        raw: raw,
        alt_description: alt_description,
        email: email
    })
    photos.save()
})

app.get('/fav', (req, res) => {
    const { email } = req.query
    photosModel.find({ email: email }, (error, data) => {
        error ? res.send(error) : res.send(data)
    })
})

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params
    photosModel.deleteOne({ _id: id }, (err, data) => { })
    photosModel.find({}, (err, data) => { res.send(data) })
})

app.put('/update/:id', (req, res) => {
    const { id } = req.params
    const { raw, alt_description } = req.body
    photosModel.findByIdAndUpdate({ _id: id }, {
        raw: raw,
        alt_description: alt_description,
    }, {
        new: true
    }, (err, data) => res.send(data)
    )
})
app.listen(PORT, () => { console.log(`listening on port http://localhost:${PORT}`) })