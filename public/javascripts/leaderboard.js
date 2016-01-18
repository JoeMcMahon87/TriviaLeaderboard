var sortTeams = function() {
   $('div.team-name').sort(function(a,b) {
      var scoreA = parseInt( $('#' + a.id + " > span").text() );
      var scoreB = parseInt( $('#' + b.id + " > span").text() );
   
      return (scoreA < scoreB) ? +1 : (scoreA > scoreB) ? -1 : 0;
   }).each(function(_, container) {
      $(container).parent().append(container);
   });
};

var sortColors = function() {
   $('div.color-name').sort(function(a,b) {
      var scoreA = parseInt( $('#' + a.id + " > span").text() );
      var scoreB = parseInt( $('#' + b.id + " > span").text() );
   
      return (scoreA < scoreB) ? +1 : (scoreA > scoreB) ? -1 : 0;
   }).each(function(_, container) {
      $(container).parent().append(container);
   });
};

var sortGrades = function() {
   $('div.grade-name').sort(function(a,b) {
      var scoreA = parseInt( $('#' + a.id + " > span").text() );
      var scoreB = parseInt( $('#' + b.id + " > span").text() );
   
      return (scoreA < scoreB) ? +1 : (scoreA > scoreB) ? -1 : 0;
   }).each(function(_, container) {
      $(container).parent().append(container);
   });
};

var processUpdate = function(data) {
   var teams = data.teams; 
   var colors = data.colors;
   var grades = data.grades;

   colors.forEach(function(color) {
      $('#colorscore_' + color.name).html(color.score);
   });
   sortColors();

   grades.forEach(function(grade) {
      $('#gradescore_' + grade.name).html(grade.score);
   });
   sortGrades();

   teams.forEach(function(team) {
      $('#score_' + team._id).html(team.TotalScore);
   });
   sortTeams();

};


//$('window').load(function() {
   var socket = io.connect('http://stoneridgesummercampus.org:8321');
   socket.on('connect', function(data) {
      console.log('Connected to server');
      socket.emit('join', 'Hello from client');
      socket.on('update', function(info) {
         if (info != null) {
            // console.log(info);
            processUpdate(info);
         }
      });
   });
//});

