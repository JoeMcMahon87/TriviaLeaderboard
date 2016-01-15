app.filter('match', function () {
    return function (input, lookup, fields) {
        var field = fields.split(",");
        var match = _.find(lookup, function (item) {
            return item[field[0]] === input;
        });
        if (match != undefined)
            return match[field[1]];
        else
            return input;
    }
});

app.directive('isNumber', ['numberFilter',function(numberFilter){
    return{
        require:'ngModel',
        link: function(scope, elem, attrs, ctrl){
            var digits = attrs.isNumber.length===0 ? "2" : attrs.isNumber;
            ctrl.$parsers.unshift(checkForNumber);
            ctrl.$formatters.unshift(formatNumber);

            function checkForNumber(viewValue){

                // Checks for positive or negative decimal or integer number with or without thousand separators
                if (/^-{0,1}\d{1,3}(,\d{3})*\.{0,1}\d*$|^-{0,1}\d*\.{0,1}\d*$/.test(viewValue)) {
                    ctrl.$setValidity('isNumber',true);
                }
                else{
                    ctrl.$setValidity('isNumber', false);
                }
                return viewValue.replace(/,/g,'');
            }

            function formatNumber(viewValue) {
                return numberFilter(viewValue,digits);
            }
        }
    };
}]);

app.factory('teamDialog', ['$modal',function($modal){

    function open(size,team,doThis,teams) {
        return $modal.open({
            templateUrl: 'teamDlg.html',
            controller: TeamDlgCtrl,
            size: size,
            backdrop: 'static',
            resolve: {
                teams: function () {
                    return teams;
                },
                team: function () {
                    return team;
                },
                doThis: function () {
                    return doThis;
                }
            }
        });
    }

    return {
        open : open
    };

}]);

var TeamDlgCtrl = function ($scope, $modalInstance, lookupDialog, teams, team, doThis) {

    $scope.teams = teams;
    $scope.team = team;
    $scope.doThis = doThis;
    $scope.unique = true;
    $scope.delete = false;

    if (doThis === 'Delete')
        $scope.delete = true;

    $scope.ok = function () {
        $modalInstance.close({ team: $scope.team, doThis: $scope.doThis });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

app.factory('lookupDialog', ['$modal',function($modal){

    function open(size) {
        return $modal.open({
            templateUrl: 'lookupDlg.html',
            controller: LookupDlgCtrl,
            size: size,
            backdrop: 'static',
            resolve: {
            }
        });
    }

    return {
        open : open
    };

}]);

var LookupDlgCtrl = function ($scope, $modalInstance) {

    $scope.result = {};

    $scope.ok = function () {
        $modalInstance.close({ lookupCode: $scope.result.lookupCode });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

app.factory('teamsRepo', ['Restangular',function(Restangular){

    function init(rootApiPath)
    {
        Restangular.setBaseUrl(rootApiPath);
    }

    function remove(id) {
        return Restangular.one('Team',id).remove();
    }

    return {
        init : init,
        getList : Restangular.all('Team').getList,
        save : Restangular.all('Team').post,
        remove: remove
    }

}]);

