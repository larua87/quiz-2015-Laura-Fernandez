/// <reference path="../typings/tsd.d.ts" />

//Definición del modelo de Quiz, que se va a mostrar por pantalla

module.exports = function (sequelize, DataTypes){
	return sequelize.define('Quiz',{
		pregunta: 	{type: DataTypes.STRING,
					 validate: { notEmpty: {msg: "-> Falta la pregunta"} }
					},
		respuesta: 	{type: DataTypes.STRING,
					 validate: { notEmpty: {msg: "-> Falta la respuesta"} }
					},
		tema: 	{type: DataTypes.STRING,
					 validate: { notEmpty: {msg: "-> Falta la Respuesta"} }
					}
	});
}