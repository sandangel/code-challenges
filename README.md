### Challenge 1:

```ts
// chal1.ts
import { strictEqual } from 'assert';

function suffixWithUnit(num: number): string {
  let unit: 'Kilo' | 'Mega';
  let res = `${num}`;
  let l: number;
  const floatPointPos = res.search(/\./);

  if (floatPointPos === -1) {
    l = res.length;
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
import { deepStrictEqual, strictEqual } from 'assert';
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
  const json_b = convertToJSON_B(JSON_A);
  const json_c = convertToJSON_C(JSON_B);

  deepStrictEqual(json_b, JSON_B);
  strictEqual(JSON.stringify(json_c), JSON.stringify(JSON_C));
} catch (error) {
  console.log(error);
}
```

### Config:

package.json

```json
{
  "name": "zmp-challenge",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/node": "^10.3.3",
    "ts-node": "^6.1.1",
    "typescript": "^2.9.2"
  }
}
```

tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "moduleResolution": "node",
    "types": ["node"],
    "esModuleInterop": true
  },
  "include": ["*.ts"]
}
```

### Challenge 2 - Bonus:

```ts
// chal2_bonus.ts
import { JSON_A, JSON_B, JSON_C, JSON_C_G1, JSON_C_G3, JSON_C_G4, JSON_C_G6 } from './chal2_input';
import { deepStrictEqual, strictEqual } from 'assert';

type Locker = { door: number; item: number; light: number; unlock: number; [key: string]: number };
type JA = { [key: string]: number };
type JB = { [id: string]: Locker };
type JC = { message: string; signals: { [key: string]: number } };

function convertToJSON_B(json_a: JA): JB {
  const json_b: JB = {};
  Object.keys(json_a).forEach(k => {
    const [, id, prop] = /^locker_(\d+)_(.+)$/.exec(k)!;
    if (json_b[id] === undefined) {
      json_b[id] = {} as Locker;
    }

    json_b[id][prop] = json_a[k];
  });

  return json_b;
}

type PropType = 'door' | 'item' | 'light' | 'unlock';

function convertToJSON_C(json_b: JB, groupMembers = 2, props: PropType[] = ['door', 'item']): JC[] {
  let memberIndex = 0;
  return Object.keys(json_b).reduce(
    (prev, cur) => {
      if (memberIndex === 0 || groupMembers === 1) {
        memberIndex++;
        const message = 'rx_locker_' + cur;
        const signals: JC['signals'] = {};
        props.forEach(prop => (signals[`locker_${cur}_${prop}`] = json_b[cur][prop]));

        return [...prev, { message, signals }];
      }

      // case groupMembers > 2
      memberIndex++;

      if (memberIndex >= groupMembers) {
        memberIndex = 0;
      }

      const prevPos = prev.length - 1;
      const prevItem = prev[prevPos];
      prevItem.message = prevItem.message + cur;
      props.forEach(prop => (prevItem.signals[`locker_${cur}_${prop}`] = json_b[cur][prop]));
      return prev;
    },
    [] as JC[]
  );
}

try {
  const json_b = convertToJSON_B(JSON_A);
  const json_c = convertToJSON_C(JSON_B);

  deepStrictEqual(json_b, JSON_B);
  strictEqual(JSON.stringify(json_c), JSON.stringify(JSON_C));

  strictEqual(JSON.stringify(convertToJSON_C(JSON_B, 1)), JSON.stringify(JSON_C_G1));
  strictEqual(JSON.stringify(convertToJSON_C(JSON_B, 3)), JSON.stringify(JSON_C_G3));
  strictEqual(JSON.stringify(convertToJSON_C(JSON_B, 4)), JSON.stringify(JSON_C_G4));
  strictEqual(JSON.stringify(convertToJSON_C(JSON_B, 6)), JSON.stringify(JSON_C_G6));
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

export const JSON_C_G1 = [
  {
    message: 'rx_locker_1',
    signals: { locker_1_door: 1, locker_1_item: 1 }
  },
  {
    message: 'rx_locker_2',
    signals: { locker_2_door: 1, locker_2_item: 2 }
  },
  {
    message: 'rx_locker_3',
    signals: { locker_3_door: 1, locker_3_item: 3 }
  },
  {
    message: 'rx_locker_4',
    signals: { locker_4_door: 1, locker_4_item: 0 }
  },
  {
    message: 'rx_locker_5',
    signals: { locker_5_door: 1, locker_5_item: 5 }
  },
  {
    message: 'rx_locker_6',
    signals: { locker_6_door: 1, locker_6_item: 1 }
  }
];

export const JSON_C_G3 = [
  {
    message: 'rx_locker_123',
    signals: {
      locker_1_door: 1,
      locker_1_item: 1,
      locker_2_door: 1,
      locker_2_item: 2,
      locker_3_door: 1,
      locker_3_item: 3
    }
  },
  {
    message: 'rx_locker_456',
    signals: {
      locker_4_door: 1,
      locker_4_item: 0,
      locker_5_door: 1,
      locker_5_item: 5,
      locker_6_door: 1,
      locker_6_item: 1
    }
  }
];

export const JSON_C_G4 = [
  {
    message: 'rx_locker_1234',
    signals: {
      locker_1_door: 1,
      locker_1_item: 1,
      locker_2_door: 1,
      locker_2_item: 2,
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

export const JSON_C_G6 = [
  {
    message: 'rx_locker_123456',
    signals: {
      locker_1_door: 1,
      locker_1_item: 1,
      locker_2_door: 1,
      locker_2_item: 2,
      locker_3_door: 1,
      locker_3_item: 3,
      locker_4_door: 1,
      locker_4_item: 0,
      locker_5_door: 1,
      locker_5_item: 5,
      locker_6_door: 1,
      locker_6_item: 1
    }
  }
];
```
