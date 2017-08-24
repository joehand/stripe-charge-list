var ChargeList = require('.')

var list = ChargeList('stripe-key', {
  limit: 100,
  // fee: Only need to be set if different from default (2.9%, $0.30)
  fee: {
    pct: 0.022, // nonprofit fees =)
    amt: 0.3
  }
})

list.get(new Date('1/1/2017'), new Date('12/31/2017'), (err, charges) => {
  if (err) return console.error(err)
  console.log('Received $' + charges.total() + ' in 2017!')

  const filteredCharges = charges.filter(function (charge) {
    return charge.description.indexOf('Donation to') > -1
  })
  console.log('Donations Only:')
  filteredCharges.print()
})
