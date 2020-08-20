const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));//设置post body数据的大小 
app.use('/api', (req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*")
   res.header("Access-Control-Allow-Headers", "*")
   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
   res.header("Content-Type", "application/json;charset=utf-8")
   next()
})
app.use(express.static(path.resolve(__dirname, '../dist')))
 
app.get('/', function(req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
    res.send(html)
})
app.listen(3000, () => {
   console.log('服务器开启');
})
const route = require('./require');
app.use('/api', route);