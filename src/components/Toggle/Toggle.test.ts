import { mount, Wrapper } from '@vue/test-utils';
import { Toggle } from './Toggle';

describe(Toggle, (): void => {
  let wrapper: Wrapper<Toggle>;

  function renderComponent(
    label: string | null = null,
    active: boolean = false,
    disabled: boolean = false
  ): Wrapper<Toggle> {
    return mount(Toggle, { propsData: { label, active, disabled } });
  }

  beforeEach(() => (wrapper = renderComponent()));

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders inactive by default', () => {
    expect(wrapper.classes()).not.toContain('active');
  });

  it('renders no label', () => {
    expect(wrapper.find('.label').exists()).toBe(false);
  });

  it('emits toggle event on click', () => {
    expect(wrapper.emitted().toggle).not.toBeDefined();
    wrapper.find('.lp-toggle').trigger('click');
    expect(wrapper.emitted().toggle).toBeDefined();
    expect(wrapper.emitted().toggle[0][0]).toBe(true);
  });

  context('when disabled', () => {
    beforeEach(() => (wrapper = renderComponent(null, false, true)));

    it('renders disabled', () => {
      expect(wrapper.classes()).toContain('disabled');
    });

    it('emits no toggle event on click', () => {
      expect(wrapper.emitted().toggle).not.toBeDefined();
      wrapper.find('.lp-toggle').trigger('click');
      expect(wrapper.emitted().toggle).not.toBeDefined();
    });

    context('and active', () => {
      beforeEach(() => (wrapper = renderComponent(null, true)));

      it('renders active', () => {
        expect(wrapper.classes()).toContain('active');
      });
    });
  });

  context('with label', () => {
    beforeEach(() => (wrapper = renderComponent('test')));

    it('renders label', () => {
      expect(wrapper.find('.label').exists()).toBe(true);
      expect(wrapper.find('.label').text()).toBe('test');
    });
  });
});
