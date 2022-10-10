const mongoose = require('mongoose');

//? Création du schéma de données
const thingSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
});

//? Exporter le modèle pour pouvoir l'utiliser dans d'autres fichiers
module.exports = mongoose.model('Thing', thingSchema);