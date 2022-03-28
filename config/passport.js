
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User')

module.exports = function (passport) {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        avatar: profile.photos[0].value.split(/=s/)[0] + '=s500',
        username: profile.displayName,
        email: profile.emails[0].value
      }

      console.log('\n +++ Profile from Google Auth: ', profile)

      try {

        let user = await User.findOne({
          where: { googleId: profile.id }
        })

        console.log('\n +++ Found existing user: ', user)

        if (user) {
          console.log('\n +++ Passport user: ', user)


          done(null, user)
        } else {

          console.log('\n +++ Creating new user: ', newUser)

          user = await User.create(newUser)

          console.log('\n +++ Created new user: ', user)


          done(null, user)
        }
      } catch (err) {
        console.log("\nXXX ___ Passport error:  \n")
        console.error(err)
      }
    }
  )
  )

  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
    // allows us to pass back the entire request to the callback
  },
    async (req, email, password, done) => {

      console.log("--- Hit Local Strat : ",req.body, email , password )

      User.findOne({
        where: {
          email: req.body.email
        }
      }).then(function (user) {
        if (user) {
          return done(null, user, {
            message: 'That email is already taken'
          });

        } else {

          var data = {
            email: req.body.email,
            password : req.body.pasword,
            username: req.body.username,
          };

          User.create(data).then(function (newUser, created) {
            if (!newUser) {
              return done(null, false);
            }

            if (newUser) {
              return done(null, newUser);
            }
          });
        }
      });
    }
  ));


  passport.serializeUser((user, done) => {
    console.log("--- Serialized user: ", user)
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {

    console.log("--- Deserialized user id : ", id)

    User.findOne({
      where: { id },
      raw: true
    })
      .then((user, err) => {
        if (err) {
          throw Error(err)
        }

        console.log('... deserialized from Sequelize: ', "\nUser: \n" + JSON.stringify(user))

        done(err, user)

      })

  })
}
