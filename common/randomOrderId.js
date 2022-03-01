function randomOrderId() {
  let random = '';
  const str = '0123456789'
  for (let i = 1; i <= 14; i++) {
    random += str.indexOf(parseInt(Math.random() * 10));
  }
  return random;
}

module.exports = randomOrderId;
