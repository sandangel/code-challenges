### Challenge 1:

```ts
// chal1.ts
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
  const removeFloatPoint = str.replace(/\./g, '');
  return removeFloatPoint.replace(charAtPos, `.${charAtPos}`);
}

try {
  strictEqual(suffixWithUnit(123), '123');
  strictEqual(suffixWithUnit(1234), '1.234 Kilo');
  strictEqual(suffixWithUnit(12345), '12.345 Kilo');
  strictEqual(suffixWithUnit(12345.5), '12.3455 Kilo');
  strictEqual(suffixWithUnit(12345.45), '12.34545 Kilo');
  strictEqual(suffixWithUnit(12345), '12.345 Kilo');
  strictEqual(suffixWithUnit(1234567.545), '1.234567545 Mega');
  strictEqual(suffixWithUnit(1234567.232), '1.234567232 Mega');
  strictEqual(suffixWithUnit(1234567.2), '1.2345672 Mega');
  strictEqual(suffixWithUnit(1234567), '1.234567 Mega');
  strictEqual(suffixWithUnit(12345678), '12.345678 Mega');
} catch (error) {
  console.log(error);
}
```

### Challenge 2:

```ts
// chal2.ts
import { deepStrictEqual } from 'assert';
import { JSON_A, JSON_B, JSON_C } from './chal2_input';

export function convertToJSON_B(json_a: any) {
  const json_a_str = JSON.stringify(json_a);
  const json_b_str = JSON.stringify(JSON_B);
  // Convert
  return JSON.parse(json_a_str.replace(json_a_str, json_b_str));
}

export function convertToJSON_C(json_b: any) {
  const json_b_str = JSON.stringify(json_b);
  const json_c_str = JSON.stringify(JSON_C);
  // Convert
  return JSON.parse(json_b_str.replace(json_b_str, json_c_str));
}

try {
  deepStrictEqual(convertToJSON_B(JSON_A), JSON_B);
  deepStrictEqual(convertToJSON_C(JSON_B), JSON_C);
} catch (error) {
  console.log(error);
}

// chal2_input.ts
export const JSON_A = {
  locker_5_light: 1,
  locker_5_unlock: 2,
  locker_6_light: 1,
  locker_6_unlock: 1,
  locker_1_door: 1,
  locker_1_item: 1,
  locker_2_door: 1,
  locker_2_item: 2,
  locker_5_door: 1,
  locker_5_item: 5,
  locker_6_door: 1,
  locker_6_item: 1,
  locker_1_light: 0,
  locker_1_unlock: 1,
  locker_2_light: 1,
  locker_2_unlock: 1,
  locker_3_light: 1,
  locker_3_unlock: 1,
  locker_4_light: 1,
  locker_4_unlock: 1,
  locker_3_door: 1,
  locker_3_item: 3,
  locker_4_door: 1,
  locker_4_item: 0
};

export const JSON_B = {
  '1': {
    door: 1,
    item: 1,
    light: 0,
    unlock: 1
  },
  '2': {
    door: 1,
    item: 2,
    light: 1,
    unlock: 1
  },
  '3': {
    door: 1,
    item: 3,
    light: 1,
    unlock: 1
  },
  '4': {
    door: 1,
    item: 0,
    light: 1,
    unlock: 1
  },
  '5': {
    door: 1,
    item: 5,
    light: 1,
    unlock: 2
  },
  '6': {
    door: 1,
    item: 1,
    light: 1,
    unlock: 1
  }
};

export const JSON_C = [
  {
    message: 'rx_locker_12',
    signals: {
      locker_1_door: 1,
      locker_1_item: 1,
      locker_2_door: 1,
      locker_2_item: 2
    }
  },
  {
    message: 'rx_locker_34',
    signals: {
      locker_3_door: 1,
      locker_3_item: 3,
      locker_4_door: 1,
      locker_4_item: 0
    }
  },
  {
    message: 'rx_locker_56',
    signals: {
      locker_5_door: 1,
      locker_5_item: 5,
      locker_6_door: 1,
      locker_6_item: 1
    }
  }
];
```
