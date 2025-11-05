const api = require('./api')
module.exports = function (app, passport, db) {


  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('api').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        messages: result
      })
    })
  });


  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout(() => {
      console.log('User has logged out!')
    });
    res.redirect('/');
  });

  // message board routes ===============================================================

  app.post('/messages', (req, res) => {
    db.collection('messages').save({ name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown: 0 }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })

  app.get('/api/:query', isLoggedIn, async function (req, res) {
    //mongoDB rest api tutorial https://www.mongodb.com/resources/languages/express-mongodb-rest-api-tutorial
    const age = req.params.query
    console.log(age)
    let vaccines
    if (age < 1) {
      vaccines = 'Birth'
    } else if (age >= 1 && age < 4) {
      vaccines = '1 to 2 Months'
    } else if (age >= 4 && age <= 5) {
      vaccines = '4 Months'
    } else if (age >= 6 && age < 7) {
      vaccines = '6 months'
    } else if (age >= 7 && age < 12) {
      vaccines = '7 to 11 months'
    } else if (age >= 12 && age <= 23) {
      vaccines = '12 to 23 months'
    } else if (age > 23) {
      res.json('Baby exceeds age limit for this api!').status(200)
    } else {
      res.json('Invalid Entry!')
    }
    if(!vaccines) return
    let collection = await db.collection('api')
    let results = await collection.find({}).toArray();
    res.send(results[1][`${vaccines}`]).status(200);

  });

  //   {
  //     'Birth': ['Hepatitis B vaccine 1/3', 'Respiratory syncytial virus (RSV) vaccine'],
  //     '1 to 2 Months': ['DTaP vaccine 1/5', 'Hib vaccine 1/4', 'Hepatitis B vaccine 2/3', 'IPV 1/4', 'PCV 1/4', 'Rotavirus vaccine 1/3'],
  //     '4 Months': ['DTaP vaccine 2/5', 'Hib vaccine 2/4', 'IPV 2/4', 'PCVSpace 2/4', 'Rotavirus vaccine 2/3'],
  //     "6 months": ["DTap vaccine 3/5", "Hib vaccine 3/4", 'IPV 3/4', 'PCV 3/4', 'Rotavirus vaccine 3/3'],
  //     '7 to 11 months': ['Flu Vaccine'],
  //     '12 to 23 months': ['Chickenpox vaccine 1/2', 'DTaP vaccine 4/5', 'Hepatitis A vaccine 1/2', 'Hepatitis B vaccine 3/3', 'Hib vaccine 3/4', 'IPV 3/4', 'MMR vaccine 1/2', 'PCV 4/4']
  // }

  app.delete('/messages', (req, res) => {
    db.collection('messages').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });


  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
