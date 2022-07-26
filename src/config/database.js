const mongoose = require('mongoose');

connectDatabase = () => {
    mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to database'))
        .catch((error) => console.error(error.message))
}

module.exports = connectDatabase;