// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');

//Setting up express and port
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//GET routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"))
})

app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, notes) => {
        if (err) {
            console.log(err)
            return
        }
        res.json(JSON.parse(notes))
    })
})

//POST route
app.post('/api/notes', (req, res) => {
    const newNote = req.body
    let notesDB = []
    fs.readFile(path.join(__dirname + "/db/db.json"), "utf8", (err, data) => {
        if (err) {
            return console.log(err)
        }
        // If starting a blank JSON file
        if (data === '') {
            notesDB.push({"id": 1, "title": newNote.title, "text": newNote.text })
        } else {
            console.log(data)
            notesDB = JSON.parse(data)
            notesDB.push({ "id": notesDB.length + 1, "title": newNote.title})
        }
        //Updating existing notes and pushing to db.json
        fs.writeFile((path.join(__dirname + '/db/db.json')), JSON.stringify(notesDB), (err) => {
            if (err) return console.log(err)
            res.json(notesDB)
        })
    })
})

//DELETE route
app.delete("/api/notes/:id", (req, res) => {
    const noteID = req.params.id
    let notesDB = []
    fs.readFile(path.join(__dirname + '/db/db.json'), 'utf8', (err, data) => {
        if (err) return console.log(err)
        console.log(data)
        notesDB = JSON.parse(data)
        notesDB = notesDB.filter((object) => {
            return object.id != noteID
        })
        fs.writeFile((path.join(__dirname + '/db/db.json')), JSON.stringify(notesDB), (err) => {
            if (err) return console.log(err)
            res.json(notesDB)
        })
    })
})


// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));