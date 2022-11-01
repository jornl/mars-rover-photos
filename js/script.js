async function fetchRovers() {
  const apiKey = "DEMO_KEY";
  const apiUri = `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${apiKey}`;
  const roverDataContainer = document.querySelector(".rover-data-container");
  const timelineDataContainer = document.querySelector(".page-timeline");

  try {
    const results = await (
      await fetch(apiUri, { cache: "force-cache" })
    ).json();

    /** Sort rovers based on launch_date-field. */
    const rovers = Object.entries(results)[0][1].sort((a, b) =>
      a.launch_date > b.launch_date ? 1 : -1
    );

    /** Manipulate API data to contain more information about the rovers */
    rovers[0].links = rovers[1].links = [
      // Grouping Spirit and Opportunity rovers, since all their resources are the same.
      {
        url: "https://mars.nasa.gov/mars-exploration/missions/mars-exploration-rovers/",
        external: true,
        description: `Read about Mars Exploration Rovers' mission`,
      },
      {
        url: "https://mars.nasa.gov/mer/mission/overview/",
        external: true,
        description: `Read about Mars Exploration Rovers' overview`,
      },
    ];

    rovers[2].links = [
      {
        url: "https://mars.nasa.gov/msl/home/",
        external: true,
        description: `Read about ${rovers[3].name}`,
      },
      {
        url: "https://mars.nasa.gov/mars-exploration/missions/mars-science-laboratory/",
        external: true,
        description: `Read about ${rovers[3].name}s mission`,
      },
    ];

    rovers[3].links = [
      {
        url: "https://mars.nasa.gov/mars2020/",
        external: true,
        description: `Read about ${rovers[3].name}`,
      },
      {
        url: "https://mars.nasa.gov/mars-exploration/missions/mars2020/",
        external: true,
        description: `Read about ${rovers[3].name}s mission`,
      },
    ];

    timelineDataContainer.innerHTML = "";
    roverDataContainer.innerHTML = "";

    rovers.forEach((rover, index) => {
      // Create a new Date from date-string
      const landingDate = new Date(Date.parse(rover.landing_date));
      const launchDate = new Date(Date.parse(rover.launch_date));

      // Format the date for the user viewing the page
      rover.max_date = new Date(
        Date.parse(rover.max_date)
      ).toLocaleDateString();
      rover.landing_date = landingDate.toLocaleDateString();
      rover.launch_date = launchDate.toLocaleDateString();

      // Subtract time between landing and launch to get time in milliseconds
      // Divide by 1000 to convert to seconds
      // Multiply by 3600 to convert to hours
      // Multiply by 24 to convert to days
      // Multiply by 365 to convert to years
      const timeInSpace =
        (landingDate.getTime() - launchDate.getTime()) / (1000 * 3600 * 24);
      const timeOnMars = Math.floor(
        (new Date().getTime() - landingDate.getTime()) / (1000 * 3600 * 24)
      );

      const status =
        rover.status === "active"
          ? `${rover.name} is still active today, and has taken ${rover.total_photos} photos on Mars.`
          : `${rover.name}'s mission ended on ${rover.max_date}, after taking ${rover.total_photos} photos on Mars.`;

      timelineDataContainer.innerHTML += `<div class="timeline-object ${rover.name}">
                    <img src="images/${rover.name}.jpg" alt="Image of ${rover.name} rover" class="active-object" data-target="${rover.name}">
                    <p class="text-center">${rover.landing_date}</p>
                </div>`;

      if (index !== rovers.length - 1) {
        timelineDataContainer.innerHTML += `<div class="timeline-strike"></div>`;
      }

      roverDataContainer.innerHTML += `<article class="rover" id="${
        rover.name
      }">
                    <h1 class="rover-name uppercase">${rover.name}</h1>
                    
                    <div class="rover-mission-objective">
                        <p>${rover.name} landed on mars ${
        rover.landing_date
      }, after a ${timeInSpace} days long journey to Mars.</p>
                        <p>It has been ${timeOnMars} days (${(
        timeOnMars / 365
      ).toFixed(1)} years) since ${rover.name} landed on Mars.</p>
                        <p>${status}</p>
                        
                        ${
                          rover.links
                            ? rover.links
                                .map((link) => {
                                  return `<p class="rover-links"><a href="${
                                    link.url
                                  }">
                                        ${
                                          link.external === true
                                            ? `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path></svg>`
                                            : ""
                                        }
                                        ${link.description}
                                    </a></p>`;
                                })
                                .join("")
                            : ""
                        }
                    </div>

                    <h2 class="rover-facts uppercase">Cameras</h2>
                    <div class="rover-stats">
                        <p>${rover.name} has ${
        rover.cameras.length
      } cameras.</p>
                        <ul>
                            ${rover.cameras
                              .map((camera) => `<li>${camera.full_name}</li>`)
                              .join("")}
                        </ul>
                    </div>

                    <a href="images.html?rover=${
                      rover.name
                    }" class="btn primary">Browse Photos</a>
                </article>`;
    });

    const timelineObjects = document.querySelectorAll(".timeline-object");
    timelineObjects.forEach((element) =>
      element.addEventListener("click", (event) => {
        scrollIntoView(event.target.dataset.target);
      })
    );
  } catch (error) {
    timelineDataContainer.innerHTML = "";
    roverDataContainer.innerHTML = flash(
      "<strong>Sorry!</strong> Something went wrong while trying to fetch from the API.",
      "error"
    );
    console.log(error);
  }
}

function scrollIntoView(rover) {
  const activeRover = document.querySelector(`.timeline-object.selected`);
  const timelineElement = document.querySelector(`.timeline-object.${rover}`);
  const roverElement = document.querySelector(`#${rover}`);

  document.title = `Information about ${rover} - Mars Exploration Program`;

  if (activeRover) {
    activeRover.classList.remove("selected");
  }

  timelineElement.classList.add("selected");

  window.scrollTo(0, roverElement.offsetTop - 150);
}

fetchRovers();
