//import external modules
const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

//create connection to db using variables from .env file
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

exports.register = (req, res) => {
  
  //grabs all data that is sent from the form
  console.log(req.body);
  //form values
  const { name, email, password, passwordConfirm } = req.body;

  //mysql select query used to select the email from the user table in the database
  //? is he value we are looking for in the database
  db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
    
    //used to display information regarding the error if one occurs
    if(error) {
      console.log(error);
    }

    //if result.length is greater than 0 it means that a user with the same email already exists
    if( result.length > 0 ) {
      return res.render('register', {
        message: 'The email is linked to another user. Please select a different email.'
      })
    } //if the user entered passwords that do not match 
    else if( password !== passwordConfirm ) {
      return res.render('register', {
        message: 'Passwords do not match! Please re-enter the passwords.'
      })
    } //if user did not fill in all the fields
    else if(name == '' || email == '' || password == '' || passwordConfirm == '') {
      return res.render('register', {
        message: 'Please fill in all the required fields!'
      })
    }

    //create variable to store hashed password
    //bcrypt is used to encrypt the password
    let hashedPassword = await bcrypt.hash(password, 15);

    //mysql insert query used to insert a new user into the user table within the database
    //hashed password is stored in the database so that the password remains secure
    db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword }, (error, result) => {
      
      //used to display information regarding the error if one occurs
      if(error) {
        console.log(error);
      } 
      else { //data successfully inserted into the user table
        console.log(result);
        return res.render('register', {
          message: 'User has successfully been registered.'
        });
      }
    })
  });
}





exports.login = async (req, res) => {
  
  try {
    //form values entered by the user
    const { email, password } = req.body;

    //displays error message when fields are empty
    if( email == '' || password == '' ) {
      return res.status(400).render('login', {
        message: 'Please enter your email and password!'
      })
    }

    //mysql select query used to select the email from the user table in the database
    //? is he value we are looking for in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, result) => {

      if( !result[0] || !(await bcrypt.compare(password, result[0].password))) {
        res.status(401).render('login', {
          message: 'Your email or password is incorrect'
        })
      } 
      else {
        const id = result[0].id;

        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });

        console.log("The token is: " + token);

        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        }

        res.cookie('jwt', token, cookieOptions);
        res.status(200).redirect("/");
      }
    })
  } catch (error) {
    console.log(error);
  }
}







exports.isLoggedIn = async (req, res, next) => {
  // console.log(req.cookies);
  if( req.cookies.jwt) {
    try {
      //1) verify the token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt,
      process.env.JWT_SECRET
      );

      console.log(decoded);

      //2) Check if the user still exists
      db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
        console.log(result);

        if(!result) {
          return next();
        }

        req.user = result[0];
        console.log("user is")
        console.log(req.user);
        return next();

      });
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    next();
  }
}

exports.logout = async (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 2*1000),
    httpOnly: true
  });

  res.status(200).redirect('/');
}