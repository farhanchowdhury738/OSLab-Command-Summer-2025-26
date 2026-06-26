/* ==========================================================
   Import Packages
========================================================== */

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

/* ==========================================================
   Create App
========================================================== */

const app = express();

const PORT = 3000;

/* ==========================================================
   Middleware
========================================================== */

app.use(cors());

app.use(express.json());

app.use(express.static(__dirname));

/* ==========================================================
   File Path
========================================================== */

const DATA_FILE = path.join(__dirname, "notes.json");

/* ==========================================================
   GET ALL NOTES
========================================================== */

app.get("/notes", (req, res) => {

    fs.readFile(DATA_FILE, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Unable to read notes."
            });
        }

        try {

            const notes = JSON.parse(data || "[]");

            res.json(notes);

        } catch {

            res.json([]);

        }

    });

});

/* ==========================================================
   ADD NEW NOTE
========================================================== */

app.post("/notes", (req, res) => {

    fs.readFile(DATA_FILE, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Unable to read notes."
            });
        }

        let notes = [];

        try {

            notes = JSON.parse(data || "[]");

        } catch {

            notes = [];

        }

        // Create New Note
        const newNote = {
            id: Date.now(),
            cmd: req.body.cmd,
            desc: req.body.desc
        };

        // Add New Note at Top
        notes.unshift(newNote);

        // Save File
        fs.writeFile(
            DATA_FILE,
            JSON.stringify(notes, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "Unable to save note."
                    });
                }

                res.json(newNote);

            }
        );

    });

});


/* ==========================================================
   UPDATE NOTE
========================================================== */

app.put("/notes/:id", (req, res) => {

    fs.readFile(DATA_FILE, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Unable to read notes."
            });
        }

        let notes = [];

        try {
            notes = JSON.parse(data || "[]");
        } catch {
            notes = [];
        }

        const id = Number(req.params.id);

        const index = notes.findIndex(note => note.id === id);

        if (index === -1) {
            return res.status(404).json({
                message: "Note not found."
            });
        }

        notes[index].cmd = req.body.cmd;
        notes[index].desc = req.body.desc;

        fs.writeFile(
            DATA_FILE,
            JSON.stringify(notes, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "Unable to update note."
                    });
                }

                res.json(notes[index]);

            }
        );

    });

});

/* ==========================================================
   DELETE NOTE
========================================================== */

app.delete("/notes/:id", (req, res) => {

    fs.readFile(DATA_FILE, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Unable to read notes."
            });
        }

        let notes = [];

        try {
            notes = JSON.parse(data || "[]");
        } catch {
            notes = [];
        }

        const id = Number(req.params.id);

        const updatedNotes = notes.filter(note => note.id !== id);

        fs.writeFile(
            DATA_FILE,
            JSON.stringify(updatedNotes, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "Unable to delete note."
                    });
                }

                res.json({
                    message: "Note deleted successfully."
                });

            }
        );

    });

});


/* ==========================================================
   START SERVER
========================================================== */

app.listen(PORT, () => {

    console.log(`🚀 Server running at http://localhost:${PORT}`);

});


