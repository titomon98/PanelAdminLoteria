const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

const actualizacionesSchema =  new mongoose.Schema({
    numero: {
        type: Number,
        required: 'El número de actualización es obligatoria'
    },
    descripcion: {
        type: String,
        trim: true,
        required: 'La descripción es obligatoria',
    },
    registro:{
        type: Date,
        default: Date.now()
    },
    url : {
        type: String,
        lowercase:true
    },
});

actualizacionesSchema.plugin(AutoIncrement, {inc_field: 'idUpd'});

actualizacionesSchema.pre('save', function(next) {

    // crear la url
    const url = slug(this.descripcion);
    this.url = `${url}-${shortid.generate()}`;

    next();
})


module.exports = mongoose.model('Actualizaciones', actualizacionesSchema);