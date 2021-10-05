var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var fileUpload = require('express-fileupload');
var picturepath='C:/Users/ZAZAZAZAZAZAZA/Downloads/BB/src/assets/salonspicture/';

var apiversion='/api/v1';

const dotenv = require('dotenv');
dotenv.config();

const secretkey=process.env.SECRET;

//MYSQL Connection
var db = require('./config/db.config');

const bcrypt = require('bcryptjs');
const {sign,verify} = require('./middleware.js');


var port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(fileUpload())
app.post(apiversion + '/upload',verify, (req, res) => {
  
  if (!req.files) {
      return res.status(500).send({ msg: "file is not found" })
  }

  const myFile = req.files.file;
  
  myFile.mv(`${picturepath}${myFile.name}`, function (err) {
    
      if (err) {
          console.log(err)
          return res.status(500).send({ msg: "Error occured" });
      }
      
      return res.send({name: myFile.name, path: `/${myFile.name}`});

  });

});

app.post(apiversion + '/auth/registercus', async (req,res) =>{
  // res.setHeader('Content-Type', 'application/json');

  var username = req.body.username;
  const hashedPassword = bcrypt.hashSync(req.body.password,10);
  var status_id = req.body.status_id;
  var customer_name = req.body.customer_name;
  var customer_lname = req.body.customer_lname;
  var customer_number = req.body.customer_number;
  var user_id = req.body.user_id;
 
  await db.query(`INSERT INTO users 
      (username,password,status_id)
      VALUES ( '${username}','${hashedPassword}','${status_id}');`,function (error,results,fields){
        if (error)
        {console.log(error);}
        
        //return res.status(201).send({ error: false, message: 'created a user' })
      }
    );
    
      db.query(
        `INSERT INTO customer 
        (customer_name,customer_lname, customer_number, ) 
        VALUES ( '${customer_name}','${customer_lname}', '${customer_number}');`,
        function (error, results, fields) {
          if (error)
        {console.log(error);}
        
          //return res.send({ error: false, message: "Insert new owner" });
        }
      
    );    
     
     
  

});
//Edit profile by id
app.put(apiversion + "/profile/:user_id", function (req, res) {
  //Code for Edit
    
    let username = req.body.service_name;
    const hashedPassword = bcrypt.hashSync(req.body.password,10);
    let user_id = req.body.user_id;

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    "UPDATE users SET  username = ?, hashedPassword = ? WHERE user_id = ?",
    [
      
      username,
      hashedPassword,
      user_id,
    ],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "update proifile" });
    }
  );
  
});

app.post(apiversion + '/auth/register', async (req,res) =>{
  // res.setHeader('Content-Type', 'application/json');

  var username = req.body.username;
  const hashedPassword = bcrypt.hashSync(req.body.password,10);
  var status_id = req.body.status_id;
  var hsalon_name = req.body.hsalon_name;
  var hsalon_detail = req.body.hsalon_detail;
  var hsalon_time = req.body.hsalon_time;
  var hsalon_pic = req.body.hsalon_pic;
  var hsalon_address = req.body.hsalon_address;
  var hsalon_lat = req.body.hsalon_lat;
  var hsalon_lng = req.body.hsalon_lng;
  var owner_name = req.body.owner_name;
  var owner_lname = req.body.owner_lname;
  var owner_number = req.body.owner_number;
  var owner_pic = req.body.owner_pic;
   var hsalon_id = req.body.hsalon_id;
   var user_id = req.body.user_id;
 
  await db.query(`INSERT INTO users 
      (username,password,status_id)
      VALUES ( '${username}','${hashedPassword}','${status_id}');`,function (error,results,fields){
        if (error)
        {console.log(error);}
        
        //return res.status(201).send({ error: false, message: 'created a user' })
      }
    );   
      db.query(
        `INSERT INTO owner 
        (owner_name,owner_lname, owner_number, owner_pic) 
        VALUES ( '${owner_name}','${owner_lname}', '${owner_number}', '${owner_pic}');`,
        function (error, results, fields) {
          if (error)
        {console.log(error);}
        
          //return res.send({ error: false, message: "Insert new owner" });
        }
      
    );    
     
     
  await db.query(
        `INSERT INTO hair_salon 
        (hsalon_name,hsalon_detail, hsalon_time, hsalon_pic, hsalon_address,hsalon_lat, hsalon_lng) 
        VALUES ( '${hsalon_name}','${hsalon_detail}', '${hsalon_time}', '${hsalon_pic}', '${hsalon_address}', ${hsalon_lat}, ${hsalon_lng});`,
        function (error, results, fields) {
          if (error) 
        {console.log(error);}
          //return res.send({ error: false, message: "Insert new hairsalon" });
        }
      );    
      
      return res.status(204).end;

});

app.post(apiversion + '/auth/signin', (req, res) => {

  db.query('SELECT * FROM users ',req.body.username, function (error, results, fields) {
    try
    {
      if (error) {
        throw error;
      }else{
        let hashedPassword=results[0].password
        let userId=results[0].userId
        const correct =bcrypt.compareSync(req.body.password, hashedPassword)

        if (correct)
        {
          let user={
            username: req.body.username,

            password: hashedPassword,
          }
          // create a token
          let token = sign(user, secretkey);
          
          res.setHeader('Content-Type', 'application/json');
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

          return res.status(201).send({ error: false, message: 'user sigin', userId: userId, accessToken: token });
        }else {
          return res.status(401).send("login fail")
        }
      }
    }
    catch(e)
    {
      return res.status(401).send("login fail")
    }
  });
});

 
//Get all hairsalons
app.get(apiversion + "/hairsalons", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query("SELECT * FROM hair_salon WHERE status='1' ", function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "hairsalon ", data: results });
  });
});

//Get all applyhairsalons
app.get(apiversion + "/Confirmhairsalons",verify, function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query("SELECT * FROM hair_salon WHERE status='0' ", function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "Confirmhairsalon ", data: results });
  });
});




//Get hairsalon by id
app.get(apiversion + "/hairsalon/:hsalon_id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  var hsalon_id = Number(req.params.hsalon_id);

  db.query("SELECT * FROM hair_salon where hsalon_id=?", hsalon_id.toString(), function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    return res.send({
      error: false,
      message: "hairsalon id =" + hsalon_id.toString(),
      data: results,
    });
  });
});

//Delete hairsalon by id
app.delete(apiversion + "/hairsalon/:hsalon_id", function (req, res) {

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  //Code for Delete
  db.query('DELETE FROM hair_salon WHERE hsalon_id = ?',req.params.hsalon_id,
  function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "Hairsalon DELETE" });
  });
});
//Edit hairsalon by id
app.put(apiversion + "/Confirmhairsalon/:hsalon_id", function (req, res) {
  //Code for Edit
 
  var status = req.body.status;
  var hsalon_id = req.params.hsalon_id;

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    "UPDATE hair_salon SET status = ? WHERE hsalon_id = ?",
    [
      
    
      status = 1 ,
      hsalon_id,
    ],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "Confirm hairsalon" });
    }
  );
  
});

//Add new hairsalon
app.post(apiversion + "/hairsalon",verify, function (req, res) {
  var hsalon_name = req.body.hsalon_name;
  var hsalon_detail = req.body.hsalon_detail;
  var hsalon_time = req.body.hsalon_time;
  var hsalon_pic = req.body.hsalon_pic;
  var hsalon_address = req.body.hsalon_address;
  var hsalon_lat = req.body.hsalon_lat;
  var hsalon_lng = req.body.hsalon_lng;
  var status = 1;

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    `INSERT INTO hair_salon 
    (hsalon_name,hsalon_detail, hsalon_time, hsalon_pic, hsalon_address,hsalon_lat, hsalon_lng , status) 
    VALUES ( '${hsalon_name}','${hsalon_detail}', '${hsalon_time}', '${hsalon_pic}', '${hsalon_address}', ${hsalon_lat}, ${hsalon_lng}, ${status});`,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "Insert new hairsalon" });
    }
  );
});

//Edit hairsalon by id
app.put(apiversion + "/hairsalon/:hsalon_id", function (req, res) {
  //Code for Edit
 
  var hsalon_name = req.body.hsalon_name;
  var hsalon_detail = req.body.hsalon_detail;
  var hsalon_time = req.body.hsalon_time;
  var hsalon_pic = req.body.hsalon_pic;
  var hsalon_address = req.body.hsalon_address;
  var hsalon_lat = req.body.hsalon_lat;
  var hsalon_lng = req.body.hsalon_lng;
  
  var hsalon_id = req.params.hsalon_id;

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    "UPDATE hair_salon SET hsalon_name = ?, hsalon_detail = ?, hsalon_time = ?, hsalon_pic = ?, hsalon_address = ?, hsalon_lat = ?, hsalon_lng = ? WHERE hsalon_id = ?",
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
      if (error) throw error;
      return res.send({ error: false, message: "update hairsalon" });
    }
  );
  
});

//Get all services
app.get(apiversion + "/services", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query("SELECT * FROM service", function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "service ", data: results });
  });
});



//Get service by id
app.get(apiversion + "/service/:service_id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  var service_id = Number(req.params.service_id);

  db.query("SELECT * FROM service where service_id=?", service_id.toString(), function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    return res.send({
      error: false,
      message: "service id =" + service_id.toString(),
      data: results,
    });
  });
});

//Delete service by id
app.delete(apiversion + "/service/:service_id", function (req, res) {

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  //Code for Delete
  db.query('DELETE FROM service WHERE service_id = ?',req.params.service_id,
  function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "Service DELETE" });
  });
});

//Add new service
app.post(apiversion + "/service", function (req, res) {
    var service_name = req.body.service_name;
    var service_pic = req.body.service_pic;
    var service_price = req.body.service_price;
    var service_time = req.body.service_time;
    var hsalon_id = req.body.hsalon_id;

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    `INSERT INTO service 
    (service_name,service_pic, service_price, service_time, hsalon_id) 
    VALUES ( '${service_name}','${service_pic}', '${service_price}', '${service_time}', '${hsalon_id}');`,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "Insert new service" });
    }
  );
});

//Edit service by id
app.put(apiversion + "/service/:service_id", function (req, res) {
  //Code for Edit
    
    let service_name = req.body.service_name;
    let service_pic = req.body.service_pic;
    let service_price = req.body.service_price;
    let service_time = req.body.service_time;
    let hsalon_id = req.body.hsalon_id;
    let service_id = req.body.service_id;

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    "UPDATE service SET service_name = ?, service_pic = ?, service_price = ?, service_time = ?, hsalon_id = ? WHERE service_id = ?",
    [
      
      service_name,
      service_pic,
      service_price,
      service_time,
      hsalon_id,
      service_id,
    ],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "update service" });
    }
  );
  
});

//Get all owner
app.get(apiversion + "/owners", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query("SELECT * FROM owner INNER JOIN hair_salon ON owner.hsalon_id=hair_salon.hsalon_id;", function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "owner ", data: results });
  });
});



//Get owner by id
app.get(apiversion + "/owner/:owner_id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  var owner_id = Number(req.params.owner_id);

  db.query("SELECT * FROM owner where owner_id=?", owner_id.toString(), function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    return res.send({
      error: false,
      message: "owner id =" + owner_id.toString(),
      data: results,
    });
  });
});

//Delete owner by id
app.delete(apiversion + "/owner/:owner_id", function (req, res) {

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  //Code for Delete
  db.query('DELETE FROM owner WHERE owner_id = ?',req.params.owner_id,
  function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "owner DELETE" });
  });
});

//Add new service
app.post(apiversion + "/owner", function (req, res) {
    var owner_name = req.body.owner_name;
    var owner_lname = req.body.owner_pic;
    var owner_number = req.body.owner_number;
    var owner_pic = req.body.owner_time;
    var hsalon_id = req.body.hsalon_id;
    var user_id = req.body.user_id;

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    `INSERT INTO owner 
    (owner_name,owner_lname, owner_number, owner_pic, hsalon_id , user_id) 
    VALUES ( '${owner_name}','${owner_lname}', '${owner_number}', '${owner_pic}', '${hsalon_id}', '${user_id}');`,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "Insert new owner" });
    }
  );
});

//Edit owner by id
app.put(apiversion + "/owner/:owner_id", function (req, res) {
  //Code for Edit
    
  var owner_name = req.body.owner_name;
  var owner_lname = req.body.owner_lname;
  var owner_number = req.body.owner_number;
  var owner_pic = req.body.owner_pic;
  var hsalon_id = req.body.hsalon_id;
  var user_id = req.body.user_id;
    var owner_id = req.body.owner_id;

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    "UPDATE owner SET owner_name = ?, owner_lname = ?, owner_number = ?, owner_pic = ?, hsalon_id = ? ,user_id=? WHERE owner_id = ?",
    [
      
      owner_name,
      owner_lname,
      owner_number,
      owner_pic,
      hsalon_id,
      user_id,
      owner_id,
    ],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "update owner" });
    }
  );
  
});


//Get all hairdresser
app.get(apiversion + "/hairdressers",verify, function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query("SELECT * FROM hairdresser INNER JOIN hair_salon ON hairdresser.hsalon_id=hair_salon.hsalon_id;", function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "hairdresser ", data: results });
  });
});



//Get hairdresser by id
app.get(apiversion + "/hairdresser/:hairdresser_id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  var hairdresser_id = Number(req.params.hairdresser_id);

  db.query("SELECT * FROM hairdresser where hairdresser_id=?", hairdresser_id.toString(), function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    return res.send({
      error: false,
      message: "hairdresser id =" + hairdresser_id.toString(),
      data: results,
    });
  });
});

//Delete hairdresser by id
app.delete(apiversion + "/hairdresser/:hairdresser_id", function (req, res) {

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  //Code for Delete
  db.query('DELETE FROM hairdresser WHERE hairdresser_id = ?',req.params.hairdresser_id,
  function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "hairdresser DELETE" });
  });
});

//Add new hairdresser
app.post(apiversion + "/hairdresser", function (req, res) {
    var hairdresser_name = req.body.hairdresser_name;
    var hairdresser_lname = req.body.hairdresser_lname;
    var hairdresser_number = req.body.hairdresser_number;
    var hairdresser_pic = req.body.hairdresser_pic;
    var user_id = req.body.user_id;
    var hsalon_id = req.body.hsalon_id;
    
    

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    `INSERT INTO hairdresser 
    (hairdresser_name,hairdresser_lname, hairdresser_number, hairdresser_pic,user_id, hsalon_id) 
    VALUES ( '${hairdresser_name}','${hairdresser_lname}', '${hairdresser_number}', '${hairdresser_pic}', '${user_id}', '${hsalon_id}');`,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "Insert new hairdresser" });
    }
  );
});

//Edit hairdresser by id
app.put(apiversion + "/hairdresser/:hairdresser_id", function (req, res) {
  //Code for Edit
    
  var hairdresser_name = req.body.hairdresser_name;
  var hairdresser_lname = req.body.hairdresser_lname;
  var hairdresser_number = req.body.hairdresser_number;
  var hairdresser_pic = req.body.hairdresser_pic;
  var user_id = req.body.user_id;
  var hsalon_id = req.body.hsalon_id;
  var hairdresser_id = req.body.hairdresser_id;

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    "UPDATE hairdresser SET hairdresser_name = ?, hairdresser_lname = ?, hairdresser_number = ?, hairdresser_pic = ?, hsalon_id = ?,user_id=? WHERE hairdresser_id = ?",
    [
      
      hairdresser_name,
      hairdresser_lname,
      hairdresser_number,
      hairdresser_pic,
      hsalon_id,
      user_id,
      hairdresser_id,
    ],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "update hairdresser" });
    }
  );
  
});


//Get all customer
app.get(apiversion + "/customers", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query("SELECT * FROM customer", function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "customer ", data: results });
  });
});



//Get customer by id
app.get(apiversion + "/customer/:customer_id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  var customer_id = Number(req.params.customer_id);

  db.query("SELECT * FROM customer where customer_id=?", customer_id.toString(), function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    return res.send({
      error: false,
      message: "customer id =" + customer_id.toString(),
      data: results,
    });
  });
});

//Delete customer by id
app.delete(apiversion + "/customer/:customer_id", function (req, res) {

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  //Code for Delete
  db.query('DELETE FROM customer WHERE customer_id = ?',req.params.customer_id,
  function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "customer DELETE" });
  });
});

//Add new customer
app.post(apiversion + "/customer", function (req, res) {
    var customer_name = req.body.customer_name;
    var customer_lname = req.body.customer_lname;
    var customer_number = req.body.customer_number;
    var customer_pic = req.body.customer_pic;
    var user_id = req.body.user_id;
   
    
    

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    `INSERT INTO customer 
    (customer_name,customer_lname, customer_number, customer_pic,user_id) 
    VALUES ( '${customer_name}','${customer_lname}', ${customer_number}, '${customer_pic}', ${user_id});`,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "Insert new customer" });
    }
  );
});

//Edit customer by id
app.put(apiversion + "/customer/:customer_id", function (req, res) {
  //Code for Edit
    
  var customer_name = req.body.customer_name;
  var customer_lname = req.body.customer_lname;
  var customer_number = req.body.customer_number;
  var customer_pic = req.body.customer_pic;
  var user_id = req.body.user_id;
  var customer_id = req.body.customer_id;

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    "UPDATE customer SET customer_name = ?, customer_lname = ?, customer_number = ?, customer_pic = ?,user_id=? WHERE customer_id = ?",
    [
      
      customer_name,
      customer_lname,
      customer_number,
      customer_pic,
      user_id,
      customer_id,
    ],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "update customer" });
    }
  );
  
});

//Get all user
app.get(apiversion + "/users", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query("SELECT * FROM user", function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "user ", data: results });
  });
});



//Get user by id
app.get(apiversion + "/user/:user_id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  var user_id = Number(req.params.user_id);

  db.query("SELECT * FROM user where user_id=?", user_id.toString(), function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    return res.send({
      error: false,
      message: "user id =" + user_id.toString(),
      data: results,
    });
  });
});

//Delete user by id
app.delete(apiversion + "/user/:user_id", function (req, res) {

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  //Code for Delete
  db.query('DELETE FROM user WHERE user_id = ?',req.params.user_id,
  function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "user DELETE" });
  });
});

//Add new user
app.post(apiversion + "/user", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var status_id = req.body.status_id;
    
    

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    `INSERT INTO user 
    (username,password, status_id) 
    VALUES ( '${username}','${password}', '${status_id}');`,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "Insert new user" });
    }
  );
});

//Edit user by id
app.put(apiversion + "/user/:user_id", function (req, res) {
  //Code for Edit
    
  var username = req.body.username;
  var password = req.body.password;
  var status_id = req.body.status_id;
  var user_id = req.body.user_id;

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    "UPDATE user SET username = ?, password = ?, status_id = ?= WHERE user_id = ?",
    [
      
      username,
      password,
      status_id,
      user_id,

    ],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "update user" });
    }
  );
  
});

//Get all notification
app.get(apiversion + "/notifications", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query("SELECT * FROM notification INNER JOIN hair_salon ON notification.hsalon_id=hair_salon.hsalon_id INNER JOIN customer ON notification.customer_id=customer.customer_id", function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "notification ", data: results });
  });
});



//Get notification by id
app.get(apiversion + "/notification/:notification_id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  var notification_id = Number(req.params.notification_id);

  db.query("SELECT * FROM notification where notification_id=?", notification_id.toString(), function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    return res.send({
      error: false,
      message: "notification id =" + notification_id.toString(),
      data: results,
    });
  });
});

//Delete notification by id
app.delete(apiversion + "/notification/:notification_id", function (req, res) {

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  //Code for Delete
  db.query('DELETE FROM notification WHERE notification_id = ?',req.params.notification_id,
  function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "notification DELETE" });
  });
});

//Add new notification
app.post(apiversion + "/notification", function (req, res) {
  var notification_text = req.body.notification_text;
  var hairdresser_id = req.body.hairdresser_id;
  var hsalon_id = req.body.hsalon_id;
    
    

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    `INSERT INTO notification 
    (notification_text,hairdresser_id, hsalon_id) 
    VALUES ( '${notification_text}','${hairdresser_id}', '${hsalon_id}');`,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "Insert new notification" });
    }
  );
});

//Edit notification by id
app.put(apiversion + "/notification/:notification_id", function (req, res) {
  //Code for Edit
    
  var notification_text = req.body.notification_text;
  var hairdresser_id = req.body.hairdresser_id;
  var hsalon_id = req.body.hsalon_id;
  var notification_id = req.body.notification_id;

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    "UPDATE notification SET notification_text = ?, hairdresser_id = ?, hsalon_id = ?= WHERE notification_id = ?",
    [
      
      notification_text,
      hairdresser_id,
      hsalon_id,
      notification_id,

    ],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "update notification" });
    }
  );
  
});

//Get all book
app.get(apiversion + "/books", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query("SELECT * FROM booking INNER JOIN service ON booking.service_id=service.service_id INNER JOIN hair_salon ON booking.hsalon_id=hair_salon.hsalon_id INNER JOIN hairdresser ON booking.hairdresser_id=hairdresser.hairdresser_id INNER JOIN customer ON booking.customer_id=customer.customer_id", function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "book ", data: results });
  });
});



//Get hairsalon by id
app.get(apiversion + "/book/:booking_id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  var booking_id = Number(req.params.booking_id);

  db.query("SELECT * FROM booking where booking_id=?", booking_id.toString(), function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    return res.send({
      error: false,
      message: "booking id =" + booking_id.toString(),
      data: results,
    });
  });
});

//Delete book by id
app.delete(apiversion + "/book/:booking_id", function (req, res) {

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  //Code for Delete
  db.query('DELETE FROM booking WHERE booking_id = ?',req.params.booking_id,
  function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, message: "Booking DELETE" });
  });
});

//Add new book
app.post(apiversion + "/book", function (req, res) {
    var booking_day = req.body.booking_day;
    var booking_time = req.body.booking_time;
    var booking_dayuse = req.body.booking_dayuse;
    var booking_timeuse = req.body.booking_timeuse;
    var booking_status = req.body.booking_status;
    var booking_point = req.body.booking_point;
    var service_id = req.body.service_id;
    var hsalon_id = req.body.hsalon_id;
    var hairdresser_id = req.body.hairdresser_id;
    var customer_id = req.body.customer_id;

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    `INSERT INTO booking 
    (booking_day,booking_time, booking_dayuse, booking_timeuse, booking_status, booking_point, 
      service_id, hsalon_id,hairdresser_id,customer_id) 
    VALUES ( '${booking_day}','${booking_time}', '${booking_dayuse}', '${booking_timeuse}', '${booking_status}', '${booking_point}', 
     '${service_id}', '${hsalon_id}', '${hairdresser_id}', '${customer_id}');`,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: "Insert new book" });
    }
  );
});

//Edit book by id
app.put(apiversion + "/book/:booking_id", function (req, res) {
  //Code for Edit
 
    var booking_day = req.body.booking_day;
    var booking_time = req.body.booking_time;
    var booking_dayuse = req.body.booking_dayuse;
    var booking_timeuse = req.body.booking_timeuse;
    var booking_status = req.body.booking_status;
    var booking_point = req.body.booking_point;
    var service_id = req.body.service_id;
    var hsalon_id = req.body.hsalon_id;
    var hairdresser_id = req.body.hairdresser_id;
    var customer_id = req.body.customer_id;
  
  var booking_id = req.params.booking_id;

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  db.query(
    "UPDATE booking SET booking_day = ?, booking_time = ?, booking_dayuse = ?, booking_timeuse = ?, booking_status = ?, booking_point = ?, service_id = ? , hsalon_id = ?, hairdresser_id = ?, customer_id = ? WHERE booking_id = ?",
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
      if (error) throw error;
      return res.send({ error: false, message: "update hairsalon" });
    }
  );
  
});




app.listen(port, function () {
    console.log("Server is up and running...");
});
