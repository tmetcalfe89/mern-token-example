const path = require("path");
const express = require("express");
const { v4: uuid } = require("uuid");

const app = express();

const { PORT = 3000 } = process.env;

// Should have a better storage solution than in-memory.
const users = [
  {
    "username": "admin",
    "password": "adminpass",
    "id": "uuid-1"
  },
  {
    "username": "user",
    "password": "userpass",
    "id": "uuid-2"
  }
];

const tokens = {
  //  A rough example of what entries in here will look like:
  // "token-1": {
  //   "id": "uuid-1",
  //   "expires": 1695189372372
  // }
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// A helpful piece of middleware to populate req.user with the currently logged-in user on the incoming request.
app.use((req, res, next) => {
  const authToken = req.headers.authorization;
  if (authToken != undefined) {
    const tokenUser = tokens[authToken];
    if (tokenUser != undefined && tokenUser.expires > Date.now()) {
      req.user = users.find((user) => user.id === tokenUser.id);
    }
  }
  next();
});

app.post("/api/users/login", (req, res) => {
  // Get the submitted credentials.
  const { username, password } = req.body;

  // Find the matching user.
  const matchingUser = users.find((user) => user.username === username && user.password === password);
  // If one doesn't exist, error out and blame the client for submitting bad credentials.
  if (!matchingUser) {
    res.sendStatus(400);
    return;
  }

  // If one does exist, the credentials were valid. Create a new token and store it in the token store.
  const token = uuid();
  tokens[token] = {
    id: matchingUser.id,
    expires: Date.now() + 24 * 60 * 60 * 1000 // Make the token good for 24hrs after creation.
  };

  res.send(token);
});

// This is our test route. We attempt to get information from the users API, which returns the currently logged in user, or a 403 error.
app.get("/api/users", (req, res) => {
  if (req.user) {
    res.json(req.user);
    return;
  }

  res.sendStatus(403);
});

app.use(express.static(path.join(__dirname, "../client/dist")))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT);