const dgram = require('dgram')

function parseData(buffer) {
  const data = buffer.slice(18).toString('ascii').split('\\')
  const server = {}

  for (let i = 0; i < data.length; i += 2) {
    server[data[i]] = Number(data[i + 1])
  }
  return server
}

function queryServer(ip, port, callback) {
  if (!ip || !port)
    callback(true)
  if (!callback)
    return

  const client = dgram.createSocket('udp4')
  const req = Buffer.from('\xFF\xFF\xFF\xFFgetinfo xxx', 'ascii')

  client.on('message', (message, remote) => {
    callback(false, parseData(message))
    client.close()
  })

  client.send(req, 0, req.length, port, ip, (err) => {
    if (err) {
      console.error(err)
      callback(true)
    }
  })
}

module.exports.query = queryServer
