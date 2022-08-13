const { smartTrim } = require('../helpers');
const { stripHtml } = require('string-strip-html')


const equal = (message, value, value2) => {
  message =  value === value2 ? `[+] Success: ${message}` : `[-] Error: ${message}`
  console.log(message)
}

(function () {
  const data = 'thu nghiem   123'
  equal('Case 1', smartTrim(data, 8), 'thu...')
  equal('Case 2', smartTrim(data, 11), 'thu nghiem...')
  equal('Case 3', smartTrim(data, 12), 'thu nghiem...')
  equal('Case 4', smartTrim(data, 14), 'thu nghiem...')

  console.log(stripHtml('<p>Toi la ai: </p> toi den day lam gi, toi dang lam gi <i').result)

  console.log(['1', '2'].join(' | '))
})()


