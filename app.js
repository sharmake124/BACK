const express = require("express");

const app = express();

// GET "/" (index)
const { things } = require("./tab");
app.get("/things/:id", (req, res) => {
  const getId = parseInt(req.params.id);
  const element = things.find((findId) => findId.id === getId);

  if (element != null) {
    res.json(element);
  } else
    res.status(404).send("<h1> il y a rien ici, fait un demi-tour ;) </h1>");
});

const serverPort = 5000;

app.listen(serverPort, () => {
  console.info(`Listening on port ${serverPort}`);
});
