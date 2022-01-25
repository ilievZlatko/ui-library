import { shallowMount, Wrapper } from '@vue/test-utils';
import { ErrorTooltip } from '../ErrorTooltip/ErrorTooltip';
import { WarningTooltip } from '../WarningTooltip/WarningTooltip';
import { LegendWrapper } from './LegendWrapper';

describe('LegendWrapper', (): void => {
  let wrapper: Wrapper<LegendWrapper>;
  const label = 'test label';

  beforeEach(() => {
    wrapper = shallowMount(LegendWrapper, { propsData: { label } });
  });

  it('renders without error', (): void => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('renders label', (): void => {
    expect(wrapper.html()).toContain(label);
  });

  it('renders collapsed by default', (): void => {
    expect(wrapper.classes()).not.toContain('lp-expanded');
  });

  it('renders expanded if expanded prop is true', (): void => {
    wrapper.setProps({ expanded: true });
    expect(wrapper.classes()).toContain('lp-expanded');
  });

  it('renders required dot and tooltip if required is true', () => {
    wrapper.setProps({ required: true });
    expect(wrapper.find('.required').exists()).toBe(true);
  });

  it('emits focus event on click', (): void => {
    wrapper.trigger('focus');
    expect(wrapper.emitted().focus).toBeTruthy();
  });

  it('can render as readonly', () => {
    wrapper.setProps({ readonly: true });
    expect(wrapper.classes()).toContain('lp-readonly');
  });

  describe('error', () => {
    it('does not render error by default', () => {
      expect(wrapper.contains(ErrorTooltip)).toBe(false);
    });

    it("renders an error when there's an error passed", () => {
      wrapper.setProps({ error: 'I AM AN ERROR!' });
      expect(wrapper.contains(ErrorTooltip)).toBe(true);
    });

    it('sets the correct error message', () => {
      wrapper.setProps({ error: 'I AM AN ERROR!' });
      expect(wrapper.find(ErrorTooltip).props().message).toEqual('I AM AN ERROR!');
    });

    it('overrides warnings', () => {
      wrapper.setProps({ warning: 'i am just a warning...' });
      wrapper.setProps({ error: 'I AM AN ERROR!' });

      expect(wrapper.contains(WarningTooltip)).toBe(false);
      expect(wrapper.contains(ErrorTooltip)).toBe(true);
    });
  });

  describe('warning', () => {
    it('does not render warning by default', () => {
      expect(wrapper.contains(WarningTooltip)).toBe(false);
    });

    it("renders a warning when there's a warning passed", () => {
      wrapper.setProps({ warning: 'i am just a warning...' });
      expect(wrapper.contains(WarningTooltip)).toBe(true);
    });

    it('sets the correct warning message', () => {
      wrapper.setProps({ warning: 'i am just a warning...' });
      expect(wrapper.find(WarningTooltip).props().message).toEqual('i am just a warning...');
    });
  });
});
