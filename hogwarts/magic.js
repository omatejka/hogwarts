const lineSeparator = '==='
const subStartDelimiter = 'Rp'
const subEndDelimiter = 'Qt'
const readMode = 'r'

function assocIn(obj, path, value) {
  return path.reduce((branch, k, index) => {
    if (index === path.length - 1 && value) {
      branch[k] = value
      return obj
    }
    return branch[k]
  }, obj)
}

function indexToCode(index) {
  const loc = ['aQ', 'bC', 'cT', 'dR', 'eQ', 'fG', 'gs', 'h2', 'i4', 'j6']
  return subStartDelimiter + (index + '').split('').reduce((r, c) => r + loc[c], '') + subEndDelimiter
}

function magic(o, r, h, m = readMode) {
  let i = -1
  let cacheIndex = 1000

  function w(v) {
    if (typeof v !== 'string') return v

    if (m === readMode) {
      return ['<.+?>', '\{.+?\}', '\%.\%?', '\n'].reduce((v, pattern) => {
        return v.replace(new RegExp(pattern, 'g'), (match) => {
          const index = indexToCode(cacheIndex++)
          h[index] = match
          return index
        })
      }, v)
    }

    return v.replace(new RegExp(subStartDelimiter + '[a-zA-Z0-9]+?' + subEndDelimiter, 'g'), (code) => {
      return h[code + '']
    })
  }

  function $(oo, p = []) {
    if (typeof oo === 'object') {
      Object.keys(oo).forEach((k) => {
        $(oo[k], p.concat([k]))
      })
    } else {
      i = i + 1
      if (m === readMode) {
        r.push(w(oo))
      } else {
        assocIn(o, p, w(r[i]))
      }
    }
  }

  $(o)
}

function read(file) {
  const r = []
  const o = require(file)
  magic(o, r, {}, 'r')

  r.forEach((l) => {
    console.log(l)
    console.log(lineSeparator)
  })
}

function write(file) {
  const r = []
  const lr = require('readline').createInterface({
    input: require('fs').createReadStream('goog_o.txt')
  })
  lr.on('line', (l) => {
    if (l !== lineSeparator) r.push(l)
  })
  lr.on('close', () => {
    const o = require(file)
    const h = {}
    magic(o, [], h, 'r')
    magic(o, r, h, 'w')
    console.log(JSON.stringify(o, null, 2))
  })
}

if (process.argv.length < 4) {
  console.log('node magic <mode> <file>')
  process.exit(1)
}

const file = process.argv[3]

process.argv[2] === readMode ? read(file) : write(file)
