async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Fetch error:", error);
  }
}


//Fetch country holiday data
async function getHolidays (countryCode) {
	let url = `https://nagerholidays.com/api/v4/Holidays/${countryCode}/2026`;
	let holidays = await fetchData(url);
	console.log(holidays);
}

getHolidays('LC');


//Display today's date
let today = new Date().toLocaleString("en-US", {
	weekday: "long",
	month: "long",
	day: "numeric"});
	
document.querySelector("#date-display").innerHTML = today;
