require('dotenv').config()

const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const bcrypt = require('bcryptjs')

const { sign, verify } = require('./middleware.js')
const db = require('./config/db.config')

const picturepath =
  'C:/Users/ZAZAZAZAZAZAZA/Downloads/BB/src/assets/salonspicture/'
const apiversion = '/api/v1'
const secretkey = process.env.SECRET
const port = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(cors())
app.use(fileUpload())

app.post(apiversion + '/upload', verify, async (req, res) => {
  if (!req.files) {
    return res.status(500).json({ msg: 'file is not found' })
  }

  const myFile = req.files.file

  myFile.mv(`${picturepath}${myFile.name}`, async (err) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ msg: 'Error occured' })
    }

    return res.json({ name: myFile.name, path: `/${myFile.name}` })
  })
})

app.post(apiversion + '/auth/signin', async (req, res) => {
  db.query(
    'SELECT * FROM users',
    req.body.username,
    (error, results, fields) => {
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

            const token = sign(user, secretkey)

            return res.status(201).json({
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
  const {
    username,
    hsalon_name,
    hsalon_detail,
    hsalon_time,
    hsalon_pic,
    hsalon_address,
    hsalon_lat,
    hsalon_lng,
    status_id,
    user_name,
    user_lastname,
    user_number,
    user_pic,
    password,
  } = req.body

  const hashedPassword = bcrypt.hashSync(password, 10)

  await db.query(
    `INSERT INTO hair_salon 
    (hsalon_name,hsalon_detail, hsalon_time, hsalon_pic, hsalon_address,hsalon_lat, hsalon_lng) 
    VALUES ( '${hsalon_name}','${hsalon_detail}', '${hsalon_time}', '${hsalon_pic}', '${hsalon_address}', ${hsalon_lat}, ${hsalon_lng})`,
    (error, results, fields) => {
      if (error) {
        console.log(error)
      } else {
        db.query(
          `INSERT INTO users 
      (username,password,status_id,user_name,user_lastname,user_number,user_pic,hsalon_id)
      VALUES ( '${username}','${hashedPassword}',${status_id},'${user_name}','${user_lastname}',${user_number},'${user_pic}','${results.insertId}')`,
          (error, results, fields) => {
            if (error) console.log(error)
          }
        )
      }
    }
  )

  return res.status(204).end
})

app.get(apiversion + '/customers', async (req, res) => {
  db.query(
    'SELECT * FROM users WHERE status_id =1 ',
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'user ', data: results })
    }
  )
})

app.get(apiversion + '/hairdressers', async (req, res) => {
  db.query(
    'SELECT * FROM users WHERE status_id =2 ',
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'user ', data: results })
    }
  )
})

app.get(apiversion + '/owners', async (req, res) => {
  db.query(
    'SELECT * FROM users WHERE status_id =3 ',
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'user ', data: results })
    }
  )
})

app.get(apiversion + '/user/:userId', async (req, res) => {
  const userId = Number(req.params.userId)

  db.query(
    'SELECT * FROM users where userId=?',
    userId.toString(),
    (error, results, fields) => {
      if (error) throw error
      return res.json({
        error: false,
        message: 'user id =' + userId.toString(),
        data: results,
      })
    }
  )
})

app.delete(apiversion + '/user/:userId', async (req, res) => {
  db.query(
    'DELETE FROM users WHERE userId = ?',
    req.params.userId,
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'user DELETE' })
    }
  )
})

app.post(apiversion + '/user', async (req, res) => {
  const {
    username,
    password,
    status_id,
    user_name,
    user_lastname,
    user_number,
    user_pic,
    hsalon_id,
  } = req.body

  db.query(
    `INSERT INTO users 
      (username,password, status_id,user_name,user_lastname,user_number,user_pic,hsalon_id) 
      VALUES ( '${username}','${password}', '${status_id}', '${user_name}', '${user_lastname}', '${user_number}', '${user_pic}', '${hsalon_id}')`,
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'Insert new user' })
    }
  )
})

app.put(apiversion + '/user/:userId', async (req, res) => {
  const {
    username,
    password,
    status_id,
    user_name,
    user_lastname,
    user_number,
    user_pic,
    hsalon_id,
  } = req.body

  const hashedPassword = bcrypt.hashSync(password, 10)

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
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'update user' })
    }
  )
})

app.get(apiversion + '/hairsalons', async (req, res) => {
  db.query(
    "SELECT * FROM hair_salon WHERE status='1' ",
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'hairsalon ', data: results })
    }
  )
})

app.get(apiversion + '/Confirmhairsalons', verify, async (req, res) => {
  db.query(
    "SELECT * FROM hair_salon WHERE status='0' ",
    (error, results, fields) => {
      if (error) throw error
      return res.json({
        error: false,
        message: 'Confirmhairsalon ',
        data: results,
      })
    }
  )
})

app.get(apiversion + '/hairsalon/:hsalon_id', async (req, res) => {
  const hsalon_id = Number(req.params.hsalon_id)

  db.query(
    'SELECT * FROM hair_salon where hsalon_id=?',
    hsalon_id.toString(),
    (error, results, fields) => {
      if (error) throw error
      return res.json({
        error: false,
        message: 'hairsalon id =' + hsalon_id.toString(),
        data: results,
      })
    }
  )
})

app.delete(apiversion + '/hairsalon/:hsalon_id', async (req, res) => {
  db.query(
    'DELETE FROM hair_salon WHERE hsalon_id = ?',
    req.params.hsalon_id,
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'Hairsalon DELETE' })
    }
  )
})

app.put(apiversion + '/Confirmhairsalon/:hsalon_id', async (req, res) => {
  const hsalon_id = req.params.hsalon_id

  db.query(
    'UPDATE hair_salon SET status = ? WHERE hsalon_id = ?',
    [(status = 1), hsalon_id],
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'Confirm hairsalon' })
    }
  )
})

app.post(apiversion + '/hairsalon', verify, async (req, res) => {
  const {
    hsalon_name,
    hsalon_detail,
    hsalon_time,
    hsalon_pic,
    hsalon_address,
    hsalon_lat,
    hsalon_lng,
  } = req.body

  const status = 1

  db.query(
    `INSERT INTO hair_salon 
    (hsalon_name,hsalon_detail, hsalon_time, hsalon_pic, hsalon_address,hsalon_lat, hsalon_lng , status) 
    VALUES ( '${hsalon_name}','${hsalon_detail}', '${hsalon_time}', '${hsalon_pic}', '${hsalon_address}', ${hsalon_lat}, ${hsalon_lng}, ${status})`,
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'Insert new hairsalon' })
    }
  )
})

app.put(apiversion + '/hairsalon/:hsalon_id', async (req, res) => {
  const {
    hsalon_name,
    hsalon_detail,
    hsalon_time,
    hsalon_pic,
    hsalon_address,
    hsalon_lat,
    hsalon_lng,
  } = req.body

  const hsalon_id = req.params.hsalon_id

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
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'update hairsalon' })
    }
  )
})

app.get(apiversion + '/services', async (req, res) => {
  db.query('SELECT * FROM service', (error, results, fields) => {
    if (error) throw error
    return res.json({ error: false, message: 'service ', data: results })
  })
})

app.get(apiversion + '/service/:service_id', async (req, res) => {
  const service_id = Number(req.params.service_id)

  db.query(
    'SELECT * FROM service where service_id=?',
    service_id.toString(),
    (error, results, fields) => {
      if (error) throw error
      return res.json({
        error: false,
        message: 'service id =' + service_id.toString(),
        data: results,
      })
    }
  )
})

app.delete(apiversion + '/service/:service_id', async (req, res) => {
  db.query(
    'DELETE FROM service WHERE service_id = ?',
    req.params.service_id,
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'Service DELETE' })
    }
  )
})

app.post(apiversion + '/service', async (req, res) => {
  const { service_name, service_pic, service_price, service_time, hsalon_id } =
    req.body

  db.query(
    `INSERT INTO service 
    (service_name,service_pic, service_price, service_time, hsalon_id) 
    VALUES ( '${service_name}','${service_pic}', '${service_price}', '${service_time}', '${hsalon_id}')`,
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'Insert new service' })
    }
  )
})

app.put(apiversion + '/service/:service_id', async (req, res) => {
  const {
    service_name,
    service_pic,
    service_price,
    service_time,
    service_id,
    hsalon_id,
  } = req.body

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
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'update service' })
    }
  )
})

app.get(apiversion + '/notifications', async (req, res) => {
  db.query(
    'SELECT * FROM notification INNER JOIN hair_salon ON notification.hsalon_id=hair_salon.hsalon_id INNER JOIN users ON notification.user_id=users.userId',
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'notification ', data: results })
    }
  )
})

app.get(apiversion + '/notification/:notification_id', async (req, res) => {
  const notification_id = Number(req.params.notification_id)

  db.query(
    'SELECT * FROM notification where notification_id=?',
    notification_id.toString(),
    (error, results, fields) => {
      if (error) throw error
      return res.json({
        error: false,
        message: 'notification id =' + notification_id.toString(),
        data: results,
      })
    }
  )
})

app.delete(apiversion + '/notification/:notification_id', async (req, res) => {
  db.query(
    'DELETE FROM notification WHERE notification_id = ?',
    req.params.notification_id,
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'notification DELETE' })
    }
  )
})

app.post(apiversion + '/notification', async (req, res) => {
  const { notification_text, hairdresser_id, hsalon_id } = req.body

  db.query(
    `INSERT INTO notification 
    (notification_text,hairdresser_id, hsalon_id) 
    VALUES ( '${notification_text}','${hairdresser_id}', '${hsalon_id}')`,
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'Insert new notification' })
    }
  )
})

app.put(apiversion + '/notification/:notification_id', async (req, res) => {
  const { notification_text, hairdresser_id, hsalon_id, notification_id } =
    req.body

  db.query(
    'UPDATE notification SET notification_text = ?, hairdresser_id = ?, hsalon_id = ?= WHERE notification_id = ?',
    [notification_text, hairdresser_id, hsalon_id, notification_id],
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'update notification' })
    }
  )
})

app.get(apiversion + '/books', async (req, res) => {
  db.query(
    'SELECT * FROM booking INNER JOIN service ON booking.service_id=service.service_id INNER JOIN hair_salon ON booking.hsalon_id=hair_salon.hsalon_id INNER JOIN users ON booking.hairdresser_id=hairdresser.userId  INNER JOIN users ON booking.customer_id=customer.userId',
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'book ', data: results })
    }
  )
})

app.get(apiversion + '/book/:booking_id', async (req, res) => {
  const booking_id = Number(req.params.booking_id)

  db.query(
    'SELECT * FROM booking where booking_id=?',
    booking_id.toString(),
    (error, results, fields) => {
      if (error) throw error
      return res.json({
        error: false,
        message: 'booking id =' + booking_id.toString(),
        data: results,
      })
    }
  )
})

app.delete(apiversion + '/book/:booking_id', async (req, res) => {
  db.query(
    'DELETE FROM booking WHERE booking_id = ?',
    req.params.booking_id,
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'Booking DELETE' })
    }
  )
})

app.post(apiversion + '/book', async (req, res) => {
  const {
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
  } = req.body

  db.query(
    `INSERT INTO booking 
    (booking_day,booking_time, booking_dayuse, booking_timeuse, booking_status, booking_point, 
      service_id, hsalon_id,hairdresser_id,customer_id) 
    VALUES ( '${booking_day}','${booking_time}', '${booking_dayuse}', '${booking_timeuse}', '${booking_status}', '${booking_point}', 
     '${service_id}', '${hsalon_id}', '${hairdresser_id}', '${customer_id}')`,
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'Insert new book' })
    }
  )
})

app.put(apiversion + '/book/:booking_id', async (req, res) => {
  const {
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
  } = req.body

  const booking_id = req.params.booking_id

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
    (error, results, fields) => {
      if (error) throw error
      return res.json({ error: false, message: 'update hairsalon' })
    }
  )
})

app.listen(port, () => {
  console.log('Server is up and running...')
})
