import { mount, Wrapper } from '@vue/test-utils';
import { Icon } from 'leanplum-lib-ui';
import { Button } from '../Button/Button';
import { PlaceholderPane } from './PlaceholderPane';

describe(PlaceholderPane, (): void => {
  let wrapper: Wrapper<PlaceholderPane>;

  beforeEach(() => {
    wrapper = mount(PlaceholderPane, {
      propsData: { text: 'test text', subText: 'test sub text', icon: Icon.Type.EDIT }
    });
  });

  it('renders', () => {
    expect(wrapper.contains(PlaceholderPane)).toBe(true);
  });

  it('renders text', () => {
    expect(wrapper.html()).toContain('test text');
  });

  it('is renders subtext', () => {
    expect(wrapper.html()).toContain('test sub text');
  });

  it('renders icon', () => {
    expect(wrapper.find<Icon>(Icon).vm.type).toContain(Icon.Type.EDIT);
  });

  it('renders icon slot, if provided', () => {
    wrapper = mount(PlaceholderPane, {
      propsData: {
        text: 'test text',
        subText: 'test sub text'
      },
      slots: {
        icon: '<i class="foobar"></i>'
      }
    });

    expect(wrapper.contains('.foobar')).toBe(true);
    expect(wrapper.contains(Icon)).toBe(false);
  });

  describe('action text', () => {
    context('when not provided', () => {
      it('is not rendered', () => {
        expect(wrapper.html()).not.toContain('Click me');
      });
    });

    context('when provided', () => {
      beforeEach(() => {
        wrapper.setProps({ actionText: 'Click me' });
      });

      it('is rendered', () => {
        expect(wrapper.html()).toContain('Click me');
      });

      it('emits on click', () => {
        wrapper.find(Button).trigger(Button.EVENT_CLICK);
        expect(wrapper.emitted().click).toBeDefined();
      });

      it('can be disabled', () => {
        expect(wrapper.find(Button).props('disabled')).toBe(false);

        wrapper.setProps({ actionDisabled: true });
        expect(wrapper.find(Button).props('disabled')).toBe(true);
      });

      it('passes actionLink to Button', () => {
        const actionLink = { name: 'location' };
        wrapper.setProps({ actionLink });
        expect(wrapper.find<Button>(Button).vm.to).toMatchObject(actionLink);
      });
    });
  });
});
