const { createServer } = require('http');
const express = require('express');
const cors = require('cors');
const request = require('request');
const path = require('path');
const appDir = path.dirname(__dirname);
const fs = require('fs');
const multer = require('multer');
const child_process = require('child_process');

const app = express();
app.use(cors());

const server = createServer(app);
const port = 3500;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files/img');
  },
  filename: (req, file, cb) => {
    console.log(req.body);
    cb(null, `${req.body.name}.png`);
  },
});
const uploadFiles = multer({
  storage: storage,
});

app.get('/', (req, res) => {
  res.status(200).send(`song_server`);
});

app.post('/upload', uploadFiles.single('img'), async (req, res) => {
  const name = req.body.name;
  const thumbnail = appDir + `/song/files/${name}.png`;
  await child_process.spawn('python3', ['DL.py', thumbnail, name]);
  const items = appDir + `/song/python/${name}.glb`;
  //curl
  request.post(
    {
      url: 'https://api.v2.dev.twin.world/item/upload',
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMUdTQTc3Mkc5RkhBTVRDTkU3NzRTMjNZMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjc2NTUyMzY4LCJleHAiOjE2NzY1NTU5Njh9.E3fJlavZV8sWk9Q3E_8QkW0aPXmzOCXltMXmzXwUbkg',
      },
      formData: {
        itemName: 'test',
        thumbnail: fs.createReadStream(thumbnail),
        item: fs.createReadStream(items),
      },
    },
    function (error, response, body) {
      console.log(body);
    }
  );
  res.status(200).send('upload S');
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
