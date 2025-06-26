const express = require("express");
const axios = require("axios");
const router = express.Router();
const errorResponse = require("../utils/errorResponse");

router.get("/", async (req, res) => {
  const flowername = req.query.flowername;
  if (!flowername) {
    return errorResponse(res, 400, "flowername query 파라미터가 필요합니다.");
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return errorResponse(res, 500, "네이버 API 인증 정보가 없습니다.");
  }

  try {
    const apiUrl = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(
      flowername
    )}&display=5&start=1&sort=sim`;

    const response = await axios.get(apiUrl, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
    });

    const images = (response.data.items || []).slice(0, 3).map(item => item.image);
    res.json({ images });
  } catch (error) {
    console.error("대표 이미지 조회 오류:", error.message);
    return errorResponse(res, 500, "대표 이미지 조회 실패");
  }
});

module.exports = router;
