const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

// 유효한 이미지 확장자 리스트
const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

// 이미지 검색 엔드포인트
app.get("/api/search/image", async (req, res) => {
  try {
    const { query } = req.query;

    const response = await axios.get("https://dapi.kakao.com/v2/search/image", {
      params: {
        query,
      },
      headers: {
        Authorization: "KakaoAK b92864e98fc87df5095a7c133b01679f",
      },
    });

    const documents = response.data.documents || [];
    const validImage = documents.find((doc) =>
      validExtensions.some((ext) => doc.image_url.endsWith(ext))
    );
    const imageUrl = validImage?.image_url || documents[0]?.image_url;

    console.log(imageUrl);
    res.json({ imageUrl });
  } catch (error) {
    console.error("Kakao API error:", error);
    res.status(500).json({ message: "Failed to fetch image." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
