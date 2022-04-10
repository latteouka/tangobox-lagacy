import urlencode from 'urlencode'
import crypto from 'crypto'

export const generateChecksum = (params: any) => {
  const hash = '5294y06JbISpM5x9'
  const hashiv = 'v77hoKGq4kWxNNIS'
  let od: any = {}
  let temp_arr = Object.keys(params).sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase())
  })
  let raw: any = temp_arr.forEach(function (key) {
    od[key] = params[key]
  })
  raw = JSON.stringify(od).toLowerCase().replace(/":"/g, '=')
  raw = raw.replace(/","|{"|"}/g, '&')
  raw = urlencode(`HashKey=${hash}${raw}HashIV=${hashiv}`).toLowerCase()
  console.log(raw)

  let encoded = raw.replace(/\'/g, '%27')
  encoded = encoded.replace(/\~/g, '%7e')
  encoded = encoded.replace(/\%20/g, '+')

  const chksum = crypto.createHash('sha256').update(encoded).digest('hex')
  console.log(chksum.toUpperCase())
  return chksum.toUpperCase()
}
