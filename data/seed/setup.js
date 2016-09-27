// Setup angular database
var db = db.getSiblingDB('leaderboard');

var Teams = [
    { "Name":"A0001", "TotalScore": 14,  "BGTeam":"Blue","Grades":"9 11","Round1":7,"Puzzle1":7,"Round2":0,"Puzzle2":0,"Round3":0,"Puzzle3":0},
    { "Name":"B0001", "TotalScore": 12,  "BGTeam":"Gold","Grades":"9 12","Round1":3,"Puzzle1":9,"Round2":0,"Puzzle2":0,"Round3":0,"Puzzle3":0},
    { "Name":"A0002", "TotalScore": 10,  "BGTeam":"Both","Grades":"10","Round1":5,"Puzzle1":5,"Round2":0,"Puzzle2":0,"Round3":0,"Puzzle3":0},
];

db.teams.insert(Teams);

var teams = db.teams.find();
while (teams.hasNext()){
    printjson(teams.next());
}

print("Database Setup!");





