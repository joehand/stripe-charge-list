module.exports = Charges

function Charges (charges, opts) {
  if (!(this instanceof Charges)) return new Charges(charges, opts)
  this.charges = charges
  this.options = opts || {}
  this.fee = this.options.fee

  // fees = 2.9 % + $0.30
  if (!this.fee) this.fee = { pct: 0.029, amt: 0.3 }
}

Charges.prototype.filter = function (fn) {
  return new Charges(this.charges.filter(fn), this.options)
}

Charges.prototype.paid = function (paid) {
  if (typeof paid !== 'boolean') paid = true
  return new Charges(this.charges.filter(function (charge) {
    return charge.paid === paid
  }), this.options)
}

Charges.prototype.refunded = function (refunded) {
  if (typeof refunded !== 'boolean') refunded = true
  return new Charges(this.charges.filter(function (charge) {
    return charge.refunded === refunded
  }), this.options)
}

Charges.prototype.created = function (start, end) {
  if (!(start instanceof Date)) return this
  if (!(end instanceof Date)) end = new Date('1/1/99999')
  return new Charges(this.charges.filter(function (charge) {
    var created = charge.created * 1000
    return created >= start.getTime() && created <= end.getTime()
  }), this.options)
}

Charges.prototype.list = function (start, end) {
  return this.created(start, end).charges
}

Charges.prototype.count = function (start, end) {
  return this.created(start, end).charges.length
}

Charges.prototype.print = function () {
  var self = this
  var list = this.list()
  var total = 0
  list.map((charge) => {
    var email = charge.receipt_email || 'anonymous'
    var a = Math.round(self._amount(charge) * 100) / 100.0
    console.log([email, '$' + a].join(' - '))
    total += a
  })
  console.log('Total Charges: $' + total.toFixed(2))
}

Charges.prototype.total = function (start, end) {
  var self = this
  var total = this.created(start, end).charges.reduce(function (memo, charge) {
    return memo + self._amount(charge)
  }, 0.00)
  return Math.round(total).toFixed(2) // to two decimal points
}

Charges.prototype._amount = function (charge) {
  var res = (charge.amount / 100.0)
  // Subtract fees
  if (res > 0.0) res *= (1.00 - this.fee.pct)
  res = res - this.fee.amt
  return res
}
