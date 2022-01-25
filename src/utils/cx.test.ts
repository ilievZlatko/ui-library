import { cx } from './cx';

describe('cx', (): void => {
  it('should return for multiple strings', (): void => {
    expect(cx('abc', 'xyz')).toEqual('abc xyz');
    expect(cx('abc', 'xyz', null)).toEqual('abc xyz');
    expect(cx('abc', null, 'xyz')).toEqual('abc xyz');
    expect(cx(null, 'abc', 'xyz')).toEqual('abc xyz');
    expect(cx(null, 'abc', undefined, 'xyz')).toEqual('abc xyz');
  });
  it('should return for different combinations of strings and dictionaries', (): void => {
    expect(cx('abc', 'xyz', { foo: true })).toEqual('abc xyz foo');
    expect(cx('abc', { foo: true, baz: undefined }, 'xyz')).toEqual('abc foo xyz');
    expect(cx({ foo: true, bar: false }, 'abc', 'xyz')).toEqual('foo abc xyz');
    expect(cx({ foo: true }, null, 'abc', 'xyz')).toEqual('foo abc xyz');
    expect(cx({ foo: true, bar: null }, 'abc', undefined, 'xyz')).toEqual('foo abc xyz');
  });
});
