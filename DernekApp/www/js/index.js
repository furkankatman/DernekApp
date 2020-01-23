/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function () {
    document.addEventListener(
      "deviceready",
      this.onDeviceReady.bind(this),
      false
    );
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function () {
    var app = angular.module("DernekApp", [
      "ngMaterial",
      "ngMessages",
      "ui.router"
    ]);

    app.controller("MainController", function (
      $scope,
      $state,
      $timeout,
      $mdSidenav,
      $log
    ) {
      $scope.toggleLeft = buildDelayedToggler("left");
      $scope.toggleRight = buildToggler("right");
      $scope.isOpenRight = function () {
        return $mdSidenav("right").isOpen();
      };
      /**
       * Supplies a function that will continue to operate until the
       * time is up.
       */
      function debounce(func, wait, context) {
        var timer;

        return function debounced() {
          var context = $scope,
            args = Array.prototype.slice.call(arguments);
          $timeout.cancel(timer);
          timer = $timeout(function () {
            timer = undefined;
            func.apply(context, args);
          }, wait || 10);
        };
      }

      /**
       * Build handler to open/close a SideNav; when animation finishes
       * report completion in console
       */
      function buildDelayedToggler(navID) {
        return debounce(function () {
          // Component lookup should always be available since we are not using `ng-if`
          $mdSidenav(navID)
            .toggle()
            .then(function () {
              $log.debug("toggle " + navID + " is done");
            });
        }, 200);
      }

      function buildToggler(navID) {
        return function () {
          // Component lookup should always be available since we are not using `ng-if`
          $mdSidenav(navID)
            .toggle()
            .then(function () {
              $log.debug("toggle " + navID + " is done");
            });
        };
      }

      $scope.close = function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav("left")
          .close()
          .then(function () {
            $log.debug("close LEFT is done");
          });
      };
      $scope.Greeting = "Merhaba Sayın Üye :)";
      $scope.dernek = {};
      $scope.state = $state;
      $scope.fib = {};
      $scope.fib.auth = firebase.auth();
      $scope.fib.db = firebase.database();
      $scope.SaveDernek = function () {
        alert("Dernek Oluşturuldu");
      };
    });

    angular.element(document).ready(function () {
      angular.bootstrap(document, ["DernekApp"]);
    });

    app.config(function ($stateProvider, $urlRouterProvider) {
      var homeState = {
        name: "home",
        url: "/home",
        templateUrl: "Templates/Home.html",
        controller: "MainController"
      };

      var aboutState = {
        name: "about",
        url: "/about",
        templateUrl: "Templates/About.html",
        controller: function ($scope) {
          $scope.Greeting = "Selam About";
        }
      };

      var misyonState = {
        name: "misyon",
        url: "/misyon",
        templateUrl: "Templates/Misyon.html",
        controller: function ($scope) {
          $scope.Greeting = "Selam Misyon";
        }
      };
      var vizyonState = {
        name: "vizyon",
        url: "/vizyon",
        templateUrl: "Templates/Vizyon.html",
        controller: function ($scope) {
          $scope.Greeting = "Selam Vizyon";
        }
      };
      var tuzukState = {
        name: "tuzuk",
        url: "/tuzuk",
        templateUrl: "Templates/Tuzuk.html",
        controller: function ($scope) {
          $scope.Greeting = "Selam Tüzük";
        }
      };

      var signupState = {
        name: "signup",
        url: "/signup",
        templateUrl: "Templates/Signup.html",
        controller: function ($scope) {
          $scope.Greeting = "Selam Kayıt Ekranı";
          $scope.user = {};
          $scope.Signup = function () {
            console.log("Kayıt oldunuz.");
            firebase
              .auth()
              .createUserWithEmailAndPassword(
                $scope.user.email,
                $scope.user.password
              )
              .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
              })
              .then(function () {
                console.log("Kullanıcı kaydedildi.--->", user.email);
              });
          };
        }
      };

      var eventsState = {
        name: "events",
        url: "/events",
        templateUrl: "Templates/Events.html",
        controller: function ($scope) {
          $scope.Greeting = "Events Page";
          $scope.Events = [];
          $scope.fib.db.ref("Events").once("value").then(function (snapshot) {

            snapshot.forEach(element => {
              var event = angular.copy(element.val());
              event.EventDate = moment(event.EventDate).format("DD MMMM dddd YYYY")
              $scope.Events.push(event)
            });
            $scope.$apply();
          })

          $scope.SetAttendeeType = function (type, title) {

            if (type === 0) {
              //gelemeyeceğim
              console.log(" //gelemeyeceğim")
              const key = $scope.fib.db.ref("EventAttendees").push().key;
              var Attendee = { Email: $scope.fib.auth.currentUser.email, Uid: $scope.fib.auth.currentUser.uid, Type: type, EventTitle: title }
              $scope.fib.db.ref("EventAttendees").child(key).set(Attendee);
            } else if (type === 1) {
              //geliyorum
              console.log(" //geliyorum")
            } else if (type === 2) {
              //gecikeceğim
              console.log(" //gecikeceğim")
            }

          }




        }
      };
      var eventCreateState = {
        name: "eventCreate",
        url: "/eventCreate",
        templateUrl: "Templates/eventCreate.html",
        controller: function ($scope) {
          $scope.Greeting = "Hello eventCreate Page";

          $scope.event = {};

          $scope.CreateEvent = function () {
            var eventToAdd = angular.copy($scope.event);
            eventToAdd.EventDate = moment(eventToAdd.EventDate).valueOf();
            console.log("Etkinşiğiniz oluşturulmuştur.--->", eventToAdd);
            const key = firebase
              .database()
              .ref("Events")
              .push().key;

            firebase
              .database()
              .ref("Events")
              .child(key)
              .set(eventToAdd)
              .then(() => {
                console.log("Event Kaydedildi.");
                $scope.event = {};
                $scope.$apply(); //ui 'ı güncelle
              });
          };
        }
      };

      $stateProvider.state(homeState);
      $stateProvider.state(aboutState);
      $stateProvider.state(vizyonState);
      $stateProvider.state(misyonState);
      $stateProvider.state(tuzukState);
      $stateProvider.state(signupState);
      $stateProvider.state(eventsState);
      $stateProvider.state(eventCreateState);

      $urlRouterProvider.otherwise("/home");
    });
  }
};

app.initialize();
