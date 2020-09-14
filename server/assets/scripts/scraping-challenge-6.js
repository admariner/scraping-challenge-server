"phantombuster command: node"
"phantombuster package: 5"
// Save all files at the end of the script
"phantombuster flags: save-folder"

const Buster = require("phantombuster")
const buster = new Buster()
const puppeteer = require("puppeteer")

// Simple scraping function, getting all the infos using jQuery and returning them with the callback "done"
const scrape = () => {
	const data = $("div.person > div.panel-body").map(function(){
		return {
			name: $(this).find(".name").text().trim(),
			birth_year: $(this).find(".birth_year").text().trim(),
			death_year: $(this).find(".death_year").text().trim(),
			gender: $(this).find(".gender").text().trim(),
			marital_status: $(this).find(".marital_status").text().trim(),
			spouse: $(this).find(".spouse").text().trim(),
			pclass: $(this).find(".pclass").text().trim(),
			ticket_num: $(this).find(".ticket_num").text().trim(),
			ticket_fare: $(this).find(".ticket_fare").text().trim(),
			residence: $(this).find(".residence").text().trim(),
			job: $(this).find(".job").text().trim(),
			companions_count: $(this).find(".companions_count").text().trim(),
			cabin: $(this).find(".cabin").text().trim(),
			first_embarked_place: $(this).find(".first_embarked_place").text().trim(),
			destination: $(this).find(".destination").text().trim(),
			died_in_titanic: $(this).find(".died_in_titanic").text().trim(),
			body_recovered: $(this).find(".body_recovered").text().trim(),
			rescue_boat_num: $(this).find(".rescue_boat_num").text().trim()
		}
	})
	return $.makeArray(data)
}

;(async () => {
	// Init browser environment
	const browser = await puppeteer.launch({
		// This is needed to run Puppeteer in a Phantombuster container
		args: ["--no-sandbox"]
	})
	const page = await browser.newPage()
	// Set the required cookie in order to access the page
	await page.setCookie({
	    name: "phantomCookie",
	    value: "sample_value",
	    domain: "scraping-challenges.phantombuster.com",
	})
	// Open the webpage
	await page.goto("http://scraping-challenges.phantombuster.com/cookies")
	// Wait for the data to be visible
	await page.waitForSelector(".person > .panel-body")
	// Inject jQuery to manipulate the page easily
	await page.addScriptTag({ path: "../injectables/jquery-3.0.0.min.js" })
	// Launch the scrape function in the page context
	const result = await page.evaluate(scrape)
	// Take a screenshot of the whole page
	await page.screenshot({ path: "screenshot.jpg" })
	// Send the data in the result object
	await buster.setResultObject(result)
	// Exit the programm without errors
	process.exit()
})()
.catch((err) => {
	console.log(`Something went wrong: ${err}`)
	// Exit the programm with errors
	process.exit(1)
})
