import { strictEqual } from 'assert';

function suffixWithUnit(num: number): string {
  let unit: '' | 'Kilo' | 'Mega' = '';
  let res = `${num}`;
  let l: number;
  const floatPointPos = res.search(/\./);

  if (floatPointPos === -1) {
    l = String(num).length;
  } else {
    l = res.substring(0, floatPointPos).length;
  }

  switch (true) {
    case l > 3 && l <= 6:
      unit = 'Kilo';
      res = addFloatPoint(res, l - 3);
      return `${res} ${unit}`;
    case l > 6 && l <= 9:
      unit = 'Mega';
      res = addFloatPoint(res, l - 6);
      return `${res} ${unit}`;
    default:
      return res;
  }
}

function addFloatPoint(str: string, pos: number) {
  const charAtPos = str.charAt(pos);
  return str.replace(charAtPos, `,${charAtPos}`);
}

try {
  strictEqual(suffixWithUnit(123), '123');
  strictEqual(suffixWithUnit(1234), '1,234 Kilo');
  strictEqual(suffixWithUnit(12345), '12,345 Kilo');
  strictEqual(suffixWithUnit(12345.5), '12,345.5 Kilo');
  strictEqual(suffixWithUnit(12345.45), '12,345.45 Kilo');
  strictEqual(suffixWithUnit(12345), '12,345 Kilo');
  strictEqual(suffixWithUnit(1234567.545), '1,234567.545 Mega');
  strictEqual(suffixWithUnit(1234567.232), '1,234567.232 Mega');
  strictEqual(suffixWithUnit(1234567.2), '1,234567.2 Mega');
  strictEqual(suffixWithUnit(1234567), '1,234567 Mega');
  strictEqual(suffixWithUnit(12345678), '12,345678 Mega');
} catch (error) {
  console.log(error);
}
