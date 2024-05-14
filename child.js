const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_ujiapi',
  password: 'yambuhyah',
  port: 5432,
})

// Menghasilkan karakter acak antara huruf a dan z
function randomString() {
    var result = '';
    var characters = '0123456789'; // Karakter yang digunakan untuk string acak
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) { // Loop sebanyak 6 kali untuk mendapatkan 6 digit
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const insertTodoData = (data) => {
   pool.query('INSERT INTO todo (id, pn, av, rk, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *', [randomString(), data?.PN,  data?.AV, data?.RK, new Date()], (error, results) => {
     if (error) {
       throw error
     }
   //   response.status(201).send(`User added with ID: ${results.rows[0].id}`)
   })
}

process.on('message', message => {
   // Jalankan tugas async di sini, contohnya:
   console.log("Message: "+JSON.stringify(message))

   insertTodoData({
    PN: message,
    AV: Math.random(),
    RK: Math.random()
   })

  //  app.get('/', (req, res) => {
  //    fetch("localhost").then(function(response) {
  //      return response.json();
  //    }).then(function(data) {
  //        const newData = JSON.parse(data)
  //        insertTodoData(newData.Rows[0])
  //    })
  //  })
   // Kirim pesan balasan bahwa tugas selesai
   process.send(message);
 });