const seal = require('./sealjs');

const context = new seal.SEALContext(2048, 128, 65536);
const evaluator = new seal.Evaluator(context);
const encoder = new seal.Encoder(65536);

module.exports = {
  sum: (values, filters) => {
    const result = new seal.Ciphertext();
    evaluator.addMany(values, result);

    return {
      numerator: result
    };
  },
  
  count: (values, filters) => {
    const result = new seal.Ciphertext();
    evaluator.addMany(filters, result);

    return {
      numerator: result
    };
  },
  
  average: (values, filters) => {
    const num = new seal.Ciphertext();
    evaluator.addMany(values, num);

    const den = new seal.Ciphertext();
    evaluator.addMany(filters, den);

    return {
      numerator: num,
      denominator: den
    };
  },

  variance: (values, filters) => {
    const filterSum = new seal.Ciphertext();
    evaluator.addMany(filters, filterSum);

    const squareOfSum = new seal.Ciphertext();
    evaluator.addMany(values, squareOfSum);
    evaluator.multiplyInPlace(squareOfSum, squareOfSum); 

    for (const value of values) {
      evaluator.multiplyInPlace(value, value);
    }

    const sumOfSquares = new seal.Ciphertext();
    evaluator.addMany(values, sumOfSquares);

    // N*sum(x^2)
    evaluator.multiplyInPlace(sumOfSquares, filterSum);
    
    // N*sum(x^2) - sum(x)^2
    evaluator.negate(squareOfSum);
    evaluator.addInPlace(sumOfSquares, squareOfSum);

    evaluator.multiplyInPlace(filterSum, filterSum);

    return {
      numerator: sumOfSquares,
      denominator: filterSum
    };
  }
}
