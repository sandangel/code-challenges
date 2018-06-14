import { JSON_A, JSON_B, JSON_C } from './chal2_input';
import { deepStrictEqual } from 'assert';

type Locker = { door: number; item: number; light: number; unlock: number; [prop: string]: number };
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

function convertToJSON_C(json_b: JB): JC[] {}

try {
  const json_b = convertToJSON_B(JSON_A);

  deepStrictEqual(json_b, JSON_B);
} catch (error) {
  console.log(error);
}
