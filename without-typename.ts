// @ts-ignore
const objectKeyFilter = require('object-key-filter');

export function withoutTypename<T>(data: T): T {
  return typeof data === 'object' ? objectKeyFilter(data, ['__typename'], true) : data;
}
