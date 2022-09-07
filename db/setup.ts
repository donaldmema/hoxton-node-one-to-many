import Database from "better-sqlite3";

type Museum = {
  id: number;
  name: string;
  city: string;
};

type Work = {
  id: number;
  name: string;
  picture: string;
  museumId: number;
};

const museums: Museum[] = [
  {
    id: 1,
    name: "The Louvre",
    city: "Paris",
  },
  {
    id: 2,
    name: "The British Museum",
    city: "London",
  },
  {
    id: 3,
    name: "The Metropolitan Museum of Art",
    city: "New York",
  },
  {
    id: 4,
    name: "State Hermitage Museum",
    city: "St. Petersburg",
  },
  {
    id: 5,
    name: "Van Gogh Museum",
    city: "Amsterdam",
  },
];

const works: Work[] = [
  {
    id: 1,
    name: "Mona Lisa",
    picture:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1200px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
    museumId: 1,
  },
  {
    id: 2,
    name: "Death of the Virgin",
    picture:
      "https://upload.wikimedia.org/wikipedia/commons/c/c5/Michelangelo_Caravaggio_069.jpg",
    museumId: 1,
  },
  {
    id: 3,
    name: "Rosetta Stone",
    picture:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rosetta_Stone.JPG/1200px-Rosetta_Stone.JPG",
    museumId: 2,
  },
  {
    id: 4,
    name: "Refugee",
    picture:
      "https://media.britishmuseum.org/media/Repository/Documents/2014_11/11_15/c3d4ed21_563f_4ebb_a650_a3e00105dd6d/mid_01603704_001.jpg",
    museumId: 2,
  },
  {
    id: 5,
    name: "The Death of Socrates",
    picture:
      "https://images.metmuseum.org/CRDImages/ep/original/DP-13139-001.jpg",
    museumId: 3,
  },
  {
    id: 6,
    name: "The Harvesters",
    picture: "https://images.metmuseum.org/CRDImages/ep/original/DP119115.jpg",
    museumId: 3,
  },
  {
    id: 7,
    name: "The Three Graces",
    picture:
      "https://upload.wikimedia.org/wikipedia/commons/3/30/Canova_-_The_Three_Graces%2C_between_1813_and_1816%2C_%D0%9D.%D1%81%D0%BA-506.jpg",
    museumId: 4,
  },
  {
    id: 8,
    name: "Irises",
    picture:
      "http://lh3.googleusercontent.com/eb2BcaWPNjxJbk5QDi6eVadvzWV1pA4Gm71XdlTPbqF4id9iQVik9SchSWr82w6cp40=w236-h300-n-l64",
    museumId: 5,
  },
  {
    id: 9,
    name: "The Potato Eaters",
    picture:
      "http://lh3.googleusercontent.com/IeeNA6zCqyq_PMWjH2QVMi-tHaIE5kRLUvGBSXYMxzVnzK8n1Yq4HOA8A_qIOcNM=w454-h300-n-l64",
    museumId: 5,
  },
];

const db = new Database("./db/data.db", { verbose: console.log });

const createMuseumsTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS museums (
        id INTEGER,
        name TEXT,
        city TEXT,
        PRIMARY KEY (id)
    )
`);

createMuseumsTable.run();

const deleteAllMuseums = db.prepare(`
    DELETE FROM museums;
`);

deleteAllMuseums.run();

const createMuseum = db.prepare(`
INSERT INTO museums (name, city) VALUES (?, ?);
`);

for (const museum of museums) {
  createMuseum.run(museum.name, museum.city);
}

const createWorksTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS works (
        id INTEGER,
        name TEXT,
        picture TEXT,
        museumId INTEGER,
        FOREIGN KEY (museumId) REFERENCES museums (id),
        PRIMARY KEY (id)
    )
`);

createWorksTable.run();

const deleteAllWorks = db.prepare(`
    DELETE FROM works;
`);

deleteAllWorks.run();

const createWork = db.prepare(`
INSERT INTO works (name, picture, museumId) VALUES (?, ?, ?);
`);

for (const work of works) {
  createWork.run(work.name, work.picture, work.museumId);
}
