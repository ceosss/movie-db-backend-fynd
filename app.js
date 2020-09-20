const express = require("express");
const app = express();
const mongoose = require("mongoose");
var cookieSession = require("cookie-session");
var cors = require("cors");
var bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://sswarajsamant:bs1999rs@students-s3blg.mongodb.net/movie-db",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const movieSchema = new mongoose.Schema({
  popularity: Number,
  director: String,
  genre: [String],
  imdb_score: Number,
  name: String,
  lastEdited: String,
});
const movie = mongoose.model("movie", movieSchema);

const genreSchema = new mongoose.Schema({
  name: String,
});
const genre = mongoose.model("genre", genreSchema);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const user = mongoose.model("user", userSchema);

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["secret"],
  })
);

app.get("/movies", (req, res) => {
  movie.find({}, (error, resp) => {
    if (error) {
      console.error(error);
    } else {
      console.log("/movies");
      res.json(resp);
    }
  });
});

app.get("/genres", (req, res) => {
  genre.find({}, (error, resp) => {
    if (error) {
      console.error(error);
    } else {
      console.log("/genres");
      res.json(resp);
    }
  });
});

app.post("/register", (req, res) => {
  console.log("/register");
  let { email, password } = req.body;
  user.find({ email }, (error, resp) => {
    if (error) {
      console.error(error);
    } else {
      if (resp.length) {
        res.json("user already exists");
      } else {
        user.create({ email, password }, (error, response) => {
          if (error) {
            console.error(error);
          } else {
            res.json({ status: "success" });

            // res.json(response);
          }
        });
      }
    }
  });
});

app.post("/login", (req, res) => {
  let { email, password } = req.body;
  const token = jwt.sign({ date: new Date(), email }, "secret");
  console.log("/login");
  user.findOne({ email }, (error, resp) => {
    if (error) {
      console.error(error);
    } else {
      if (resp) {
        if (resp.password === password) {
          res.json({ token, status: "success" });
        } else {
          res.json({ status: "incorrect password" });
        }
      } else {
        res.json({ status: "user doesn't exists" });
      }
    }
  });
});

//delete,

app.delete("/movies/:name", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      var decoded = jwt.verify(token, "secret");
      console.log(decoded);
      const { name } = req.params;
      console.log("/delete");
      movie.deleteOne({ name }, (error, response) => {
        if (error) {
          console.error(error);
        } else {
          console.log();
          ({ name, status: "deleted S" });
        }
      });
      res.json({ name, status: "deleted S" });
    } catch (error) {
      res.status(400).json("Token not valid");
    }
  } else {
    res.sendStatus(401);
  }
});

app.put("/movies", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      var decoded = jwt.verify(token, "secret");
      console.log(decoded);
      // const { name } = req.params;

      console.log("/update");
      const {
        name,
        director,
        popularity,
        imdb_score,
        genre,
        lastEdited,
      } = req.body;
      movie.updateOne(
        { name },
        {
          name,
          director,
          popularity,
          imdb_score,
          genre,
          lastEdited,
        },
        (error, resp) => {
          if (error) {
            console.error(error);
          } else {
            console.log("Updated");
            console.log({
              name,
              director,
              popularity,
              imdb_score,
              genre,
              lastEdited,
            });
            res.json("updated");
          }
        }
      );
    } catch (error) {
      res.status(400).json("Token not valid");
    }
  } else {
    res.sendStatus(401);
  }
});

app.post("/movies", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      var decoded = jwt.verify(token, "secret");
      console.log(decoded);
      console.log("/create");

      const {
        name,
        director,
        popularity,
        imdb_score,
        genre,
        lastEdited,
      } = req.body;
      movie.create(
        {
          name,
          director,
          popularity,
          imdb_score,
          genre,
          lastEdited,
        },
        (error, resp) => {
          if (error) {
            console.error(error);
          } else {
            console.log(resp);
            res.json("Created");
          }
        }
      );
    } catch (error) {
      res.status(400).json("Token not valid");
    }
  } else {
    res.sendStatus(401);
  }
});

app.get("/port", async (req, res) => {
  // let uniqueGenre = new Set();
  // await allMovies.map(async (mov) => {
  //   await mov.genre.map(async (m) => {
  //     uniqueGenre.add(m.trim());
  //   });
  // });
  // console.log(uniqueGenre);
  // uniqueGenreArray = [...uniqueGenre];
  // uniqueGenreArray.map(async (unique) => {
  //   const created = await genre.create({ name: unique.trim() });
  //   console.log("CREATED: ", created.name);
  // });
});

app.listen(3000, () => {
  console.log("SERVER STARTED AT PORT: ", 3000);
});
