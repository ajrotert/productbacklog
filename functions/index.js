const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./tsconfig.json');
const express = require('express');
const engines = require('consolidate');

const app = express();
app.engine('hbs', engines.handlebars);
app.set('views', './view')
app.set('view engine', 'hbs')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();


var collections = db.collection("ProductBacklog");

function getPBIs() {
    return collections.get()
}
function setPBI() {
    collections.doc().set({
        downloads: null
    });
}

app.get('/app', (request, response) => {
    
    getPBIs()
        .then(snapshot => {
            snapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
            });
            return;
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
    //var uid = request.param.ID;
    response.render('app', { userID: 'Testing' } );

});

exports.app = functions.https.onRequest(app);


