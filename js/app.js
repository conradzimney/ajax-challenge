
"use strict";

angular.module('CommentApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'gga6qvBY9CI3QgOVnn3gJoxvzu49bcdXiz0GTpRv';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'oNq7fZrWgcvrSmh6OzlepGvUlpdLVkDiAeqpZHxY';
    })
    .controller('CommentsController', function($scope, $http) {
        var commentsUrl = 'https://api.parse.com/1/classes/comments';

        $scope.loading = false;

        $scope.refreshComments = function() {
            $scope.loading = true;
            $http.get(commentsUrl+'?order=-score')
                .success(function(data) {
                    $scope.comments = data.results;
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };

        $scope.refreshComments();

        $scope.newComment = {score: 0};

        $scope.addComment = function() {
            $scope.loading = true;
            $http.post(commentsUrl, $scope.newComment)
                .success(function(responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {score: 0};
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.loading = false;
                })
        };

        $scope.incrementScore = function(comment, amount) {
            if (comment.score > 0 || amount > 0) {
                $http.put(commentsUrl + '/' + comment.objectId, {
                    score: {
                        __op: 'Increment',
                        amount: amount
                    }
                })
                    .success(function (responseData) {
                        console.log(responseData);
                        comment.score = responseData.score;
                    })
                    .error(function () {
                        console.log(err);
                    })
            }
        };

        $scope.removeComment = function(comment) {
            if (window.confirm("Are you sure you want to delete this comment?")) {
                $scope.loading = true;
                $http.delete(commentsUrl + '/' + comment.objectId)
                    .finally(function () {
                        $scope.refreshComments();
                        $scope.loading = false;
                    })
            }
        };
    }); // CommentsController

/* STILL NEED TO FIX:
    General UX
 */