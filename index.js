'use strict'
require('dotenv').config()
const express = require('express')
const app = express()
const port = 8080
const bodyParser = require('body-parser')
var createDocument = require('./createDocument')

/*
User to specify the start and end documents from the command line*
*The app makes the assumption that the data files are in sequential order
From the command line...
$ node index.js <startDocumentID> <endDocumentID>
*/

// ** GET USER INPUT FOR START AND END DOCUMENTS **
var startDocumentID = process.argv[2];
var endDocumentID = process.argv[3];

// ** MIDDLEWARE **
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// ** END MIDDLEWARE **

/*
TODO - Create front end user interface
At present the files are created upon the user
navigating to the root '/' 
*/

app.get('/', function(req, res) {

    for(let documentID = startDocumentID; documentID <= endDocumentID; documentID++) {
      createDocument(documentID.toString())
    }
    
    res.send("Reload this app to get the data you want")   
})

app.listen(port)



       









