const seal = require('./sealjs');

const context = new seal.SEALContext(2048, 128, 65536);
const evaluator = new seal.Evaluator(context);

module.exports = {
  sum: (values, filters) => {
    const sum = new seal.Ciphertext();
    evaluator.addMany(values, sum);
    return sum;
  }
}
