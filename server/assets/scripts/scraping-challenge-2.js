// Phantombuster configuration {

"phantombuster command: nodejs"
"phantombuster package: 4"
"phantombuster flags: save-folder" // Save all files at the end of the script

const Buster = require("phantombuster")
const buster = new Buster()

const Nick = require("nickjs")
const nick = new Nick()

// }

// Set the base url to exploit the pagination in the url path to explore all pages
const baseUrl = "http://scraping-challenges.phantombuster.com/pagination?page="

// Simple scraping function, getting all the infos using jQuery and returning them with the callback "done"
const scrape = (arg, done) => {
	var data = $("div.person > div.panel-body").map(function () {
		return({
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
	done(null, $.makeArray(data))
}

// Same function in challenge 1 but in a function to reuse it
const scrapePage = async (tab, url) => {
	await tab.open(url)
	await tab.waitUntilVisible(".panel-body")
	await tab.inject("../injectables/jquery-3.0.0.min.js")
	const data = await tab.evaluate(scrape)
	return data
}

// Loop to get all data by concataining it in res
const scrapeAllPages = async () => {
	let res = []
	// Create a tab to load pages
	const tab = await nick.newTab()
	// There is 50 pages so we loop 50 times
	for (let i = 0; i < 50; i++) {
		res = res.concat(await scrapePage(tab, baseUrl+i))
	}
	await tab.close()
	await buster.setResultObject(res)
	nick.exit(0)
}

scrapeAllPages()
.catch((err) => {
	console.log(`Something went wrong: ${err}`)
	nick.exit(1)
})