const express = require("express");
const router = express.Router();
const Collection = require("../models/Collection");
const errorResponse = require("../utils/errorResponse");

router.post("/", async (req, res) => {
  const { userId, flower, memo, date, imageBase64 } = req.body;

  if (!flower || !date || !imageBase64) {
    return errorResponse(res, 400, "필수 데이터 누락");
  }

  try {
    const newEntry = new Collection({
      userId,
      flower,
      memo,
      date,
      imageBase64,
    });
    await newEntry.save();
    return res.status(200).json({ success: true, message: "도감 저장 완료" });
  } catch (err) {
    console.error("도감 저장 오류:", err);
    return errorResponse(res, 500, "서버 오류로 저장 실패");
  }
});

module.exports = router;
