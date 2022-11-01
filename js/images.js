const apiKey = "DEMO_KEY";
const queryString = document.location.search;
const params = new URLSearchParams(queryString);

async function fetchPhotos(rover, camera, sol) {
  camera = camera ? `&camera=${camera}` : "";
  sol = sol ? `&sol=${sol}` : "&sol=1";

  const apiUri = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?api_key=${apiKey}${camera}${sol}`;
  const imageContainer = document.querySelector(".image-container");

  try {
    const results = await (
      await fetch(apiUri, { cache: "force-cache" })
    ).json();

    imageContainer.innerHTML = `<h1>Images by ${rover}</h1>`;

    document.title = `Images by ${rover} - Mars Exploration Program`;

    if (results.photos.length === 0) {
      imageContainer.innerHTML += `<p><strong>No images found.</strong> Try to switch cameras in the camera menu.</p>`;
    }

    imageContainer.innerHTML += `<p>There were ${results.photos.length} photos taken.</p>`;

    results.photos.forEach((photo) => {
      const earthDate = new Date(photo.earth_date).toLocaleDateString();
      const altText = `Photo taken ${earthDate} by ${photo.rover.name} with ${photo.camera.full_name}`;

      imageContainer.innerHTML += `
                <div class="image-information">
                    <p>Photo taken with ${photo.camera.full_name}, on earth date ${earthDate}</p>
                    <img src="${photo.img_src}" alt="${altText}">
                </div>`;
    });
  } catch (error) {
    imageContainer.innerHTML = flash(
      "<strong>Sorry!</strong> Something went wrong while trying to fetch from the API.",
      "error"
    );
  }
}

async function populateMenus() {
  const apiUri = `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${apiKey}`;
  const results = await (await fetch(apiUri, { cache: "force-cache" })).json();

  const roverData = [];

  results.rovers.forEach((rover) => {
    roverData[rover.name] = {
      cameras: rover.cameras,
      max_sol: rover.max_sol,
      min_date: new Date(rover.landing_date),
      max_date: new Date(rover.max_date),
    };
  });

  populateRoverMenu(Object.keys(roverData));
  populateCameraMenu(roverData);
  populateDatePicker(roverData);
}

function populateRoverMenu(roverData) {
  const roverContainer = document.querySelector("#rover-navigation");

  roverContainer.innerHTML = "";
  roverData.forEach((rover) => {
    roverContainer.innerHTML += `<a href="images.html?rover=${rover}">${rover}</a>`;
  });
}

function populateCameraMenu(roverData) {
  const cameraContainer = document.querySelector("#camera-navigation");

  roverData[
    params.get("rover") ? params.get("rover") : "Spirit"
  ].cameras.forEach((camera) => {
    cameraContainer.innerHTML += `<a href="images.html?rover=${params.get(
      "rover"
    )}&camera=${camera.name}${
      params.get("sol")
        ? `&sol=${validateSol(
            roverData[params.get("rover")],
            params.get("sol")
          )}`
        : ""
    }">${camera.full_name}</a>`;
  });

  cameraContainer.innerHTML += `<a href="images.html?rover=${params.get(
    "rover"
  )}${
    params.get("sol") ? `&sol=${parseInt(params.get("sol"))}` : ""
  }">All Cameras</a>`;
}

function populateDatePicker(roverData) {
  const dateContainer = document.querySelector("#date-picker");

  const rover = roverData[params.get("rover") ? params.get("rover") : "Spirit"];

  const maxSol = rover.max_sol;
  const currentSol = validateSol(rover, params.get("sol"));

  const minDate = new Date(
    roverData[params.get("rover") ? params.get("rover") : "Spirit"].min_date
  );

  dateContainer.innerHTML = `
        <div class="date-links">
            <p>
                <a href="${
                  currentSol > 1
                    ? `images.html?rover=${params.get("rover")}${
                        params.get("camera")
                          ? `&camera=${params.get("camera")}`
                          : ""
                      }&sol=${currentSol - 1}`
                    : "#"
                }" ${currentSol == 1 ? "disabled" : ""} title="${minDate
    .addDays(currentSol - 1)
    .toLocaleDateString()}">
                    Previous
                </a>
            </p>
            
            <div class="current-date text-center">
                <p>Current Earth Date</p>
                <p>${minDate.addDays(currentSol).toLocaleDateString()}</p>
            </div>

            <p>
                <a href="${
                  currentSol < maxSol
                    ? `images.html?rover=${params.get("rover")}${
                        params.get("camera")
                          ? `&camera=${params.get("camera")}`
                          : ""
                      }&sol=${currentSol + 1}`
                    : "#"
                }" ${currentSol == maxSol ? "disabled" : ""} title="${minDate
    .addDays(currentSol + 1)
    .toLocaleDateString()}">Next</a>
            </p>
        </div>
        <div>
            <label for="to-date">Go to Mission day (Between: 1-${maxSol})</label>
            <input type="number" min="1" max="${maxSol}" id="to-date" class="form-field text-center" placeholder="Jump to mission day" value="${currentSol}">
            <button
                id="jump-to-date"
                class="btn primary">
                    Go to
            </button>
        </div>
        `;

  const gotoDate = document.querySelector("#to-date");
  const gotoDateButton = document.querySelector("#jump-to-date");

  gotoDateButton.addEventListener("click", () => {
    window.location.href = `images.html?rover=${params.get("rover")}${
      params.get("camera") ? `&camera=${params.get("camera")}` : ""
    }&sol=${validateSol(rover, gotoDate.value)}`;
  });
}

function validateSol(rover, sol) {
  const maxSol = parseInt(rover.max_sol);
  const minSol = 1;

  return parseInt(sol > maxSol ? maxSol : sol < minSol ? minSol : sol);
}

populateMenus();
fetchPhotos(params.get("rover"), params.get("camera"), params.get("sol"));
