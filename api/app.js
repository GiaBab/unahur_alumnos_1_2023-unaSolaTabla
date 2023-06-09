var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

var carrerasRouter = require('./routes/carreras');
var materiasRouter = require('./routes/materias');
var alumnosRouter = require('./routes/alumnos');
var inscripcionesRouter = require('./routes/inscripciones');
var userRouter = require('./routes/users');
var loginRouter = require('./routes/login');

var fs = require('fs');


//swagger

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API",
			version: "1.0.0",
			
		},
		servers: [
			{
				url: "http://localhost:3001",
			},
		],
		components: {
		  securitySchemes: {
			bearerAuth: {
			  type: "http",
			  scheme: "bearer",
			  bearerFormat: "JWT",
			},
		  },
		},
		security: [
		  {
			bearerAuth: [],
		  },
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);


//swagger
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'info.log'),{flags: 'a'})
logger.token('type', function (req, res){
  return req.headers['content-type']
})

app.use(logger(':method :url :status :res[content-lenght] - :response-time ms :date[web] :type', {stream:accessLogStream}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//swag
app.use('/mat', materiasRouter);
app.use('/car', carrerasRouter);
app.use('/alum', alumnosRouter);
app.use('/ins', inscripcionesRouter);
app.use('/user', userRouter);
app.use('/login', loginRouter);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


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
