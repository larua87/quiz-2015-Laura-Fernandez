/// <reference path="../typings/tsd.d.ts" />

var path = require('path');

var DATABASE_URL="sqlite://:@:/";
var DATABASE_STORAGE="quiz.sqlite";

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name 	= (url[6]||null);
var user 		= (url[2]||null);
var pwd 		= (url[3]||null);
var protocol 	= (url[1]||null);
var dialect 	= (url[1]||null);
var port 		= (url[5]||null);
var host	    = (url[4]||null);
var storage 	= process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
var sequelize = new Sequelize(DB_name,user,pwd,{
	dialect: protocol,
	protocol: protocol,
	port: port,
	host: host,
	storage: storage, // solo SQLITE (.env)
	omitNull: true // solo Postgres
});

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// exportar tablas
exports.Quiz = Quiz; 
exports.Comment = Comment; 

// sequelize.sync() crea e inicializa tabla preguntas en DB
sequelize.sync().success(function(){
	//success(..) ejecuta el manejador una vez creada la tabla
	console.log('Comienzo base de datos');
	Quiz.count().success(function(count){		
		if(count===0){
			Quiz.create({
				pregunta: 'Cual es la capital de Italia',
				respuesta: 'Roma',
				tema: 'otros'
			});
			Quiz.create({
				pregunta: 'Cual es la capital de Portugal',
				respuesta: 'Lisboa',
				tema: 'ciencia'
			})
			.success(function(){
				console.log('Base de datos ON')
			});
		};
	});
});