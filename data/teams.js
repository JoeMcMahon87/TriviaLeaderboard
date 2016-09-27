var mongoose = require("mongoose");

var Team = mongoose.model('teams', new mongoose.Schema({
    Name         :String,
    TotalScore   :Number,
    BGTeam     	 :String,
    Grades       :String,
    Round1       :Number,
    Puzzle1       :Number,
    Round2       :Number,
    Puzzle2       :Number,
    Round3        :Number,
    Puzzle3       :Number
}));

module.exports = Team;

