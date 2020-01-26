const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true }));

var serviceAccount = require('../functions/permissions.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://news-demo-f509f.firebaseio.com"
});
const db = admin.firestore()

app.get('/hello-news', (req, res) => {
  return res.status(200).send('Hello news!');
});



  //read News
  app.get('/fetch-News', (req, res) => {
    (async () => {
        try {
            let query = db.collection('Articles');
            let response = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            // eslint-disable-next-line promise/always-return
            for (let doc of docs) {
                const selectedNews = {
                    id: doc.id,
                    Title: doc.data().Title,
                    Description:doc.data().Description,
                    Url:doc.data().Url,
                    UrlToImage:doc.data().UrlToImage,
               

                };
               response.push(selectedNews);

            }
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

    //read positive news

    app.get('/fetch-positivenews', (req, res) => {
        (async () => {
            try {
                let query = db.collection('Articles');
                let response = [];
                await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                // eslint-disable-next-line promise/always-return
                for (let doc of docs) {
                    if(doc.data().Score<=3){
                    const selectedNews = {

                        id: doc.id,
                        Title: doc.data().Title,
                        Description:doc.data().Description,
                        Url:doc.data().Url,
                        UrlToImage:doc.data().UrlToImage,
                      
                    };
                
                   response.push(selectedNews);
    
                }}
                });
                return res.status(200).send(response);
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            })();
        });
    


     
  

exports.app = functions.https.onRequest(app);