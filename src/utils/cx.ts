import { Dictionary } from 'leanplum-lib-common';
import isEmpty from 'lodash/isEmpty';
import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';

function cx(...args: Array<cx.Data>): string {
  const dict: Dictionary<boolean> = args.reduce<Dictionary<boolean>>(
    (memo: Dictionary<boolean>, curr: cx.Data): Dictionary<boolean> => {
      if (isString(curr) && !isEmpty(curr)) {
        memo[`${curr}`] = true;

        return memo;
      }

      if (isPlainObject(curr)) {
        return { ...memo, ...(curr as Dictionary<boolean>) };
      }

      return memo;
    },
    {}
  );

  return Object.keys(dict)
    .reduce((memo: Array<string>, curr: string): Array<string> => {
      if (dict[curr] === true) {
        memo.push(curr);
      }

      return memo;
    }, [])
    .join(' ');
}

namespace cx {
  export type Data = Dictionary<boolean | null | undefined> | string | null | undefined;
}

export { cx };
