const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const mysql_DB = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

const registerSelectQuery = 'SELECT email FROM user WHERE email = ?';

const registerInsertQuery = 'INSERT INTO user SET ?';

exports.register = (req, res) => {
 
  console.log(req.body);
  
  const { name, email, password, passwordConfirm } = req.body;

  mysql_DB.query(registerSelectQuery, [email], async (err, result) => {
    
    if(err) {
      console.log(err);
    }

    if( result.length > 0 ) {
      
      return res.render('register', {
        message: 'The email is linked to another user. Please select a different email.'
      })
    } 
    else if( password !== passwordConfirm ) {
      
      return res.render('register', {
        message: 'Passwords do not match! Please re-enter the passwords.'
      })
    } 
    else if(name == '' || email == '' || password == '' || passwordConfirm == '') {
      
      return res.render('register', {
        message: 'Please fill in all the required fields!'
      })
    }

    let hashedPassword = await bcrypt.hash(password, 15);

    mysql_DB.query(registerInsertQuery, {name: name, email: email, password: hashedPassword }, (err, result) => {
      
      if(err) {
        console.log(err);
      } 
      else { 
        console.log(result);
        
        return res.render('login', {
          message: 'User has successfully been registered. Please login to continue.'
        });
      }
    });
  });
}


exports.login = async (req, res) => {
  
  try {

    const { email, password } = req.body;
    
    if( email == '' || password == '' ) {
      
      return res.status(400).render('login', {
        message: 'Please enter your email and password!'
      })
    }
    const loginSelectQuery = 'SELECT * FROM user WHERE email = ?';
    mysql_DB.query(loginSelectQuery, [email], async (err, result) => {

      if( !result[0] || !(await bcrypt.compare(password, result[0].password))) {
        
        res.status(401).render('login', {
          message: 'Your email or password is incorrect'
        })
      } 
      else {
        const user_id = result[0].user_id;

        const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });

        console.log('token:' + token);

        const cookieOptions = {
          
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        }

        res.cookie('jwt', token, cookieOptions);
        res.status(200).redirect("/profile");
      }
 
    }) 
  } catch (err) {
    console.log(err);
  }
}

exports.isLoggedIn = async (req, res, next) => {
 
  if( req.cookies.jwt) {
    try {
      
      const decoded = await promisify(jwt.verify)(req.cookies.jwt,
      process.env.JWT_SECRET
      );

      console.log(decoded);

      mysql_DB.query('SELECT * FROM user WHERE user_id = ?', [decoded.user_id], (err, result) => {
        console.log(result);

        if(!result) {
          return next();
        }

        req.user = result[0];
        console.log("user is")
        console.log(req.user);
        return next();

      }); 
    } 
    catch (err) {
      console.log(err);
      return next();
    }
  } else {
    next();
  }
}

exports.upload = async (req, res) => {
  
  let sampleFile;
  let uploadPath;

  if(!req.files || Object.keys(req.files).length === 0) {

    return res.status(400).render('upload', {
      message: 'Upload failed! Please try again.'
    });
  }

  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/../uploads/' + sampleFile.name;
  
  console.log(sampleFile);

  sampleFile.mv(uploadPath, function (err) {
    if(err) return res.status(500).send(err);

    return res.render('upload', {
      message: 'Your image was successfully uploaded.'
    });

});

}

exports.view = async (req, res) => {
  res.render('/view');
}

exports.download = async (req, res) => {
  res.render('/download');
}

exports.delete = async (req, res) => {
  res.render('/delete');
}

exports.shared = async (req, res) => {
  res.render('/shared');
}

exports.logout = async (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 2*1000),
    httpOnly: true
  });

  res.status(200).redirect('/');
}
