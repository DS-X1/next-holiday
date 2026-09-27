// Set today's date as variable
let today = Temporal.Now.plainDateISO();
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

function daysUntil(date2) {
	date2 = Temporal.PlainDate.from(date2);
	
	const days = date2.since(today).days;
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
	let url = `https://nagerholidays.com/api/v4/Holidays/${countryCode}/${today.year}`;
	let holidays = await fetchData(url);
	
	//Get the next four holidays, store in nextFourHolidays variable
	nextFourHolidays = [];
	
	for (let i = 0; i < holidays.length; i++) {
		let currHolidayDate = Temporal.PlainDate.from(holidays[i].date);
		
		if (Temporal.PlainDate.compare(currHolidayDate, today) > 0 && nextFourHolidays.length < 4) {
			nextFourHolidays.push(holidays[i]);
		}
	}
	
	// Add in next year's holidays if there's less than 4 holidays left in this year
	if (nextFourHolidays.length < 4) {
		let url = `https://nagerholidays.com/api/v4/Holidays/${countryCode}/${today.year + 1}`;
		let holidays = await fetchData(url);
		
		for (let i = 0; i < holidays.length; i++) {
			let currHolidayDate = Temporal.PlainDate.from(holidays[i].date);
			
			if (nextFourHolidays.length < 4) {
				nextFourHolidays.push(holidays[i]);
			}
		}
	}
	console.log(url);
}

async function main(countryName, countryCode) {
	
	await getHolidays(countryCode);
	let daysRemaining = daysUntil(Temporal.PlainDate.from(nextFourHolidays[0].date));
	let nextHoliday = nextFourHolidays[0];
	
	//Populate days until and current holiday
	document.querySelector("#days-until").innerHTML = `${daysRemaining} days until...`;
	
	document.querySelector("#holiday-current-box").innerHTML = `${nextHoliday.name}! <br> ${parseSimpleDate(nextHoliday.date, true)}`;
	
	//Display country
	document.querySelector("#country-display").innerHTML = countryName;
	
	
	// SHOW NEXT HOLIDAYS
	
	// *Clear list if previous data left over
	for (let i=1; i < 4; i++) {
		document.querySelector(`#holiday-${i}-box`).innerHTML = '';
	}
	
	// Display upcoming holidays
	for (i=1;i < nextFourHolidays.length;i++) {
		currHoliday = nextFourHolidays[i];
		document.querySelector(`#holiday-${i}-box`).innerHTML = `${currHoliday.name} <br> ${parseSimpleDate(currHoliday.date, true)}`;
	}
	
}


//Display today's date
document.querySelector("#date-display").innerHTML = today.toLocaleString("en-US", {
	month: "long",
	day: "numeric",
	year: "numeric"});

//Changes country based on what user selected manually
document.querySelector("#countries").addEventListener("change", function () {
    [country, countryCode] = this.value.split("-");
	
	main(country, countryCode);
	console.log('COUNTRU');
  });
