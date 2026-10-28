var navLinks = document.querySelectorAll(".nav-link");
var sections = document.querySelectorAll(".app-section");

navLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    var sectionId = link.getAttribute("data-section");

    sections.forEach(function (section) {
      section.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");
  });
});



async function getSpaceImage() {
  try {
    var res = await fetch(
      "https://api.nasa.gov/planetary/apod?api_key=kGtgFQRk6nKWWr78Tq68RWPHNhFqkCpdCpKfgNMR"
    );

    var data = await res.json();

    console.log(data);

    document.getElementById("apod-title").innerHTML = data.title;

    document.getElementById("apod-date").innerHTML = data.date;
    document.getElementById("apod-date-detail").innerHTML = data.date;
    document.getElementById("apod-date-info").innerHTML = data.date;

    document.getElementById("apod-explanation").innerHTML =
      data.explanation;

    document.getElementById("apod-copyright").innerHTML =
      data.copyright || "NASA";

    document.getElementById("apod-media-type").innerHTML =
      data.media_type;

    if (data.media_type === "image") {
      document.getElementById("apod-image").src = data.url;
    }

  } catch (error) {
    console.log(error);
  }
}

getSpaceImage();















async function getLaunches() {
  var container = document.getElementById("launches-grid");

  try {
    var res = await fetch(
      "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10&mode=normal&format=json"
    );

    if (!res.ok) {
      throw new Error("Failed to load launches: " + res.status);
    }

    var data = await res.json();

    console.log("Launches:", data);

    container.innerHTML = "";

    data.results.forEach(function (launch) {
      var launchDate = launch.net
        ? new Date(launch.net).toLocaleString()
        : "Date to be announced";

      var rocketName =
        launch.rocket?.configuration?.full_name || "Unknown rocket";

      var provider =
        launch.launch_service_provider?.name || "Unknown provider";

      var location =
        launch.pad?.location?.name || "Unknown location";

      var image = launch.image;

      container.innerHTML += `
        <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
          ${image
          ? `<img src="${image}" alt="${launch.name}" class="w-full h-48 object-cover">`
          : `<div class="h-48 flex items-center justify-center bg-slate-900">
                   <i class="fas fa-rocket text-5xl text-slate-600"></i>
                 </div>`
        }

          <div class="p-5">
            <h3 class="font-bold text-lg mb-3">
              ${launch.name}
            </h3>

            <p class="text-sm text-slate-400 mb-2">
              <i class="fas fa-building mr-2"></i>
              ${provider}
            </p>

            <p class="text-sm text-slate-400 mb-2">
              <i class="fas fa-rocket mr-2"></i>
              ${rocketName}
            </p>

            <p class="text-sm text-slate-400 mb-2">
              <i class="fas fa-calendar mr-2"></i>
              ${launchDate}
            </p>

            <p class="text-sm text-slate-400">
              <i class="fas fa-map-marker-alt mr-2"></i>
              ${location}
            </p>
          </div>
        </div>
      `;
    });

    var count = data.results.length;
    document.getElementById("launches-count").textContent =
      count + " Launches";

    document.getElementById("launches-count-mobile").textContent =
      count;

  } catch (error) {
    console.log("Launches error:", error);
    container.innerHTML =
      '<p class="text-red-400">Could not load launches. Please try again.</p>';
  }
}

getLaunches();




var planetsData = [];

async function getPlanets() {
  try {
    var res = await fetch(
      "https://solar-system-opendata-proxy.vercel.app/api/planets"
    );

    if (!res.ok) {
      throw new Error("Failed to load planets: " + res.status);
    }

    var data = await res.json();

    planetsData = data.bodies;

    console.log("Planets:", planetsData);

    var cards = document.querySelectorAll(".planet-card");

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        var planetId = card.getAttribute("data-planet-id");

        var planet = planetsData.find(function (item) {
          return item.englishName.toLowerCase() === planetId;
        });

        if (planet) {
          showPlanet(planet);
        }
      });
    });


    var earth = planetsData.find(function (planet) {
      return planet.englishName === "Earth";
    });

    if (earth) {
      showPlanet(earth);
    }

  } catch (error) {
    console.log("Planets error:", error);
  }
}

function showPlanet(planet) {
  document.getElementById("planet-detail-name").textContent =
    planet.englishName;

  document.getElementById("planet-detail-description").textContent =
    planet.englishName +
    " is a planet in our Solar System.";

  document.getElementById("planet-distance").textContent =
    planet.semimajorAxis
      ? (planet.semimajorAxis / 1000000).toFixed(2) + "M km"
      : "N/A";

  document.getElementById("planet-radius").textContent =
    planet.meanRadius
      ? planet.meanRadius.toLocaleString() + " km"
      : "N/A";

  document.getElementById("planet-mass").textContent =
    planet.mass
      ? (
        planet.mass.massValue *
        Math.pow(10, planet.mass.massExponent)
      ).toExponential(2) + " kg"
      : "N/A";

  document.getElementById("planet-density").textContent =
    planet.density ? planet.density + " g/cm³" : "N/A";

  document.getElementById("planet-orbital-period").textContent =
    planet.sideralOrbit
      ? planet.sideralOrbit.toFixed(2) + " days"
      : "N/A";

  document.getElementById("planet-rotation").textContent =
    planet.sideralRotation
      ? planet.sideralRotation.toFixed(2) + " hours"
      : "N/A";

  document.getElementById("planet-moons").textContent =
    planet.moons ? planet.moons.length : "0";

  document.getElementById("planet-gravity").textContent =
    planet.gravity + " m/s²";

  document.getElementById("planet-discoverer").textContent =
    planet.discoveredBy || "Known since antiquity";

  document.getElementById("planet-discovery-date").textContent =
    planet.discoveryDate || "Unknown";

  document.getElementById("planet-body-type").textContent =
    planet.bodyType || "Planet";

  document.getElementById("planet-volume").textContent =
    planet.vol
      ? (
        planet.vol.volValue *
        Math.pow(10, planet.vol.volExponent)
      ).toExponential(2) + " km³"
      : "N/A";

  document.getElementById("planet-detail-image").src =
    "./images/" + planet.englishName.toLowerCase() + ".png";
}

getPlanets();


