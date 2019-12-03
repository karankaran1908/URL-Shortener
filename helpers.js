const makeid = (length, excludeCodes) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  while (
    result == '' ||
    excludeCodes.indexOf(result) >= 0
  ) {
    result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
  }
  return result;
};

module.exports = {
  makeid
};
