require("dotenv").config();

const app = require("./app");
const prisma = require("./config/db");

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await prisma.$connect();

    console.log("PostgreSQL connected successfully");

    app.listen(PORT, () => {
      console.log(`DairySaathi server running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();