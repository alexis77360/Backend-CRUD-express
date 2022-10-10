//? import express
const express = require('express');

//? Mongoose pour la BDD
const mongoose = require('mongoose');

//? créer une application express
const app = express();

//? importer la root Thing
const Thing = require('./models/Thing');

//? Connexion à la BDD
mongoose.connect("mongodb+srv://alexfavdev:alexis20@cluster0.oyormvk.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//? Intercepte du JSON équivalent à body-parser ( corps de la requete)
app.use(express.json());

//? créer une route GET pour tous les utilisateurs
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//? Infos obtenu par le formulaire
app.post('/api/stuff', (req, res, next) => {
    //! Retirer le champ id car généré par MongoDB
    delete req.body._id;

    const thing = new Thing({
        //! Copie les champs de la requete
        ...req.body
    });
    //! Enregistre dans la BDD
    thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
    
});

//? Modifier les données de la BDD
app.put('/api/stuff/:id', (req, res, next) => {
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
});

//? Supprimer un élément de la BDD
app.delete ('/api/stuff/:id', (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});



//? Récupérer les données de la BDD pour 1 élément
app.get('/api/stuff/:id', (req, res, next) => {

    //! Trouve l'objet avec l'id 
    Thing.findOne({
            _id: req.params.id
        })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));

});


//? middleware pour gérer les requêtes entrantes
app.get('/api/stuff', (req, res, next) => {

    //! Récupère tous les éléments de la BDD
    Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));


});

//? exporter la constante app
module.exports = app;