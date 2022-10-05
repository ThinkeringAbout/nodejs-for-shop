const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3030;

// const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const admin = require('firebase-admin')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');


const jsonParser = bodyParser.json()
const serviceAccount = require('./key.json');

app.use(express.json())
app.use(cors())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();
const docRef = db.collection('orders');
const mealsRef = db.collection('meals');

app.get('/meals', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  let meals = []
    await db.collection('meals').get().then(snapshot => {
        snapshot.forEach((doc) => {
          meals.push(doc.data())
        });
        res.send(meals)
    });
})

app.get('/orders', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  let orders = []
    await db.collection('orders').get().then(snapshot => {
        snapshot.forEach((doc) => {
          orders.push(doc.data())
        });
        res.send(orders)
    });
})

app.post('/order', jsonParser, (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  docRef.doc(req.body.id).set(req.body)
  res.send("OK")
})

app.post('/addmeal', jsonParser, (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  mealsRef.add(req.body)
  res.send("OK")
})

app.post('/updateorder', jsonParser, (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  // console.log(req.body.completed)
  const statusToSend = {
    completed: req.body.completed
  }
  docRef.doc(req.body.id).update(statusToSend)
  res.send("OK")
})

// app.post('/create', async (req, res) => {
//   const userResponse = await admin.auth().createUser({
//     email: req.body.email,
//     password: req.body.password,
//   }).then((userRecord) => {
//     console.log("Created user", userRecord.uid)
//     res.send("Ok")
//   }).catch((err) => {
//     console.log("Error", err)
//     res.send("Bad")
//   })
// })

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})