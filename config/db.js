const mongoose = require("mongoose");

const connectDB = async () => {
  const dbUrl = process.env.MONGODB_URI;
  if (!dbUrl) throw new Error("MONGODB_URI 환경변수가 없습니다.");

  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB 연결 성공");
  } catch (error) {
    console.error("❌ MongoDB 연결 실패:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
