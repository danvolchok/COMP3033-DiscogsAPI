var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Mongo DB package
var mongoose = require('mongoose')
var configs = require("./config/globals")


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
        url: "https://discogsapi.onrender.com/api",
      },
    ],
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
          tags: ['Popular music database'],
          security: [
            {
              basicAuth: []
            }
          ],
          description: 'Returns a list of popular music',
          parameters: [
            {
              name: 'year',
              in: 'query',
              required: false,
              description: 'Release year of track',
              schema: {
                type: 'string'
              }
            },
            {
              name: 'genre',
              in: 'query',
              required: false,
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
                        album: {
                          type: 'string',
                          description: 'Album of the track'
                        },
                        year: {
                          type: 'string',
                          description: 'Release year of the track'
                        },
                        genre: {
                          type: 'string',
                          description: 'Genre of the track'
                        },
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Popular music database'],
          security: [
            {
              basicAuth: []
            }
          ],
          description: 'Create a new track',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                      description: 'Track title'
                    },
                    artist: {
                      type: 'string',
                      description: 'Track artist'
                    },
                    album: {
                      type: 'string',
                      description: 'Track album'
                    },
                    year: {
                      type: 'string',
                      description: 'Release year of track'
                    },
                    genre: {
                      type: 'string',
                      description: 'Track genre'
                    }
                  },
                  required: ['title', 'artist', 'album', 'year', 'genre']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Track created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object'
                  }
                }
              }
            },
            '400': {
              description: 'Invalid input'
            },
            '500': {
              description: 'Server error'
            }
          }
        }
      },
      '/tracks/{_id}': {
        get: {
          tags: ['Popular music database'],
          security: [
            {
              basicAuth: []
            }
          ],
          description: 'Returns a single track by its MongoDB ObjectId',
          parameters: [
            {
              name: '_id',
              in: 'path',
              required: true,
              description: 'MongoDB ObjectId of the track to retrieve',
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Track retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      _id: {
                        type: 'string',
                        description: 'MongoDB ObjectId of the track'
                      },
                      title: {
                        type: 'string',
                        description: 'Name of the track'
                      },
                      artist: {
                        type: 'string',
                        description: 'Artist of the track'
                      },
                      album: {
                        type: 'string',
                        description: 'Album of the track'
                      },
                      year: {
                        type: 'string',
                        description: 'Release year of the track'
                      },
                      genre: {
                        type: 'string',
                        description: 'Genre of the track'
                      },
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Track not found'
            },
            // ... other possible responses ...
          }
        },
        put: {
          tags: ['Popular music database'],
          security: [
            {
              basicAuth: []
            }
          ],
          description: 'Update an existing track',
          parameters: [
            {
              name: '_id',
              in: 'path',
              required: true,
              description: 'MongoDB ObjectId of the track to update',
              schema: {
                type: 'string',
                example: '656d0bc54b31e659828530e0'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                      description: 'Track title',
                      example: 'New Title'
                    },
                    artist: {
                      type: 'string',
                      description: 'Track artist',
                      example: 'New Artist'
                    },
                    album: {
                      type: 'string',
                      description: 'Track album',
                      example: 'New Album'
                    },
                    year: {
                      type: 'string',
                      description: 'Release year of track',
                      example: '2020'
                    },
                    genre: {
                      type: 'string',
                      description: 'Track genre',
                      example: 'New Genre'
                    }
                  },
                  required: ['title', 'artist', 'album', 'year', 'genre']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Track updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      _id: {
                        type: 'string',
                      },
                      title: {
                        type: 'string'
                      },
                      artist: {
                        type: 'string'
                      },
                      album: {
                        type: 'string'
                      },
                      year: {
                        type: 'string'
                      },
                      genre: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Invalid input'
            },
            '404': {
              description: 'Track not found'
            },
            '500': {
              description: 'Server error'
            }
          }
        },
        delete: {
          tags: ['Popular music database'],
          security: [
            {
              basicAuth: []
            }
          ],
          description: 'Delete a track',
          parameters: [
            {
              name: '_id',
              in: 'path',
              required: true,
              description: 'MongoDB ObjectId of the track to delete',
              schema: {
                type: 'string',
                example: '656d0bc54b31e659828530e0'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Track deleted successfully'
            },
            '404': {
              description: 'Track not found'
            },
            '500': {
              description: 'Server error'
            }
          }
        }
      }
    }
  },
  apis: ["./routes/api/*.js"],
};


var swaggerSpec = swaggerJSDoc(options);


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

app.use('/docs', SwaggerUI.serve, SwaggerUI.setup(swaggerSpec))

// initialize passport and strategy
app.use(passport.initialize());

passport.use(
  new BasicStrategy((username, password, done) => {
    // provide code to find user and validate password
    // hardcode credentials admin:default
    // valid login YWRtaW46ZGVmYXVsdA==
    if (username == "admin" && password == "default") {
      console.log(`User ${username} authenticated successfully!`);
      return done(null, username);
    } else {
      console.log(`User ${username} authentication failed!`);
      return done(null, false);
    }
  })
);

app.use('/', indexRouter);
// legacy endpoint
app.use(
  "/api/tracks",
  passport.authenticate("basic", { session: false }),
  tracksRouter
);


// Connect to DB after router/controller configuration
mongoose
  .connect(configs.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((message) => {
    console.log("App connected successfully!");
  })
  .catch((error) => {
    console.log("Error while connecting: " + error);
  });

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
