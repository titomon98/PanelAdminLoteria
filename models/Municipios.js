const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

const municipiosSchema = new mongoose.Schema({
    municipio: {
        type: String,
    },
    valorM: {
        type: String,
    },
    departamento: {
        type: String,
    },
    valorD: {
        type: String,
    },
    registro: {
        type: Date,
        default: Date.now()
    },
    url: {
        type: String,
        lowercase: true
    },
});

municipiosSchema.pre('save', function (next) {
    // crear la url
    const url = slug('url');
    this.url = `${url}-${shortid.generate()}`;
    next();
})


module.exports = mongoose.model('Municipios', municipiosSchema);