const jsonServer = require("json-server");
const cors = require("cors");

const app = jsonServer.create();
const router = jsonServer.router("db.json"); // Path to your db.json file
const middlewares = jsonServer.defaults();

// Enable CORS
app.use(
  cors({
    origin: "https://gbmobile.onrender.com/", // Replace with your frontend URL
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

// Middleware for serving JSON Server
app.use(middlewares);
app.use(router);

// Start JSON Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
