
# stripe-charge-list

A [Stripe](https://stripe.com) charges API for node  - get a time based overview of how much you're making. Based off [stripe-charges](https://github.com/segmentio/stripe-charges).

## Installation

```
npm install stripe-charge-list
```

## Example

Query charges by their `created` date:

```js
var ChargeList = require('stripe-charge-list')

var list = ChargeList('stripe-key')

list.get(new Date('1/1/2014'), new Date('2/1/2014'), function (err, charges) {
  console.log('Made $' + charges.total() + ' in January!');
});
```

The resulting `charges` object lets you further learn manipulate the charges.

### Number of Charges

Get the number of charges returned:

```js
charges.count()
```

or filter further inside the cohort by the charges' `created` date:

```js
charges.count(new Date('1/15/2014'), new Date('1/24/2014'));
```

## API

## `var list = ChargeList(key, [opts])`

* `key` - stripe key, required
* `opts.limit` - limit number of results from each query
* opts.fee - `{ pct: 0.029, amt: 0.3}` set fees for calculating actual earnings (only needs to be set if you do not have default pricing).

### `list.get(start, end, callback(err, charges))`

Get charges between `start` and `end` dates (must be date objects). `callback` returns a `charges` object (see below).

## `charges` API

```js
charges.list()
```

```
[
  {
    amount: 2900,
    customer: 'cus_2983jd92d2d',
    ..
  },
]
```

Filter charges via a filter function:

```js
charges.filter(fn)
```

or filter further by the charges' `created` date:

```js
charges.list(new Date('1/15/2014'), new Date('1/24/2014'))
```

or get all the `refunded` charges:

```js
charges.refunded(true).count()
```

Handy printing to `console.log`:

```js
charges.print()
```

### Total Amount

You can get the total amount of money made from the charges:

```js
charges.paid(true).refunded(false).total()
```

## License

MIT

Forked from [stripe-charges](https://github.com/segmentio/stripe-charges).