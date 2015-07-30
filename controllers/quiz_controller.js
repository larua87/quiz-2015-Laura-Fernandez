/// <reference path="../typings/tsd.d.ts" />

var models = require('../models/models.js');

//Exportacion de todos los datos relacionados con las consutlas y las preguntas del juego
exports.load = function(req,res,next,quizId){
	models.Quiz.find({
		where: { id: Number(quizId)},
		include: [{model: models.Comment}]
	}).then(
		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			}else{next(new Error('No existe quizId' + quizId));
		}
	}).catch(function(error){next(error)});	
};

exports.index = function(req,res){
	var str = req.query.search;
	
	if(!req.query.search){
		str = '';		
	}else{		
		str = str.split(' ').join('%');
	}	
	models.Quiz.findAll({where: ["lower(pregunta) like ?", '%'+ str.toLowerCase() + '%'], order: 'tema ASC'}).then(function(quizes){
			res.render('quizes/index', {quizes: quizes,errors:[]});	
		})	
};
exports.show = function(req,res){ 
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz: req.quiz,errors:[]});
	})
};

exports.author = function(req,res){ 	
	res.render('author', {errors: []});
};

exports.answer = function(req,res){
	
	models.Quiz.find(req.params.quizId).then(function(quiz){	
		var resultado = 'Incorrecto';		
		if(req.query.respuesta === req.quiz.respuesta){ 
			resultado = 'Correcto';
		}		
		res.render('quizes/answer',{quiz: req.quiz, 
									respuesta: resultado,
									errors:[]});	
	})	
};

exports.nuevo = function(req,res){ 	
	var quiz = models.Quiz.build({pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"});
	res.render('quizes/new', {quiz: quiz,errors:[]});
};

exports.create = function(req,res){ 	
	var quiz = models.Quiz.build(req.body.quiz);
	quiz
	.validate()
	.then(
		function(error){
			if(error){
				res.render('quizes/new',{quiz: quiz, errors: error.errors})
			}else{
				quiz.save({fields: ["pregunta","respuesta","tema"]}).then(function(){
					res.redirect('/quizes');
				})			
			}
		}	
	);	
};

exports.edit = function(req,res){ 	
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz,errors:[]});
};

exports.update = function(req,res){ 	
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	
	req.quiz
	.validate()
	.then(
		function(error){
			if(error){
				res.render('quizes/edit',{
					quiz: req.quiz, 
					errors: error.errors})
			}else{
				req.quiz
				.save({fields: ["pregunta","respuesta","tema"]})
				.then(function(){ res.redirect('/quizes'); })
			}
		}	
	);	
};

exports.destroy = function(req,res){ 	
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');	
	}).catch(function(error){
		next(error);
	});
};