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
    const squareOfSum = new seal.Ciphertext();
    evaluator.addMany(values, squareOfSum);
    evaluator.multiplyInPlace(squareOfSum, squareOfSum); 

    for (const value in values) {
      evaluator.multiplyInPlace(value, value);
    }

    const sumOfSquares = new seal.Ciphertext();
    evaluator.addMany(values, sumOfSquares);

    evaluator.negate(squareOfSum);
    evaluator.addInPlace(sumOfSquares, squareOfSum);

    const den = new seal.Ciphertext();
    evaluator.addMany(filters, den);

    return {
      numerator: sumOfSquares,
      denominator: den
    };
  }
}
