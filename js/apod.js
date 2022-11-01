const date = new Date().subDays(5);
const pictureDay = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
const apodContainer = document.querySelector(".apod-data");
const apiKey = "DEMO_KEY";

apiUri = `https://api.nasa.gov/mars-photos/api/v1/rovers/Perseverance/photos?api_key=${apiKey}&earth_date=${pictureDay}`;

async function fetchPictureOfTheDay() {
  try {
    const results = await (
      await fetch(apiUri, { cache: "force-cache" })
    ).json();
    const photo = Math.floor(Math.random() * results["photos"].length);

    if (results["photos"][photo].img_src) {
      apodContainer.innerHTML = `
                <img src="${results["photos"][photo].img_src}" alt="Photo taken by Perseverance on ${pictureDay}" id="image">
                <small class="mt-0 right"><i>Click the picture to fetch a new one</i></small>
                <p>This picture was taken on ${pictureDay} by Perseverance, with the ${results["photos"][photo].camera.full_name}.</p>
            `;
    } else {
      apodContainer.innerHTML = `
                <img src="images/Perseverance.jpg" alt="Illustration photo of Perseverance">
                <p class="mt-0">Unfortunally no photo taken by the rover was found today. :-(</p>
            `;
    }

    const image = document.querySelector("#image");
    image.addEventListener("click", () => {
      fetchPictureOfTheDay();
    });
  } catch (error) {
    apodContainer.innerHTML = flash(
      "<strong>Sorry!</strong> Something went wrong while trying to fetch from the API.",
      "error"
    );
  }
}

fetchPictureOfTheDay();
