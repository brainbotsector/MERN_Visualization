const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const dataRoutes = require("./routes/data");
const Data = require("./models/Data");
app.use("/api/data", dataRoutes);

function getRandomData() {
  return {
    end_year: "2024",
    intensity: Math.floor(Math.random() * 100),
    sector: "Technology",
    topic: "AI",
    insight: "AI is transforming the tech sector",
    url: "https://example.com",
    region: "Global",
    start_year: "2020",
    impact: "High",
    added: new Date().toISOString(),
    published: new Date().toISOString(),
    country: "USA",
    relevance: Math.floor(Math.random() * 100),
    pestle: "Technological",
    source: "Example Source",
    title: "The Impact of AI",
    likelihood: Math.floor(Math.random() * 100),
  };
}

mongoose.connect("mongodb://127.0.0.1:27017/dashboardDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const modelNames = mongoose.modelNames();



Data.find()
  .then((docs) => {
    console.log(docs);
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

