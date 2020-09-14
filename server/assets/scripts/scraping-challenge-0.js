"phantombuster command: node"
"phantombuster package: 5"
// Save all files at the end of the script
"phantombuster flags: save-folder"

const Buster = require("phantombuster")
const buster = new Buster()

;(async () => {
	// Download the link directly and save it using the flag "save-folder"
	await buster.download("http://scraping-challenges.phantombuster.com/csv/export", "export.csv")
	process.exit()
})()
.catch((err) => {
	console.log(`Something went wrong: ${err}`)
	process.exit(1)
})