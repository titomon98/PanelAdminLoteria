const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

const departamentosSchema = new mongoose.Schema({
    departamento: {
        type: String,
    },
    valor: {
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

departamentosSchema.pre('save', function (next) {
    // crear la url
    const url = slug('url');
    this.url = `${url}-${shortid.generate()}`;
    next();
})


module.exports = mongoose.model('Departamentos', departamentosSchema);