const { parse } = require("csv-parse");
const fs = require("fs");

const results = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

fs.createReadStream("kepler_data.csv")
  .pipe(
    parse({
      //pipe connects are readable stream(fs.createReadStream) to a writeable stream(parse())
      comment: "#",
      columns: true,
    })
  )
  .on("data", (chunk) => {
    if (isHabitablePlanet(chunk)) {
      results.push(chunk);
    }
  })
  .on("eror", (err) => {
    console.log(err);
  })
  .on("end", () => {
    console.log(results.map((planet) => planet["kepler_name"]));
    console.log(`${results.length} habitable planets found`);
  });
