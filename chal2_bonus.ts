import { JSON_A, JSON_B, JSON_C } from './chal2_input';
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

function convertToJSON_C(json_b: JB): JC[] {
  let group = 2;
  let member = 1;
  const props: ('door' | 'item' | 'light' | 'unlock')[] = ['door', 'item'];
  return Object.keys(json_b).reduce(
    (prev, cur) => {
      if (member === 1 || group === 1) {
        member++;
        const message = 'rx_locker_' + cur;
        const signals: JC['signals'] = {};
        props.forEach(prop => (signals[`locker_${cur}_${prop}`] = json_b[cur][prop]));

        return [...prev, { message, signals }];
      }
      
      // case group > 2
      member++;

      if (member >= group) {
        member = 1;
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
} catch (error) {
  console.log(error);
}
