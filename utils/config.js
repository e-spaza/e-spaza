require('dotenv').config()

const port = process.env.port
const uri = process.env.uri
console.log(port, uri)

module.exports ={
    uri,
    port
}