// function for a random int within a range

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// initial global vars
var clevel = 1
var cstage = 1
var remap = 0
var score = 0
var w = ""
mapboxgl.accessToken = 'meow';



// function for showing the map given a level and stage

function showMap(level, stage) {

  // generating an array of cities for this level, based on the level, stage criteria

  level_array = []

  if (level < 10) {
    for (var c in cities["features"]) {
      if (cities["features"][c]["properties"]["WORLDCITY"] > 0) {
        level_array.push(cities["features"][c])
      }
    }
  } else if (level >= 10 && level < 20) {
    for (var c in cities["features"]) {
      if (cities["features"][c]["properties"]["SCALERANK"] < 3) {
        level_array.push(cities["features"][c])
      }
    }
  } else if (level >= 20 && level < 30) {
    for (var c in cities["features"]) {
      if (cities["features"][c]["properties"]["MEGACITY"] > 0) {
        level_array.push(cities["features"][c])
      }
    }
  } else if (level >= 30 && level < 40) {
    for (var c in cities["features"]) {
      if (cities["features"][c]["properties"]["GN_POP"] > 3000000) {
        level_array.push(cities["features"][c])
      }
    }
  } else if (level >= 40 && level < 50) {
    for (var c in cities["features"]) {
      if (cities["features"][c]["properties"]["GN_POP"] > 2000000) {
        level_array.push(cities["features"][c])
      }
    }
  } else if (level >= 50 && level < 60)
  for (var c in cities["features"]) {
    if (cities["features"][c]["properties"]["SCALERANK"] < 5) {
      level_array.push(cities["features"][c])
    }
  }
  else {
    for (var c in cities["features"]) {
      if (cities["features"][c]["properties"]["SCALERANK"] < 12) {
        level_array.push(cities["features"][c])
      }
    }
  };


  // a random 4 cities from the array of cities

  rando_m0 = getRandomInt(0, level_array.length - 1)
  rando_m1 = getRandomInt(0, level_array.length - 1)
  while (rando_m1 === rando_m0) {
    rando_m1 = getRandomInt(0, level_array.length - 1)
  }
  rando_m2 = getRandomInt(0, level_array.length - 1)
  while (rando_m2 === rando_m0 || rando_m2 === rando_m1) {
    rando_m2 = getRandomInt(0, level_array.length - 1)
  }
  rando_m3 = getRandomInt(0, level_array.length - 1)
  while (rando_m3 === rando_m0 || rando_m3 === rando_m1 || rando_m3 === rando_m2) {
    rando_m3 = getRandomInt(0, level_array.length - 1)
  }


  // setting up an array of just these citeis

  var cities_select = [level_array[rando_m0],level_array[rando_m1],level_array[rando_m2],level_array[rando_m3]]


  // random city of these 4

  rando_i = getRandomInt(0, 3)

  p_score = score + 100 * (5 + 5 * (1 - cities_select[rando_i]["properties"]["WORLDCITY"]) + parseInt(cities_select[rando_i]["properties"]["SCALERANK"]))


  // setting up the map to centre on a City

  var cx = cities_select[rando_i]["geometry"]["coordinates"][0]
  var cy = cities_select[rando_i]["geometry"]["coordinates"][1]

  w = cities_select[rando_i]["properties"]["NAME"]

  var bounds = [
      [cx - 0.42, cy - 0.42], // Southwest
      [cx + 0.42, cy + 0.42]  // Northeast
  ];

  var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/jeffallen/cj8rwyt7obvqq2sr8ygoi9dh2', // stylesheet location
      center: [cx,cy], // starting position [lng, lat]
      zoom: 11.5, // starting zoom
      maxZoom: 16,
      minZoom: 11,
      // pitchWithRotate: false,
      maxBounds: bounds // Sets bounds as max
  });

  map.dragRotate._pitchWithRotate = false;

  // adding controls to the map

  if (level > 1 || remap > 0) {
    map.removeControl(nav)
    map.removeControl(bar)
  }

  nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'top-left');

  bar = new mapboxgl.ScaleControl({
    maxWidth: 100,
    unit: 'metric'
  });
  map.addControl(bar);


  // adding names to the form

  document.getElementById("p1").innerHTML = "<b>" + cities_select[0]["properties"]["NAME"] + "</b>, " + cities_select[0]["properties"]["ADM0NAME"]
  document.getElementById("p2").innerHTML = "<b>" + cities_select[1]["properties"]["NAME"] + "</b>, " + cities_select[1]["properties"]["ADM0NAME"]
  document.getElementById("p3").innerHTML = "<b>" + cities_select[2]["properties"]["NAME"] + "</b>, " + cities_select[2]["properties"]["ADM0NAME"]
  document.getElementById("p4").innerHTML = "<b>" + cities_select[3]["properties"]["NAME"] + "</b>, " + cities_select[3]["properties"]["ADM0NAME"]

};


// show the initial map

showMap(clevel,cstage)



// function for what happens when submit is clicked

function submitAnswers() {

  // messages for when somone answeres correct

  var yesses = ["Yes! Yes! Yes!","Indeed","Correct!","Si","Well Done!","Ole!",":)","Perfecto","Excellent!","Hooray!","Huzzah"]

  // grab the value of result (1 to 4)

  var q1 = document.forms['quizForm']['q1'].value;
  console.log(eval(q1))


  // if correct

  if (eval(q1) === rando_i + 1) {
    console.log("correcto")
    //update the level
    clevel = clevel + 1
    // show the next map
    showMap(clevel,cstage)

    // update the level
    var count_score = parseInt(document.getElementById("level").innerHTML) + 1
    document.getElementById("level").innerHTML = count_score + ""

    // update the score
    score = p_score
    document.getElementById("score").innerHTML = score + ""

    // display a correct message
    document.getElementById("message").innerHTML = yesses[getRandomInt(0, yesses.length - 1)]

    var sectionback = document.getElementById("section");
    sectionback.style.backgroundColor = "#FCFAF2";

    var sectionback = document.getElementById("att");
    sectionback.style.backgroundColor = "#FCFAF2";
  }

  // if wrong

  else {

    console.log("boourns")

    // say game over
    document.getElementById("message").innerHTML = "<b>Game Over :(</b> <br><br>&nbsp;the correct answer was<br>&nbsp;" + w + "<br><br>&nbsp;please restart"

    // assign high scores
    var escore = document.getElementById("hscore").innerHTML
    var elevel = document.getElementById("hlevel").innerHTML

    if (clevel > elevel) {
      document.getElementById("hlevel").innerHTML = (clevel - 1) + ""
    }

    if (score > escore) {
      document.getElementById("hscore").innerHTML = score + ""
    }

    // refresh scores and start the game over again
    clevel = 1
    cstage = 1
    remap = 1
    p_score = 0
    score = 0
    showMap(clevel,cstage)
    document.getElementById("score").innerHTML = "0"
    document.getElementById("level").innerHTML = "1"

    // set background-color
    var sectionback = document.getElementById("section");
    sectionback.style.backgroundColor = "#FF9D70";

    var sectionback = document.getElementById("att");
    sectionback.style.backgroundColor = "#FF9D70";

    // if score
    // document.getElementById("code").innerHTML = "<br>your final score was " + score + "<br> that's quite shite <br>";

  }

  return false;
}
