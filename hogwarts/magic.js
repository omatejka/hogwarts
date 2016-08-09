function assocIn(o, path, v) {
  return path.reduce((oo, k, i) => {
    if (i === path.length - 1) {
      oo[k] = v
      return o
    }
    return oo[k]
  }, o)
}

function magic(o, r, m = 'r') {
  let i = -1

  function $(oo, p = []) {
    if (typeof oo === 'object') {
      Object.keys(oo).forEach((k) => {
        $(oo[k], p.concat([k]))
      })
    } else {
      i = i + 1
      if (m === 'r') {
        r.push(oo.replace(/\n/g, ' '))
      } else {
        assocIn(o, p, r[i])
      }
    }
  }

  $(o)
}

function s(l) {
  return l
    .replace(/<[ ]*\/[ ]*([a-zA-Z0-9]+)[ ]*>/g, (_, t) => '</' + t.toLowerCase() + '>')
    .replace(/<([a-zA-Z0-9]+)[ ]*([a-z]+[ ]*\=[ ]*\'.+?\')?>/g, (_, t, b = '') => {
      return '<' + t.toLowerCase() + (b === '' ? '' : ' ') + b.replace(/\'/g, '"').replace(/ = /g, '=') + '>'
    })
    .replace(/% ([a-zA-Z])/g, '%$1')
}

function read() {
  const r = []
  const o = require('./src/server/locales/en.json')
  magic(o, r, 'r')

  r.forEach((l) => {
    console.log(l);
    console.log('===')
  })
}

function write() {
  const r = []
  const lr = require('readline').createInterface({
    input: require('fs').createReadStream('goog_o.txt')
  })
  lr.on('line', (l) => {
    if (l !== '===') r.push(s(l))
  })
  lr.on('close', () => {
    const o = require('./src/server/locales/en.json')
    magic(o, r, 'w')
    console.log(JSON.stringify(o, null, 2))
  })
}

//read()
write()
