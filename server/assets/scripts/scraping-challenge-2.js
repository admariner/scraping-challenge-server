"phantombuster command: nodejs"
"phantombuster package: 5"
// Save all files at the end of the script
"phantombuster flags: save-folder"

const Buster = require("phantombuster")
const buster = new Buster()
const puppeteer = require("puppeteer")

// Set the base url to exploit the pagination in the url path to explore all pages
const baseUrl = "http://scraping-challenges.phantombuster.com/pagination?page="

// Simple scraping function, getting all the infos using jQuery and returning them with the callback "done"
const scrape = () => {
	const data = $("div.person > div.panel-body").map(function() {
		return ({
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
		})
	})
	return $.makeArray(data)
}

// Same function in challenge 1 but in a function to reuse it
const scrapePage = async (page, url) => {
	await page.goto(url)
	await page.waitForSelector(".panel-body")
	// Inject jQuery to manipulate the page easily
	await page.addScriptTag({ path: "../injectables/jquery-3.0.0.min.js" })
	const data = await page.evaluate(scrape)
	return data
}

// Loop to get all data by concataining it in res
const scrapeAllPages = async () => {
	// Init browser environment
	const browser = await puppeteer.launch({
		// This is needed to run Puppeteer in a Phantombuster container
		args: ["--no-sandbox"]
	})
	const page = await browser.newPage()
	let res = []
	// There are 50 pages so we loop 50 times
	for (let i = 0; i < 50; i++) {
		res = res.concat(await scrapePage(page, baseUrl + i))
	}
	await page.close()
	await buster.setResultObject(res)
}

scrapeAllPages()
	.then(() => {
		console.log("Everything went fine!")
		process.exit(0)
	})
	.catch((err) => {
		console.log(`Something went wrong: ${err}`)
		process.exit(1)
	})