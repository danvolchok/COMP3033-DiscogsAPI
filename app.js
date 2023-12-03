var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Mongo DB package
var mongoose = require('mongoose')
var configs = require('./config/globals')


// Authentication package
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

// CORS package; fixes fetch error in SwaggerUI
var cors = require('cors');

// API documentation package
var SwaggerUI = require('swagger-ui-express');

// API documentation from comments
var swaggerJSDoc = require('swagger-jsdoc');
var options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Discogs API",
      version: "1.0.0",
      contact: {
        name: "Dan Volchok",
        email: "volchokdan@gmail.com",
        url: "http://danvolchok.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    tags: {
      name: "Georgian College"
    },
    components: {
      securitySchemes: {
        basicAuth: {
          type: "http",
          scheme: "basic"
        }
      }
    },
    paths: {
      '/tracks': {
        get: {
          tags: ['Georgian College'],
          security: [
            {
              basicAuth: []
            }
          ],
          description: 'Returns a list of tracks',
          parameters: [
            {
              name: 'year',
              in: 'query',
              required: true,
              description: 'Release year of track',
              schema: {
                type: 'string'
              }
            },
            {
              name: 'genre',
              in: 'query',
              required: true,
              description: 'Track genre',
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Unfiltered list of tracks',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                          description: 'Name of the track'
                        },
                        artist: {
                          type: 'string',
                          description: 'Artist of the track'
                        },
                        // Add other track properties as needed
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ["./routes/api/*.js"],
};
var swaggerSpec = swaggerJSDoc(options);

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var tracksRouter = require('./routes/api/tracks');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
