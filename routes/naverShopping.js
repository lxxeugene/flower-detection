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

  const categoryId = "50001805";
  const displayPerPage = 100;
  const maxResults = 1000;

  let start = 1;
  const allResults = [];

  try {
    while (start <= maxResults) {
      const apiUrl = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(
        flowername
      )}&display=${displayPerPage}&start=${start}&sort=sim&category=${categoryId}`;

      const response = await axios.get(apiUrl, {
        headers: {
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": clientSecret,
        },
      });

      const items = response.data.items || [];
      if (items.length === 0) break;

      allResults.push(...items);
      start += displayPerPage;
    }

    res.json({ items: allResults });
  } catch (error) {
    console.error("네이버 쇼핑 API 오류:", error.message);
    return errorResponse(res, 500, "네이버 쇼핑 API 호출 실패");
  }
});

module.exports = router;
