var assert = require('assert')
var Stripe = require('stripe')
var unixTime = require('unix-time')
var Charges = require('./charges')

module.exports = StripeCharges

function StripeCharges (key, options) {
  if (!(this instanceof StripeCharges)) return new StripeCharges(key, options)
  assert.ok(key, 'Stripe requires a key.')
  this.stripe = Stripe(key)
  this.options = Object.assign({ limit: 100 }, options)
}

StripeCharges.prototype.get = function (start, end, opts, cb) {
  if (!(start instanceof Date)) throw new Error('Start must be a date.')
  if (!(end instanceof Date)) throw new Error('End must be a date.')
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  var self = this
  var charges = []
  paginateQuery(opts.startingAfter)

  function paginateQuery (lastId) {
    self._query(start, end, lastId, function (err, res) {
      if (err) return cb(err)
      charges.push.apply(charges, res.data)
      // check if we grabbed everything in the first query
      if (!res.has_more) return done()

      // there's more, we have to paginate query
      var lastId = res.data[res.data.length - 1].id
      paginateQuery(lastId)
    })
  }

  function done () {
    cb(null, new Charges(charges, { fee: self.options.fee }))
  }
}

StripeCharges.prototype._query = function (start, end, startingAfter, cb) {
  var opts = {
    created: { gte: unixTime(start), lte: unixTime(end) },
    limit: this.options.limit
  }
  if (startingAfter) opts.starting_after = startingAfter
  this.stripe.charges.list(opts, function (err, res) {
    if (err) return cb(err)
    cb(null, res)
  })
}
