const express = require('express')
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config()
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
const { fork } = require('child_process');  
// Fungsi untuk menjalankan tugas async dalam proses anak
function asyncTask(taskId) {
  console.log(`Task ${taskId} started.`);
  setTimeout(() => {
    console.log(`Task ${taskId} completed.`);
  }, 1000); // Simulasi tugas async dengan setTimeout
}

// Array untuk menyimpan proses anak
const childProcesses = [];

//config pname
function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

function generateUUIDs(count) {
  const uuids = [];
  for (let i = 0; i < count; i++) {
      uuids.push(generateUUIDv4());
  }
  return uuids;
}

const config = generateUUIDs(10000);

// for (let i = 0; i < 5; i++) {
//   const childProcess = fork(__dirname + '/child.js');
//   childProcesses.push(childProcess);

//   // Kirim pesan ke proses anak untuk menjalankan tugas async
//   childProcess.send({ taskId: i });
// }

// Tangani pesan yang diterima dari proses anak
// childProcesses.forEach(childProcess => {
//   childProcess.on('message', message => {
//     asyncTask(message.taskId);
//   });
// });
const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_ujiapi',
  password: 'yambuhyah',
  port: 5432,
})

//jajal influxdb
const {InfluxDB, Point} = require('@influxdata/influxdb-client')


// for (let i = 0; i < 5; i++) {
//   let point = new Point('measurement1')
//     .tag('tagname1', 'tagvalue1')
//     .intField('field1', i)

//   void setTimeout(() => {
//     writeClient.writePoint(point)
//   }, i * 1000) // separate points by 1 second

//   void setTimeout(() => {
//     writeClient.flush()
//   }, 5000)
// }
//end influxd
// Menghasilkan karakter acak antara huruf a dan z
function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

const insertTodoData = (data) => {
   pool.query('INSERT INTO todo (id, pn, av, rk, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *', [generateRandomCode(20), data?.PN,  data?.AV, data?.RK, new Date()], (error, results) => {
     if (error) {
       throw error
     }
   //   response.status(201).send(`User added with ID: ${results.rows[0].id}`)
   })
}

var cron = require('node-cron');

const token = process.env.INFLUXDB_TOKEN
const url = 'http://localhost:8086'

const client = new InfluxDB({url, token})
let org = `Organisasi Jahat`
let bucket = `wkwk`

let writeClient = client.getWriteApi(org, bucket, 'ns')
cron.schedule('* * * * * *', () => {
  console.log('running every 1 seconds');
  config.forEach((configData) =>  {
      let point1 = new Point('todo')
      .tag('pname', configData)
      .intField('av', Math.random())
      writeClient.writePoint(point1)

      // let point2 = new Point('todo')
      // .tag('pname', configData)
      // .intField('rk', Math.random())
      //   writeClient.writePoint(point2)

        // writeClient.flush()
  // void setTimeout(() => {
  //   writeClient.flush()
  // }, 5000)
    // insertTodoData({
    //   PN: configData,
    //   AV: Math.random(),
    //   RK: Math.random()
    //  })
  })
  // Buat beberapa proses anak
  // config.forEach((configData) =>  {
  //   const childProcess = fork(__dirname + '/child.js');
  
  //   //   // Kirim pesan ke proses anak untuk menjalankan tugas async
  //     childProcess.send(configData);
  // })
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
