function decrypt(data) {
  return "decrypted data";
}

function read() {
  return decrypt("data");
}

module.exports = {
  decrypt: decrypt,
  read: read,
};
