const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 8000;


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const dbUrl = 'mongodb+srv://lxxeugene:Dbwls!6304@cluster-001.isumjls.mongodb.net/';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});

const flowerSchema = new mongoose.Schema({
  flowername: String,
  habitat: String,
  binomialName: String,
  classification: String,
  flowername_kr: String
});

const Flower = mongoose.model('Flower', flowerSchema, 'flowers');

app.get('/flowers', async (req, res) => {
  const flowername = req.query.flowername;

  try { 
    
    const flower = await Flower.findOne({ 
        $or: [
            { flowername: flowername },
            { flowername_kr: flowername }
          ]
        });

    if (!flower) {
      res.status(404).json({ error: 'Flower not found' });
    } else {
      const { flowername, habitat, binomialName, classification, flowername_kr } = flower;
      res.json({ flowername, habitat, binomialName, classification, flowername_kr }); 
    }
  } catch (error) {
    console.error('Error retrieving flower information:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
app.get('/naver-shopping', async (req, res) => {
  const flowername = req.query.flowername;

  if (!flowername) {
    res.status(400).json({ error: 'Flowername is required' });
    return;
  }

  const clientId = 'PJXYKu0xoFLTu8CprDAP';
  const clientSecret = 'b3wC5S13gL';
  const categoryId = '50001805'; 
  const displayPerPage = 100; 
  const maxResults = 1000; 

  let start = 1; 

  async function fetchNaverShoppingResults() {
    try {
      const allResults = [];

      while (start <= maxResults) { 
        const apiUrl = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(flowername)}&display=${displayPerPage}&start=${start}&sort=sim&category=${categoryId}`;
      
        const response = await axios.get(apiUrl, {
          headers: {
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret,
          },
        });

        const data = response.data;
        const items = data.items || [];

        if (items.length === 0) {
          break; 
        }

        allResults.push(...items);

       
        start += displayPerPage;

        if (start > maxResults) {
          break;
        }
      }

      return allResults;
    } catch (error) {
      console.error('네이버 쇼핑 API 오류:', error);
      throw new Error('Naver Shopping API error');
    } finally {
    }
  }

  try {
    const data = await fetchNaverShoppingResults();
    console.log(`총 ${data.length}개의 검색 결과를 가져왔습니다.`);
    res.json({ items: data }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Naver Shopping API error' }); 
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});