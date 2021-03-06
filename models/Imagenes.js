const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

const imagenesSchema =  new mongoose.Schema({
/*     nombre: {
        type: String,
        //required: 'El nombre de la imagen es obligatoria',
        trim: true,
    }, */
    imagen: String,
    registro:{
        type: Date,
        default: Date.now()
    },
    url : {
        type: String,
        lowercase:true
    },
    urlC : {
        type: String,
    },
});

imagenesSchema.plugin(AutoIncrement, {inc_field: 'id'});

imagenesSchema.pre('save', function(next) {

    // crear la url
    const url = slug('url');
    this.url = `${url}-${shortid.generate()}`;
    next();
})


module.exports = mongoose.model('Imagenes', imagenesSchema);