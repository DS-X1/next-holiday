// Set today's date as variable
let today = new Date();
let nextFourHolidays = [];

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

function daysBetween(date1, date2) {
	date1.setUTCHours(0, 0, 0, 0);
	date2.setUTCHours(0, 0, 0, 0);
	
	let days = Math.round((date1-date2) / (1000 * 60 * 60 * 24));
	return days;
}

function parseSimpleDate(date, utc) {
	
	date = new Date(date);
	
	if (utc) {
		return date.toLocaleString("en-US", {
		timeZone: "UTC",
		month: "long",
		day: "numeric",
		year: "numeric"});
	}
	
	return date.toLocaleString("en-US", {
	month: "long",
	day: "numeric",
	year: "numeric"});
}


//Fetch country holiday data
async function getHolidays (countryCode) {
	let url = `https://nagerholidays.com/api/v4/Holidays/${countryCode}/2026`;
	let holidays = await fetchData(url);
	
	//Get the next four holidays, store in nextFourHolidays variable
	for (let i = 0; i < holidays.length; i++) {
		let currHolidayDate = new Date(holidays[i].date + "T00:00:00Z");
		
		if (today <= currHolidayDate && nextFourHolidays.length < 4) {
			nextFourHolidays.push(holidays[i]);
		}
	}
}

async function main() {
	await getHolidays('LC');
	console.log(nextFourHolidays);
	let daysUntil = daysBetween(new Date(nextFourHolidays[0].date), today);
	let nextHoliday = nextFourHolidays[0];
	
	//testing
	console.log("today:", today);
	console.log("holiday:", new Date(nextFourHolidays[0].date));
	console.log("difference:", daysUntil);
	
	//Populate days until and current holiday
	document.querySelector("#days-until").innerHTML = `${daysUntil} days until...`;
	
	document.querySelector("#holiday-current-box").innerHTML = `${nextHoliday.name}! <br> ${parseSimpleDate(nextHoliday.date, true)}`;
	
	for (i=1;i < 4;i++) {
		currHoliday = nextFourHolidays[i];
		document.querySelector(`#holiday-${i}-box`).innerHTML = `${currHoliday.name} <br> ${parseSimpleDate(currHoliday.date, true)}`;
	}
	
}

main();
//Display today's date
document.querySelector("#date-display").innerHTML = today.toLocaleString("en-US", {
	month: "long",
	day: "numeric",
	year: "numeric"});
