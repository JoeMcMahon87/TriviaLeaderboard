var express = require('express');
var router = express.Router();
var Teams = require("../data/teams.js");
var names = { 9 : "Freshmen", 10: "Sophomores", 11: "Juniors", 12: "Seniors" };
var events = require('events');

var eventEmitter = new events.EventEmitter();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { rootapipath: '/api' });
});

router.get('/board', function(req, res) {
  Teams.find(function(err,teams) {
    if (err) {
      res.send(404,err);
    }
      var colorTeams = [ ];
      var gradeTeams = [ ];
      var index = 0;
      for(var i in teams) {
         // Re-total score first
         teams[i].TotalScore = teams[i].Round1 +
		teams[i].Round2 +
		teams[i].Round3 +
		teams[i].Puzzle1 +
		teams[i].Puzzle2 +
		teams[i].Puzzle3;

         if ((teams[i].BGTeam == 'Blue') || (teams[i].BGTeam == 'Both')) {
            if (!colorTeams[0]) {
               colorTeams[0] = { "name" : teams[i].BGTeam, "score": 0};
            }
            colorTeams[0].score += teams[i].TotalScore;
         } else if ((teams[i].BGTeam == 'Gold') || (teams[i].BGTeam == 'Both')) {
            if (!colorTeams[1]) {
               colorTeams[1] = { "name" : teams[i].BGTeam, "score": 0};
            }
            colorTeams[1].score += teams[i].TotalScore;
         }

         grades = teams[i].Grades.split(" ");
         for(var g in grades) {
            if (!gradeTeams[grades[g]]) {
               gradeTeams[grades[g]] = { "name" : grades[g], "score":0};
            }
            gradeTeams[grades[g]].score += teams[i].TotalScore;
         }
      } 
      for (var loop = 0; loop < gradeTeams.length; loop++) {
         if (gradeTeams[loop] == null) {
            gradeTeams.splice(loop, 1);
            loop--;
         } else {
            gradeTeams[loop].name = names[gradeTeams[loop].name];
         }
      }
      teams.sort(function(a,b) {
          return b.TotalScore - a.TotalScore;
      });
      colorTeams.sort(function(a,b) {
         return b.score - a.score;
      });
      gradeTeams.sort(function(a,b) {
         return b.score - a.score;
      });

    res.render('board', { 
      rootapipath: '/api',
      teams : teams,
      colors : colorTeams,
      grades : gradeTeams
    });
  });
});


router.get('/api/Team', function(req, res) {
    return Teams.find(function(err,teams){
        if (err)
            res.send(404,err);
        res.json(teams);
    });
});

router.post('/api/Team', function(req,res) {
    var team = {};
    if (req.body._id == 0) {
        // insert
        team = new Teams(
        {
	    Name : req.body.Name,
	    TotalScore : 0,
	    BGTeam :  req.body.BGTeam,
	    Grades : req.body.Grades,
	    Round1 : 0,
	    Round2 : 0,
	    Round3 : 0,
	    Puzzle1 : 0,
	    Puzzle2 : 0,
	    Puzzle3 : 0
        });
        team.save(function(err){
           if (err) {
               console.log("ERROR");
               res.send(500,err);
           }
           eventEmitter.emit('update');
           eventEmitter.emit('refresh');
           res.json(team);
        });
    }
    else {
        // update
        Teams.findById(req.body._id,function(err,team){
            if (err) {
                res.send(500,err);
            }
	        team.Name = req.body.Name;
	        team.TotalScore = (req.body.Round1*1 + req.body.Round2*1 + req.body.Round3*1 + req.body.Puzzle1*1 + req.body.Puzzle2*1 + req.body.Puzzle3*1);
	        team.BGTeam = req.body.BGTeam;
	        team.Grades = req.body.Grades;
	        team.Round1 = req.body.Round1;
	        team.Round2 = req.body.Round2;
	        team.Round3 = req.body.Round3;
	        team.Puzzle1 = req.body.Puzzle1;
	        team.Puzzle2 = req.body.Puzzle2;
	        team.Puzzle3 = req.body.Puzzle3;

            team.save(function(err){
                if (err) {
                    res.status(500,err);
                }

                Teams.find(function(err,teams) {
                    eventEmitter.emit('update', teams);
                    eventEmitter.emit('refresh');
                    res.json(team);
                });
            });
        });
    }
});

router.delete('/api/Team/:id', function(req,res){
    Teams.findById(req.params.id,function(err,team){
        if (team)
            team.remove();
            eventEmitter.emit('update');
            eventEmitter.emit('refresh');
    });
    res.send("");
});

var processUpdate = function updateBoard() {
      console.log("Update board!");
      Teams.find(function(err,teams) {
      var colorTeams = [ ];
      var gradeTeams = [ ];
      var index = 0;
      for(var i in teams) {
         // Re-total score first
         teams[i].TotalScore = teams[i].Round1 +
		teams[i].Round2 +
		teams[i].Round3 +
		teams[i].Puzzle1 +
		teams[i].Puzzle2 +
		teams[i].Puzzle3;

         if ((teams[i].BGTeam == 'Blue') || (teams[i].BGTeam == 'Both')) {
            if (!colorTeams[0]) {
               colorTeams[0] = { "name" : teams[i].BGTeam, "score": 0};
            }
            colorTeams[0].score += teams[i].TotalScore;
         } else if ((teams[i].BGTeam == 'Gold') || (teams[i].BGTeam == 'Both')) {
            if (!colorTeams[1]) {
               colorTeams[1] = { "name" : teams[i].BGTeam, "score": 0};
            }
            colorTeams[1].score += teams[i].TotalScore;
         }

         grades = teams[i].Grades.split(" ");
         for(var g in grades) {
            if (!gradeTeams[grades[g]]) {
               gradeTeams[grades[g]] = { "name" : grades[g], "score":0};
            }
            gradeTeams[grades[g]].score += teams[i].TotalScore;
         }
      }
      for (var loop = 0; loop < gradeTeams.length; loop++) {
         if (gradeTeams[loop] == null) {
            gradeTeams.splice(loop, 1);
            loop--;
         } else {
            gradeTeams[loop].name = names[gradeTeams[loop].name];
         }
      }
      teams.sort(function(a,b) {
          return b.TotalScore - a.TotalScore;
      });
      colorTeams.sort(function(a,b) {
         return b.score - a.score;
      });
      gradeTeams.sort(function(a,b) {
         return b.score - a.score;
      });

      eventEmitter.emit('refresh', {
	    'teams' : teams,
	    'colors' : colorTeams,
	    'grades' : gradeTeams });
      });
}

eventEmitter.once('update', processUpdate);
var io = require('socket.io').listen(8321);

io.on('connection', function(client) {
   console.log('Client connected...');
   client.on('join', function(data) {
      console.log(data);
   });
   eventEmitter.once('refresh', function(data) {
      client.emit('update', data);
   });
});

module.exports = router;
