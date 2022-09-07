import Database from "better-sqlite3";
import express from "express";
import cors from "cors";

const db = new Database("./db/data.db", { verbose: console.log });
const app = express();
app.use(cors());
app.use(express.json());

const port = 3333;

const getMuseums = db.prepare("SELECT * FROM museums");

const getMuseumById = db.prepare("SELECT * FROM museums WHERE id = ?");

const getWorksForMuseum = db.prepare(`
SELECT * FROM works WHERE museumId = ?;
`);

const getWorks = db.prepare(`SELECT * FROM works`);

const getWorkById = db.prepare(`SELECT * FROM works WHERE id = ?`);

const createMuseum = db.prepare(`
INSERT INTO museums 
  (name, city) 
VALUES 
  (@name, @city);
`);

const createWork = db.prepare(`
INSERT INTO works 
  (name, picture, museumId) 
VALUES 
  (@name, @picture, @museumId);
`);

app.get("/museums", (req, res) => {
  const museums = getMuseums.all();

  for (const museum of museums) {
    const works = getWorksForMuseum.all(museum.id);
    museum.works = works;
  }

  res.send(museums);
});

app.get("/museums/:id", (req, res) => {
  const { id } = req.params;
  const museum = getMuseumById.get(id);

  if (museum) {
    const works = getWorksForMuseum.all(museum.id);
    museum.works = works;

    res.send(museum);
  } else {
    res.status(404).send({ error: "Museum not found" });
  }
});

app.get("/works", (req, res) => {
  const works = getWorks.all();

  for (const work of works) {
    const museum = getMuseumById.get(work.museumId);
    work.museum = museum;
  }

  res.send(works);
});

app.get("/works/:id", (req, res) => {
  const { id } = req.params;
  const work = getWorkById.get(id);

  if (work) {
    const museum = getMuseumById.get(work.museumId);
    work.museum = museum;
    res.send(work);
  } else {
    res.status(404).send({ error: "ArtWork not found" });
  }
});

app.post("/museums", (req, res) => {
  const info = createMuseum.run(req.body);
  const newMuseum = getMuseumById.get(info.lastInsertRowid);

  const works = getWorksForMuseum.all(newMuseum.id);
  newMuseum.works = works;

  res.send(newMuseum);
});

app.post("/works", (req, res) => {
  const newWork = createWork.run(req.body);
  res.send(newWork);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
