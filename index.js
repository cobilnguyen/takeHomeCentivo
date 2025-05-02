const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const { Types } = require('mongoose');

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB Connection Error:', err)
})

app.get('/users/:id', async (req, res) => {
    const {id} = req.params;

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid id'});
    }

    try {

        // console.log('Looking for ID:', id);

        const user = await User.findById(id);
        // console.log('User found:', user);


        if (user == null) {
            return res.status(404).json({error: 'User not found'});
        }

        if (user && user.age > 21) {

            res.json(user);

        } else if (user.age < 21) {

            return res.status(404).json({error: 'User is under 21 years old'});

        }

        return res.status(404).json({error: 'User not found'});

    } catch (err) {
        res.status(500).json({ error: 'Sever error'});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sever running on ${PORT}`));