export function checkValidNumbers(...numbers) {
  for (const num of numbers) {
    if (typeof num !== 'number') {
      throw new Error('Not a valid number');
    }
  }
}

export function checkValidStrings(...strings) {
  for (const string of strings) {
    if (typeof string !== 'string') {
      throw new Error('Not a valid string');
    }
  }
}