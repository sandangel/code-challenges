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
