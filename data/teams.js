var mongoose = require("mongoose");

var Team = mongoose.model('teams', new mongoose.Schema({
    Name         :String,
    TotalScore   :Number,
    BGTeam     	 :String,
    Grades       :String,
    Round1       :Number,
    Round2       :Number,
    Round3       :Number,
    Round4       :Number,
    Bonus        :Number,
    Puzzle       :Number
}));

module.exports = Team;

