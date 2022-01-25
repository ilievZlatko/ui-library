import { shallowMount, Wrapper } from '@vue/test-utils';
import { Icon } from '../icon/Icon';
import { Pill } from './Pill';

describe(Pill, (): void => {
  let wrapper: Wrapper<Pill>;

  function renderComponent(props?: {}): Wrapper<Pill> {
    return shallowMount(Pill, {
      propsData: {
        text: 'test text',
        ...props
      }
    });
  }

  beforeEach(() => (wrapper = renderComponent()));

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders text', () => {
    expect(wrapper.html()).toContain('test text');
  });

  it('sets correct class when close button enabled', () => {
    expect(wrapper.find('.lp-pill').classes()).toContain('with-close');
  });

  it('emits click', () => {
    expect(wrapper.emitted()[Pill.EVENT_CLICK]).toBeUndefined();
    wrapper.find('.lp-pill').trigger(Pill.EVENT_CLICK);
    expect(wrapper.emitted()[Pill.EVENT_CLICK]).toBeDefined();
  });

  it('emits close', () => {
    expect(wrapper.emitted()[Pill.EVENT_CLOSE]).toBeUndefined();
    wrapper.find<Icon>(Icon).vm.$emit('click');
    expect(wrapper.emitted()[Pill.EVENT_CLOSE]).toBeDefined();
  });

  describe('disabled', () => {
    beforeEach(() => (wrapper = renderComponent({ disabled: true })));

    it('sets disabled class', () => {
      expect(wrapper.find('.lp-pill').classes()).toContain('disabled');
    });

    it('does not emit click', () => {
      expect(wrapper.emitted()[Pill.EVENT_CLICK]).toBeUndefined();
      wrapper.find('.lp-pill').trigger(Pill.EVENT_CLICK);
      expect(wrapper.emitted()[Pill.EVENT_CLICK]).toBeUndefined();
    });

    it('does not emit close', () => {
      expect(wrapper.emitted()[Pill.EVENT_CLOSE]).toBeUndefined();
      wrapper.find<Icon>(Icon).vm.$emit('click');
      expect(wrapper.emitted()[Pill.EVENT_CLOSE]).toBeUndefined();
    });
  });

  context('without close button', () => {
    beforeEach(() => (wrapper = renderComponent({ showClose: false })));

    it('sets no close button class', () => {
      expect(wrapper.classes()).not.toContain('with-close');
    });

    it('does not emit close', () => {
      expect(wrapper.emitted()[Pill.EVENT_CLOSE]).toBeUndefined();
      wrapper.find<Icon>(Icon).vm.$emit('click');
      expect(wrapper.emitted()[Pill.EVENT_CLOSE]).toBeUndefined();
    });
  });
});
