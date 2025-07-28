const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const  userRoute= require("./routes/authRoute");
 const projectRoute  = require("./routes/projectRoute")
 const taskRoute = require("./routes/taskRoute");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors());
app.use(express.json()); 

app.use("/api/v1/user", userRoute);
app.use("/api/v1/project", projectRoute)
app.use("/api/v1/tasks", taskRoute);


// DB Connection
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
