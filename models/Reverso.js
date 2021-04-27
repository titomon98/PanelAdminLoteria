const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

const reversoSchema = new mongoose.Schema({
    imagen: String,
    registro: {
        type: Date,
        default: Date.now()
    },
    url: {
        type: String,
        lowercase: true
    },
    urlR: {
        type: String,
    },
});

reversoSchema.pre('save', function (next) {

    // crear la url
    const url = slug('url');
    this.url = `${url}-${shortid.generate()}`;
    next();
})


module.exports = mongoose.model('Reverso', reversoSchema);