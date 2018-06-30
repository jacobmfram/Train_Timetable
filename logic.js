// Initialize Firebase
var config = {
    apiKey: "AIzaSyCe8WlG3zEBex3Eefdu4YtmxjAPBuRzZlY",
    authDomain: "trainsched-92a28.firebaseapp.com",
    databaseURL: "https://trainsched-92a28.firebaseio.com",
    projectId: "trainsched-92a28",
    storageBucket: "",
    messagingSenderId: "697647917209"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  var nextArr = 0;

  // Writes user input to firebase database
$(document.body).on("click", "#submit", function(){
    var trainName = $("#train_name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTime = $("#first_time").val().trim();
    var frequency = $("#frequency").val().trim();
    var newTrain = {
        train: trainName,
        dest: destination,
        first: firstTime,
        freq: frequency
    };
    database.ref('Trains/' + trainName).push(newTrain);

});

// Adds user inputted values to timetable. Arithmetic with moment js doesn't work. I've tried many variations of the code below but this is the closest I could get.
database.ref('Trains/').on("child_added", function(snapshot){
    var first = moment(snapshot.val().first);
    var now = moment();
    while(String(moment.duration(now.diff(nextArr))).slice(-3) === "ago"){
        nextArr = first.add(frequency, "minutes");
    };

    var untilNextArr = now.diff(nextArr, "minutes");

    $("#train-table").append("<tr><td>" + snapshot.val().train + "</td><td>" + snapshot.val().dest + "</td><td>" + snapshot.val().freq + "</td><td>" + nextArr + "</td><td>" + untilNextArr + "</td></tr>");
});

// Clears table
function clearTable() {
    $("#train-table").html("");
};

// Updates table
$(document.body).on("click", "#update", function(){
    clearTable();
    database.ref('Trains/').on("child_added", function(snapshot){
        var first = moment(snapshot.val().first);
        var now = moment();
        while(String(moment.duration(now.diff(nextArr))).slice(-3) === "ago"){
            nextArr = first.add(frequency, "minutes");
        };

        var untilNextArr = now.diff(nextArr, "minutes");

        $("#train-table").append("<tr><td>" + snapshot.val().train + "</td><td>" + snapshot.val().dest + "</td><td>" + snapshot.val().freq + "</td><td>" + nextArr + "</td><td>" + untilNextArr + "</td></tr>");
    });
});