var express = require('express')
var cors = require('cors')
var fileUpload = require('express-fileupload')
var picturepath =
  'C:/Users/ZAZAZAZAZAZAZA/Downloads/BB/src/assets/salonspicture/'
var apiversion = '/api/v1'

const dotenv = require('dotenv')
dotenv.config()
const secretkey = process.env.SECRET

//MYSQL Connection
var db = require('./config/db.config')

const bcrypt = require('bcryptjs')
const { sign, verify } = require('./middleware.js')

var port = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(cors())

app.use(fileUpload())
app.post(apiversion + '/upload', verify, (req, res) => {
  if (!req.files) {
    return res.status(500).json({ msg: 'file is not found' })
  }

  const myFile = req.files.file

  myFile.mv(`${picturepath}${myFile.name}`, function (err) {
    if (err) {
      console.log(err)
      return res.status(500).json({ msg: 'Error occured' })
    }

    return res.json({ name: myFile.name, path: `/${myFile.name}` })
  })
})
app.post(apiversion + '/auth/signin', (req, res) => {
  db.query(
    'SELECT * FROM users',
    req.body.username,
    function (error, results, fields) {
      try {
        if (error) {
          throw error
        } else {
          let hashedPassword = results[0].password
          let userId = results[0].userId
          const correct = bcrypt.compareSync(req.body.password, hashedPassword)

          if (correct) {
            let user = {
              username: req.body.username,
              status_id: req.body.status_id,
              user_name: req.body.user_name,
              user_lastname: req.body.user_lastname,
              user_number: req.body.user_number,
              user_pic: req.body.user_pic,
              hsalon_id: req.body.hsalon_id,
              password: hashedPassword,
            }
            // create a token
            let token = sign(user, secretkey)

            res.setHeader('Content-Type', 'application/json')

            res.header(
              'Access-Control-Allow-Headers',
              'Origin, X-Requested-With, Content-Type, Accept'
            )

            return res
              .status(201)
              .json({
                error: false,
                message: 'user sigin',
                userId: userId,
                accessToken: token,
              })
          } else {
            return res.status(401).json('login fail')
          }
        }
      } catch (e) {
        return res.status(401).json('login fail')
      }
    }
  )
})

app.post(apiversion + '/auth/register', async (req, res) => {
  // res.setHeader('Content-Type', 'application/json')

  var username = req.body.username
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  var hsalon_name = req.body.hsalon_name
  var hsalon_detail = req.body.hsalon_detail
  var hsalon_time = req.body.hsalon_time
  var hsalon_pic = req.body.hsalon_pic
  var hsalon_address = req.body.hsalon_address
  var hsalon_lat = req.body.hsalon_lat
  var hsalon_lng = req.body.hsalon_lng
  var status_id = req.body.status_id
  var user_name = req.body.user_name
  var user_lastname = req.body.user_lastname
  var user_number = req.body.user_number
  var user_pic = req.body.user_pic
  var hsalon_id = req.body.hsalon_id

  //   db.query("SELECT MAX(hsalon_id)  AS Max FROM users ", function (error, results, fields) {
  //     if (error) throw error
  //     return res.json({ error: false, message: "Max ", data: results })
  //   })

  var newid
  await db.query(
    `INSERT INTO hair_salon 
    (hsalon_name,hsalon_detail, hsalon_time, hsalon_pic, hsalon_address,hsalon_lat, hsalon_lng) 
    VALUES ( '${hsalon_name}','${hsalon_detail}', '${hsalon_time}', '${hsalon_pic}', '${hsalon_address}', ${hsalon_lat}, ${hsalon_lng})`,
    function (error, results, fields) {
      if (error) {
        console.log(error)
      } else {
        console.log(`hairID = ${results.insertId}`)
        db.query(
          `INSERT INTO users 
      (username,password,status_id,user_name,user_lastname,user_number,user_pic,hsalon_id)
      VALUES ( '${username}','${hashedPassword}',${status_id},'${user_name}','${user_lastname}',${user_number},'${user_pic}','${results.insertId}')`,
          function (error, results, fields) {
            if (error) console.log(error)
            console.log(`userID = ${results.insertId}`)
            //return res.status(201).json({ error: false, message: 'created a user' })
          }
        )
      }

      //return res.json({ error: false, message: "Insert new hairsalon" })
    }
  )

  console.log(newid)

  if (newid != null) {
  }

  return res.status(204).end
})

//Get all customers
app.get(apiversion + '/customers', function (req, res) {
  db.query(
    'SELECT * FROM users WHERE status_id =1 ',
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'user ', data: results })
    }
  )
})
//Get all hairdressers
app.get(apiversion + '/hairdressers', function (req, res) {
  db.query(
    'SELECT * FROM users WHERE status_id =2 ',
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'user ', data: results })
    }
  )
})
//Get all owners
app.get(apiversion + '/owners', function (req, res) {
  db.query(
    'SELECT * FROM users WHERE status_id =3 ',
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'user ', data: results })
    }
  )
})

//Get user by id
app.get(apiversion + '/user/:userId', function (req, res) {
  var userId = Number(req.params.userId)

  db.query(
    'SELECT * FROM users where userId=?',
    userId.toString(),
    function (error, results, fields) {
      if (error) throw error
      return res.json({
        error: false,
        message: 'user id =' + userId.toString(),
        data: results,
      })
    }
  )
})

//Delete user by id
app.delete(apiversion + '/user/:userId', function (req, res) {
  //Code for Delete
  db.query(
    'DELETE FROM users WHERE userId = ?',
    req.params.userId,
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'user DELETE' })
    }
  )
})
//Delete hairsalon by id

//Add new user
app.post(apiversion + '/user', function (req, res) {
  var username = req.body.username
  var password = req.body.password
  var status_id = req.body.status_id
  var user_name = req.body.user_name
  var user_lastname = req.body.user_lastname
  var user_number = req.body.user_number
  var user_pic = req.body.user_pic
  var hsalon_id = req.body.hsalon_id

  db.query(
    `INSERT INTO users 
      (username,password, status_id,user_name,user_lastname,user_number,user_pic,hsalon_id) 
      VALUES ( '${username}','${password}', '${status_id}', '${user_name}', '${user_lastname}', '${user_number}', '${user_pic}', '${hsalon_id}')`,
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'Insert new user' })
    }
  )
})

//Edit user by id
app.put(apiversion + '/user/:userId', function (req, res) {
  //Code for Edit

  var username = req.body.username
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  var status_id = req.body.status_id
  var user_name = req.body.user_name
  var user_lastname = req.body.user_lastname
  var user_number = req.body.user_number
  var user_pic = req.body.user_pic
  var hsalon_id = req.body.hsalon_id
  var userId = req.body.userId

  db.query(
    'UPDATE users SET username = ?, hashedPassword = ?, status_id = ? , user_name = ? , user_lastname = ? , user_number = ? , user_pic = ?, hsalon_id = ? WHERE userId = ?',
    [
      username,
      hashedPassword,
      status_id,
      user_name,
      user_lastname,
      user_number,
      user_pic,
      hsalon_id,
      userId,
    ],
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'update user' })
    }
  )
})

//Get all hairsalons
app.get(apiversion + '/hairsalons', function (req, res) {
  db.query(
    "SELECT * FROM hair_salon WHERE status='1' ",
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'hairsalon ', data: results })
    }
  )
})

//Get all applyhairsalons
app.get(apiversion + '/Confirmhairsalons', verify, function (req, res) {
  db.query(
    "SELECT * FROM hair_salon WHERE status='0' ",
    function (error, results, fields) {
      if (error) throw error
      return res.json({
        error: false,
        message: 'Confirmhairsalon ',
        data: results,
      })
    }
  )
})

//Get hairsalon by id
app.get(apiversion + '/hairsalon/:hsalon_id', function (req, res) {
  var hsalon_id = Number(req.params.hsalon_id)

  db.query(
    'SELECT * FROM hair_salon where hsalon_id=?',
    hsalon_id.toString(),
    function (error, results, fields) {
      if (error) throw error
      return res.json({
        error: false,
        message: 'hairsalon id =' + hsalon_id.toString(),
        data: results,
      })
    }
  )
})

//Delete hairsalon by id
app.delete(apiversion + '/hairsalon/:hsalon_id', function (req, res) {
  //Code for Delete
  db.query(
    'DELETE FROM hair_salon WHERE hsalon_id = ?',
    req.params.hsalon_id,
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'Hairsalon DELETE' })
    }
  )
})
//อนุมัติร้าน
app.put(apiversion + '/Confirmhairsalon/:hsalon_id', function (req, res) {
  //Code for Edit

  var status = req.body.status
  var hsalon_id = req.params.hsalon_id

  db.query(
    'UPDATE hair_salon SET status = ? WHERE hsalon_id = ?',
    [(status = 1), hsalon_id],
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'Confirm hairsalon' })
    }
  )
})

//Add new hairsalon
app.post(apiversion + '/hairsalon', verify, function (req, res) {
  var hsalon_name = req.body.hsalon_name
  var hsalon_detail = req.body.hsalon_detail
  var hsalon_time = req.body.hsalon_time
  var hsalon_pic = req.body.hsalon_pic
  var hsalon_address = req.body.hsalon_address
  var hsalon_lat = req.body.hsalon_lat
  var hsalon_lng = req.body.hsalon_lng
  var status = 1

  db.query(
    `INSERT INTO hair_salon 
    (hsalon_name,hsalon_detail, hsalon_time, hsalon_pic, hsalon_address,hsalon_lat, hsalon_lng , status) 
    VALUES ( '${hsalon_name}','${hsalon_detail}', '${hsalon_time}', '${hsalon_pic}', '${hsalon_address}', ${hsalon_lat}, ${hsalon_lng}, ${status})`,
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'Insert new hairsalon' })
    }
  )
})

//Edit hairsalon by id
app.put(apiversion + '/hairsalon/:hsalon_id', function (req, res) {
  //Code for Edit

  var hsalon_name = req.body.hsalon_name
  var hsalon_detail = req.body.hsalon_detail
  var hsalon_time = req.body.hsalon_time
  var hsalon_pic = req.body.hsalon_pic
  var hsalon_address = req.body.hsalon_address
  var hsalon_lat = req.body.hsalon_lat
  var hsalon_lng = req.body.hsalon_lng

  var hsalon_id = req.params.hsalon_id

  db.query(
    'UPDATE hair_salon SET hsalon_name = ?, hsalon_detail = ?, hsalon_time = ?, hsalon_pic = ?, hsalon_address = ?, hsalon_lat = ?, hsalon_lng = ? WHERE hsalon_id = ?',
    [
      hsalon_name,
      hsalon_detail,
      hsalon_time,
      hsalon_pic,
      hsalon_address,
      hsalon_lat,
      hsalon_lng,
      hsalon_id,
    ],
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'update hairsalon' })
    }
  )
})

//Get all services
app.get(apiversion + '/services', function (req, res) {
  db.query('SELECT * FROM service', function (error, results, fields) {
    if (error) throw error
    return res.json({ error: false, message: 'service ', data: results })
  })
})

//Get service by id
app.get(apiversion + '/service/:service_id', function (req, res) {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )

  var service_id = Number(req.params.service_id)

  db.query(
    'SELECT * FROM service where service_id=?',
    service_id.toString(),
    function (error, results, fields) {
      if (error) throw error
      return res.json({
        error: false,
        message: 'service id =' + service_id.toString(),
        data: results,
      })
    }
  )
})

//Delete service by id
app.delete(apiversion + '/service/:service_id', function (req, res) {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  //Code for Delete
  db.query(
    'DELETE FROM service WHERE service_id = ?',
    req.params.service_id,
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'Service DELETE' })
    }
  )
})

//Add new service
app.post(apiversion + '/service', function (req, res) {
  var service_name = req.body.service_name
  var service_pic = req.body.service_pic
  var service_price = req.body.service_price
  var service_time = req.body.service_time
  var hsalon_id = req.body.hsalon_id

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )

  db.query(
    `INSERT INTO service 
    (service_name,service_pic, service_price, service_time, hsalon_id) 
    VALUES ( '${service_name}','${service_pic}', '${service_price}', '${service_time}', '${hsalon_id}')`,
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'Insert new service' })
    }
  )
})

//Edit service by id
app.put(apiversion + '/service/:service_id', function (req, res) {
  //Code for Edit

  let service_name = req.body.service_name
  let service_pic = req.body.service_pic
  let service_price = req.body.service_price
  let service_time = req.body.service_time
  let hsalon_id = req.body.hsalon_id
  let service_id = req.body.service_id

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )

  db.query(
    'UPDATE service SET service_name = ?, service_pic = ?, service_price = ?, service_time = ?, hsalon_id = ? WHERE service_id = ?',
    [
      service_name,
      service_pic,
      service_price,
      service_time,
      hsalon_id,
      service_id,
    ],
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'update service' })
    }
  )
})

//Get all notification
app.get(apiversion + '/notifications', function (req, res) {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )

  db.query(
    'SELECT * FROM notification INNER JOIN hair_salon ON notification.hsalon_id=hair_salon.hsalon_id INNER JOIN users ON notification.user_id=users.userId',
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'notification ', data: results })
    }
  )
})

//Get notification by id
app.get(apiversion + '/notification/:notification_id', function (req, res) {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )

  var notification_id = Number(req.params.notification_id)

  db.query(
    'SELECT * FROM notification where notification_id=?',
    notification_id.toString(),
    function (error, results, fields) {
      if (error) throw error
      return res.json({
        error: false,
        message: 'notification id =' + notification_id.toString(),
        data: results,
      })
    }
  )
})

//Delete notification by id
app.delete(apiversion + '/notification/:notification_id', function (req, res) {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  //Code for Delete
  db.query(
    'DELETE FROM notification WHERE notification_id = ?',
    req.params.notification_id,
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'notification DELETE' })
    }
  )
})

//Add new notification
app.post(apiversion + '/notification', function (req, res) {
  var notification_text = req.body.notification_text
  var hairdresser_id = req.body.hairdresser_id
  var hsalon_id = req.body.hsalon_id

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )

  db.query(
    `INSERT INTO notification 
    (notification_text,hairdresser_id, hsalon_id) 
    VALUES ( '${notification_text}','${hairdresser_id}', '${hsalon_id}')`,
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'Insert new notification' })
    }
  )
})

//Edit notification by id
app.put(apiversion + '/notification/:notification_id', function (req, res) {
  //Code for Edit

  var notification_text = req.body.notification_text
  var hairdresser_id = req.body.hairdresser_id
  var hsalon_id = req.body.hsalon_id
  var notification_id = req.body.notification_id

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )

  db.query(
    'UPDATE notification SET notification_text = ?, hairdresser_id = ?, hsalon_id = ?= WHERE notification_id = ?',
    [notification_text, hairdresser_id, hsalon_id, notification_id],
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'update notification' })
    }
  )
})

//Get all book
app.get(apiversion + '/books', function (req, res) {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )

  db.query(
    'SELECT * FROM booking INNER JOIN service ON booking.service_id=service.service_id INNER JOIN hair_salon ON booking.hsalon_id=hair_salon.hsalon_id INNER JOIN users ON booking.hairdresser_id=hairdresser.userId  INNER JOIN users ON booking.customer_id=customer.userId',
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'book ', data: results })
    }
  )
})

//Get hairsalon by id
app.get(apiversion + '/book/:booking_id', function (req, res) {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )

  var booking_id = Number(req.params.booking_id)

  db.query(
    'SELECT * FROM booking where booking_id=?',
    booking_id.toString(),
    function (error, results, fields) {
      if (error) throw error
      return res.json({
        error: false,
        message: 'booking id =' + booking_id.toString(),
        data: results,
      })
    }
  )
})

//Delete book by id
app.delete(apiversion + '/book/:booking_id', function (req, res) {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  //Code for Delete
  db.query(
    'DELETE FROM booking WHERE booking_id = ?',
    req.params.booking_id,
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'Booking DELETE' })
    }
  )
})

//Add new book
app.post(apiversion + '/book', function (req, res) {
  var booking_day = req.body.booking_day
  var booking_time = req.body.booking_time
  var booking_dayuse = req.body.booking_dayuse
  var booking_timeuse = req.body.booking_timeuse
  var booking_status = req.body.booking_status
  var booking_point = req.body.booking_point
  var service_id = req.body.service_id
  var hsalon_id = req.body.hsalon_id
  var hairdresser_id = req.body.hairdresser_id
  var customer_id = req.body.customer_id

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )

  db.query(
    `INSERT INTO booking 
    (booking_day,booking_time, booking_dayuse, booking_timeuse, booking_status, booking_point, 
      service_id, hsalon_id,hairdresser_id,customer_id) 
    VALUES ( '${booking_day}','${booking_time}', '${booking_dayuse}', '${booking_timeuse}', '${booking_status}', '${booking_point}', 
     '${service_id}', '${hsalon_id}', '${hairdresser_id}', '${customer_id}')`,
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'Insert new book' })
    }
  )
})

//Edit book by id
app.put(apiversion + '/book/:booking_id', function (req, res) {
  //Code for Edit

  var booking_day = req.body.booking_day
  var booking_time = req.body.booking_time
  var booking_dayuse = req.body.booking_dayuse
  var booking_timeuse = req.body.booking_timeuse
  var booking_status = req.body.booking_status
  var booking_point = req.body.booking_point
  var service_id = req.body.service_id
  var hsalon_id = req.body.hsalon_id
  var hairdresser_id = req.body.hairdresser_id
  var customer_id = req.body.customer_id

  var booking_id = req.params.booking_id

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )

  db.query(
    'UPDATE booking SET booking_day = ?, booking_time = ?, booking_dayuse = ?, booking_timeuse = ?, booking_status = ?, booking_point = ?, service_id = ? , hsalon_id = ?, hairdresser_id = ?, customer_id = ? WHERE booking_id = ?',
    [
      booking_day,
      booking_time,
      booking_dayuse,
      booking_timeuse,
      booking_status,
      booking_point,
      service_id,
      hsalon_id,
      hairdresser_id,
      customer_id,
      booking_id,
    ],
    function (error, results, fields) {
      if (error) throw error
      return res.json({ error: false, message: 'update hairsalon' })
    }
  )
})

app.listen(port, function () {
  console.log('Server is up and running...')
})
