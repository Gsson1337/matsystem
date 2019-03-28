'use strict'
const pg = require('pg');
const mysql = require('mysql2');
const SchoolFoodScraper = require('./SchoolFoodScraper.js');

/**
  Database communication and functionality
**/
module.exports = class DatabaseHandler {

  //const DBURL = process.env.DATABASE_URL || "postgres://eehwvfixxiwamp:55d64c3b425aebf6fce5678970cef00d3293df5896d7f43fbad2059297a979c8@ec2-79-125-4-72.eu-west-1.compute.amazonaws.com:5432/df34h992q2uhdj"
  constructor(url) {
    console.log("DatabaseHandler constructor")
    this.con;
    this.skolmatURL = url;
    this.weekFoodMenu = new Array();
    this.currentVotes = new Array();
    this.establishConnection();
  }

  establishConnection() {

    this.con = new pg.Client({
      host: 'ec2-79-125-4-72.eu-west-1.compute.amazonaws.com',
      user: 'eehwvfixxiwamp',
      database: 'df34h992q2uhdj',
      password: '55d64c3b425aebf6fce5678970cef00d3293df5896d7f43fbad2059297a979c8',
      port: 5432,
      ssl: true
    });

    var self = this;
    this.con.connect(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("CONNECTED TO DB ");
        var sfs = new SchoolFoodScraper(self.skolmatURL, self);
        self.getMenuFromDB();
      }
    });

  }

 getGrades(socket) {
    //Get Grades from DB when client first opens the webapplication
    console.log("GET GRADES for " + socket.id);
    var grades = [];
    var today = new Date().toISOString().substring(0, 10);

    const query = {
      text: 'SELECT * FROM grades WHERE date_pk = $1',
      values: [today],
    }
    // callback
    this.con.query(query, (err, res) => {

      if (err) {
        return console.log(err.stack);
      } else {
        for (var i = 1; i < res.fields.length; i++) {
            var fieldName = res.fields[i].name;
            var grade = new Array();
            grade[0] = fieldName;
            grade[1] = res.rows[0][fieldName];
            grades.push(grade);
            if(this.currentVotes.length < 4){
            this.currentVotes.push(res.rows[0][fieldName]);
          }
        }
      }
      console.log(grades);
      socket.emit('grades', grades);
    });
  }

 addVote(typeOfVote) {

   console.log("typeofvote in addVote: " + typeOfVote);

    var currentVote;
    var query;
    var currentDate = new Date().toISOString().substring(0, 10);

    switch(typeOfVote)  {
      case "very_bad":
        currentVote = (parseInt(this.currentVotes[3], 10) + 1);
        this.currentVotes[3] = currentVote;
        query = "UPDATE grades SET very_bad = ($1) WHERE date_pk = ($2)";
        console.log("currentvote: " + currentVote);
        console.log("query i switchen: " + query);
        break;
      case "bad":
        currentVote = parseInt(this.currentVotes[2], 10) + 1;
        this.currentVotes[2] = currentVote;
        query = "UPDATE grades SET bad = ($1) WHERE date_pk = ($2)";
        console.log("currentvote: " + currentVote);
        break;
      case "good":
        currentVote = parseInt(this.currentVotes[1], 10) + 1;
        this.currentVotes[1] = currentVote;
        query = "UPDATE grades SET good = ($1) WHERE date_pk = ($2)";
        console.log("currentvote: " + currentVote);
        break;
      case "very_good":
        currentVote = parseInt(this.currentVotes[0], 10) + 1;
        this.currentVotes[0] = currentVote;
        query = "UPDATE grades SET very_good = ($1) WHERE date_pk = ($2)";
        console.log("currentvote: " + currentVote);
        break;
    }

    console.log("query: " + query)
    //+1 vote to grades when someone press on of the buttons
    this.con.query(query, [currentVote, currentDate], (err, res) => {
      if(err){
        return console.log(err.stack);
      } else {
        console.log("grades + 1 successful");
      }
    });
 }

  insertFood(weekFood) {
    //Insert a new week of rows in the food Database each week to get the meal
    //Get data from skolmatens hemsida
    for (var i = 0; i < weekFood.length; i++) {
      var date = weekFood[i][0];
      var meal = weekFood[i][1];
      var query = {
        text: 'INSERT into menu (date_pk, menu) VALUES ($1, $2)',
        values: [date, meal]
      }

      this.con.query(query, (err) => {
        if (err) {
          //console.log(err);
        } else {
          console.log(date + " " + meal + " inserted");
        }
      })

    }

  }

  startOfWeek(date) {
    var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  getMenuFromDB() {
    //Get weekly menu from db when databse starts
    var startDate = this.startOfWeek(new Date());
    //console.log("startDate " + startDate);
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

    for(var i = 0; i < 5; i++) {
      var day = new Date();
      day.setDate(startDate.getDate() + i);
      day = day.toISOString().substring(0, 10);
      //console.log(day);
      const query = {
        text: 'SELECT * FROM menu WHERE date_pk = $1',
        values: [day]
      }

      this.con.query(query, (err, res) => {
        if (err) {
          return console.log(err.stack);
        } else {
          var dateName = res.fields[0].name;
          var mealName = res.fields[1].name;
          var date = res.rows[0][dateName];
          var localDate = (new Date(date - tzoffset)).toISOString().substring(5, 10);
          var meal = res.rows[0][mealName];
          this.weekFoodMenu.push({localDate, meal});
        }
      });
    }
  }

  getMenu() {
    return this.weekFoodMenu;

  }

  startOfWeek(date) {
    var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  insertQuestions() {
    //get question from form
    //form pushes info to here, insert to DB
  }
}