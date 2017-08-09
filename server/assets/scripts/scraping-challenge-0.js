// Phantombuster configuration {

"phantombuster command: nodejs"
"phantombuster package: 4"
"phantombuster flags: save-folder" // Save all files at the end of the script

const Buster = require("phantombuster")
const buster = new Buster()

const Nick = require("nickjs")
const nick = new Nick()

// }

;(async () => {
	// Download the link directly and save it using the flag "save-folder"
	const x = await buster.download("http://scraping-challenges.phantombuster.com/csv/export", "export.csv")
	nick.exit()
})()
.catch((err) => {
	console.log(`Something went wrong: ${err}`)
	nick.exit(1)
})