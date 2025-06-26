router.post("/", async (req, res) => {
  const { userId, flower, memo, imageUrl } = req.body;

  if (!userId || !flower?.flowername) {
    return res.status(400).json({ error: "필수 정보 누락" });
  }

  try {
    const exists = await Collection.findOne({ userId, "flower.flowername": flower.flowername });
    if (exists) return res.status(409).json({ error: "이미 도감에 존재합니다." });

    const entry = await Collection.create({ userId, flower, memo, imageUrl, createdAt: new Date() });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: "서버 오류" });
  }
});
