import app from "./app.js";
import { connectDB } from "./db/connection.js";

const PORT = 3000;

app.listen(PORT, () => {
  try {
    connectDB();
    console.log(`Server is up and running on port ${PORT}`);
  } catch ( error) {
    console.log("Error connecting to database", error);
  }
});