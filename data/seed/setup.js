// Setup angular database
var db = db.getSiblingDB('angular');

var Teams = [
    { "Name":"A0001", "TotalScore": 14,  "BGTeam":"Blue","Grades":"9 11","Round1":7,"Round2":7,"Round3":0,"Round4":0,"Bonus":0,"Puzzle":0},
    { "Name":"B0001", "TotalScore": 12,  "BGTeam":"Gold","Grades":"9 12","Round1":3,"Round2":9,"Round3":0,"Round4":0,"Bonus":0,"Puzzle":0},
    { "Name":"A0002", "TotalScore": 10,  "BGTeam":"Both","Grades":"10","Round1":5,"Round2":5,"Round3":0,"Round4":0,"Bonus":0,"Puzzle":0},
];

db.teams.insert(Teams);

var teams = db.teams.find();
while (teams.hasNext()){
    printjson(teams.next());
}

print("Database Setup!");





