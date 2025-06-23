const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const flowername = req.query.flowername;
  if (!flowername) return res.status(400).json({ error: "Flowername is required" });

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
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

    console.log(`총 ${allResults.length}개의 검색 결과`);
    res.json({ items: allResults });
  } catch (error) {
    console.error("네이버 쇼핑 API 오류:", error);
    res.status(500).json({ error: "Naver Shopping API error" });
  }
});

module.exports = router;
