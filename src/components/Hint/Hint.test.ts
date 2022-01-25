import { mount } from '@vue/test-utils';
import { Hint } from './Hint';

describe('Hint', () => {
  describe('render', () => {
    it('renders message', () => {
      const hint = mount(Hint, {
        propsData: {
          message: 'foo'
        }
      });

      expect(hint.contains('.lp-hint-message')).toBe(true);
      expect(hint.find('.lp-hint-message').text()).toEqual('foo');
    });

    it('renders title', () => {
      const hint = mount(Hint, {
        propsData: {
          title: 'bar',
          message: 'foo'
        }
      });

      expect(hint.contains('.lp-hint-title')).toBe(true);
      expect(hint.find('.lp-hint-title').text()).toEqual('bar');
    });

    it('renders close button', () => {
      const hint = mount(Hint, {
        propsData: {
          message: 'foo'
        }
      });

      expect(hint.contains('.lp-hint-close')).toBe(true);
    });

    it('renders activator', () => {
      const hint = mount(Hint, {
        slots: {
          default: ['close']
        },
        propsData: {
          message: 'foo'
        }
      });

      expect(hint.contains('.lp-hint-activator')).toBe(true);
      expect(hint.contains('.lp-hint-message')).toBe(true);
      expect(hint.contains('.lp-hint-close')).toBe(false);
    });

    it('does not render if no props are provided', () => {
      const hint = mount(Hint, {});

      expect(hint.contains('*')).toBe(false);
    });
  });
});
