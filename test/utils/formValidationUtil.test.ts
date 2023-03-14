/**
 * Form Validation Util Unit Tests
 *
 * @group unit
 */

import { PASSWORD_REGEX } from "src/utils/formValidationUtil";

describe("password regex", () => {
  it.each([
    ["abCD12??", true],
    ["*bcdefghiJK123*", true],
    ["abcd", false],
    ["abC", false],
    ["abc123", false],
    ["ABC123", false],
    ["ABC123abc", false],
    ["???", false],
    ["???abc", false],
    ["???abc123", false],
    ["???ABC123", false],
    ["1234567890abcDE$", false],
  ])(
    'password "%s" is expecting a %s regex match',
    (password: string, expected: boolean) => {
      expect(PASSWORD_REGEX.test(password)).toBe(expected);
    }
  );
});
