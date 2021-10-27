const axios = require('axios').default
const express = require('express')
const cors = require('cors')
const app = express()

const port = 8000

app.use(cors())

// TODO: Review and compare with cors-anywhere implementation.
app.get('/:url(https?:\/\/[a-zA-Z\.\-0-9\/]*)', async (req, res) => {
  const url = req.params.url
  console.log(`Received URL ${url}`)

  // Forward headers on.
  const headers = req.headers
  headers['host'] = new URL(url).host
  const options = {
    headers: headers,
  }

  try {
    const urlResponse = await axios.get(url, options)
    console.log(urlResponse.status)

    // Set the headers from the URL response.
    const responseHeaders = urlResponse.headers
    for (const header in responseHeaders) {
      res.set(header, responseHeaders[header])
    }

    res.send(urlResponse.data)
    return
  }
  catch (error) {
    console.error(`Error with URL ${url}`)
    console.error(error)
    // TODO: Review this status code.
    res.status(422)
    res.json(error)
    return
  }

});

app.get('/', (req, res) => {
  res.send('cors-proxy home')
})

app.listen(port, () => {
  console.log(`cors-proxy listening on port ${port}`)
})

module.exports = app