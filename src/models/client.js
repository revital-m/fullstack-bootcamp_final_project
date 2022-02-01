const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clientSchema = new mongoose.Schema({
    passportID: {
        type: String,
        required: true,
        unique: true,
    },
    cash: {
        type: Number,
        default: 0,
    },
    credit: {
        type: Number,
        default: 0,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

clientSchema.pre('save', async function (next) {
    const client = this;

    if (client.isModified('password')) {
        client.password = await bcrypt.hash(client.password, 8);
    }
    next();
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;