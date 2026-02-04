import "./bootstrap.js";
import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🧠 CEREBRO backend running on port ${PORT}`);
});
