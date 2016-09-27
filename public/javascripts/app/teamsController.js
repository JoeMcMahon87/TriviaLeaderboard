app.controller('TeamsController', function ($scope, $log, $modal, $window, Restangular, teamDialog, teamsRepo) {

    $scope.selections = [];
    $scope.loaded = false;

    var eventName = "scoresUpdated";

    socket.on(eventName,function(msg){
       getTeams();
       socket.emit("refresh", "refresh");
    });

    teamsRepo.init($scope.rootapipath);

    $scope.gridDblClickHandler = function (rowItem) {
        $scope.editTeam();
    }


    var getTeams = function () {
        teamsRepo.getList()
            .then(function (teams) {
                $scope.teams = teams;
                $scope.loaded = true;
            },
            function (err) {
                $window.alert(getMessage(err));
            });
    };
    getTeams();

    $scope.gridOptions = {
        data: 'teams',
        multiSelect: false,
        selectedItems: $scope.selections,
        showFilter: false,
        showFooter: true,
        dblClickFn: $scope.gridDblClickHandler,
        plugins: [ngGridDoubleClick],
        columnDefs: [
                     { field: 'Name', displayName: 'Team Name' },
                     { field: 'TotalScore', displayName: 'Total Score' },
                     { field: 'BGTeam', displayName: 'Blue / Gold' },
                     { field: 'Grades', displayName: 'Grades' },
                     { field: 'Round1', displayName: 'Round 1' },
                     { field: 'Puzzle1', displayName: 'Puzzle 1' },
                     { field: 'Round2', displayName: 'Round 2' },
                     { field: 'Puzzle2', displayName: 'Puzzle 2' },
                     { field: 'Round3', displayName: 'Round 3' },
                     { field: 'Puzzle3', displayName: 'Puzzle 3' }
        ]
    };

    $scope.saveTeam = function (team) {
        teamsRepo.save(team)
            .then(function (team) {
                socket.emit(eventName,'team saved');
            },
            function (err) {
                $window.alert(getMessage(err));
                getTeams();
            });
    };

    $scope.removeTeam = function () {
        var team = $scope.selections[0];
        if (team != undefined) {
            teamsRepo.remove(team._id)
              .then(function () {
                  socket.emit(eventName,'team removed');
              },
              function (err) {
                  $window.alert(getMessage(err));
                  getTeams();
              });
        }
    };

    $scope.addTeam = function () {
        $scope.openDialog('lg', 'Add');
    };

    $scope.editTeam = function () {
        $scope.openDialog('lg', 'Edit');
    };

    $scope.deleteTeam = function () {
        $scope.openDialog('lg', 'Delete');
    };

    $scope.setTeams = function(teams) {
        $scope.teams = teams;
    }

    $scope.openDialog = function (size, doThis) {
        var team = {};
        if (doThis === 'Add') {
            team = {
                _id: 0,
                Name: '',
                TotalScore: 0,
                BGTeam: '',
                Grades: '',
		Round1: 0,
		Round2: 0,
		Round3: 0,
		Puzzle1: 0,
		Puzzle2: 0,
		Puzzle3: 0
            };
        }
        else
        {
            if (!$scope.selections[0])
                return;

            angular.copy($scope.selections[0], team);
        }

        var modalInstance = teamDialog.open(size,team,doThis,$scope.teams);

        modalInstance.result.then(function (result) {
            if (result.doThis === 'Delete')
                $scope.removeTeam();
            else
                $scope.saveTeam(result.team);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

});

