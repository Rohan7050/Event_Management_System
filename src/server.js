const app = require("./app")
const dotenv = require("dotenv");
const connectDatabase = require("./config/database")
const path = require("path");

dotenv.config({ path: "src/config/config.env" })

connectDatabase()

app.listen(process.env.PORT || 3000, () => {
    console.log(`listening on port ${process.env.PORT || 3000}`)
}) 