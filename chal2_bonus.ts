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
