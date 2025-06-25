const express = require("express");
const router = express.Router();
const Flower = require("../models/flower");
const errorResponse = require("../utils/errorResponse");

router.get("/", async (req, res) => {
  const flowername = req.query.flowername;

  if (!flowername) {
    return res.status(400).json({ error: "flowername query 파라미터가 필요합니다." });
    // 또는: return errorResponse(res, 400, "flowername query 파라미터가 필요합니다.");
  }

  try {
    const flower = await Flower.findOne({
      $or: [{ flowername }, { flowername_kr: flowername }],
    });

    if (!flower) {
      return res.status(404).json({ error: "해당 꽃을 찾을 수 없습니다." });
    }

    res.json({
      flowername: flower.flowername,
      habitat: flower.habitat,
      binomialName: flower.binomialName,
      classification: flower.classification,
      flowername_kr: flower.flowername_kr,
    });
  } catch (error) {
    console.error("꽃 조회 중 오류:", error.message);
    res.status(500).json({ error: "서버 내부 오류" });
  }
});

module.exports = router;
