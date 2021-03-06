(function() {

  var app = angular.module("Stream");

  var SearchController = function($scope, $location, tmdb, guidebox, $routeParams, favorites) {

    $scope.pageLoaded = false;
    var resultsLoaded = [];

    $scope.movieSearch = function(newQuery) {
      tmdb.movieSearch(newQuery.replace("%20", " ")).then(processSearch, onError);
    };

    $scope.movieSimilar = function() {
      tmdb.movieSimilar($routeParams.id).then(processSearch, onError);
    };
    
    $scope.movieCollage = function(data) {
      processSearch(data);
    }

    var processSearch = function(data) {
      $scope.resp = data;
      $scope.results = data.results;
      if ($scope.results.length === 0) {
        $scope.pageLoaded = true;
      }
      for (i = 0; i < $scope.results.length; i += 1) {
        resultsLoaded.push(false);
      };
      for (i = 0; i < $scope.results.length; i += 1) {
        getStreamingSources(i, $scope.results[i].id);
      };
    };

    var getStreamingSources = function(row, tmdbID) {
      guidebox.getStreamingSources(tmdbID).then(function(data) {
        if (data) {
          $scope.results[row].sources = data;
        }
        resultsLoaded[row] = true;
        if(resultsLoaded.indexOf(false) === -1) {
          $scope.pageLoaded = true;
        }
      }, onError);
    };

    var onError = function(reason) {
      console.log(reason);
    };
        
    $scope.greaterThan = function(prop, val){
      return function(item) {
        return item[prop] > val;
      };
    };

    if ($location.url().substring(0,8) === "/search/") {
      $scope.movieSearch($routeParams.query);
    } else if ($location.url().substring(0,9) === "/similar/") {
      $scope.movieSimilar($routeParams.id);
    } else if ($location.url() === "/category/popular") {
      $scope.movieCollage($scope.popular);
    } else if ($location.url() === "/category/G-rated") {
      $scope.movieCollage($scope.gRated);
    } else if ($location.url() === "/category/comedy") {
      $scope.movieCollage($scope.comedy);
    } else if ($location.url() === "/category/Top-rated") {
      $scope.movieCollage($scope.topRated);
    } else if ($location.url() === "/category/Top-2016") {
      $scope.movieCollage($scope.top2016);
    } else if ($location.url() === "/category/Sci-fi") {
      $scope.movieCollage($scope.sciFi);
    } else if ($location.url() === "/user/favorites") {
      favorites.getFavorites().then(function(response) {
        processSearch(response);
      })
    };
    
    window.scrollTo(0, 0);
  };

  app.controller("SearchController", SearchController);

}());