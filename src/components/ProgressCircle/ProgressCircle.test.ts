import { shallowMount, Wrapper } from '@vue/test-utils';
import { ProgressCircle } from './ProgressCircle';

describe(ProgressCircle, () => {
  it('renders the component', () => {
    const wrapper = renderComponent({ value: 0 });

    expect(wrapper.isVueInstance()).toBe(true);
  });

  it('sets the value', () => {
    const wrapper = renderComponent({ value: 35 });

    expect(wrapper.find('.lp-progress-circle > text').text()).toBe('35%');
    expect(wrapper.find('.lp-progress-circle > .fg-line').attributes('stroke-dasharray')).toBe('35, 100');
  });

  it('sets the color', () => {
    const wrapper = renderComponent({ value: 100, color: ProgressCircle.Color.ORANGE });

    expect(wrapper.find('.lp-progress-circle').classes('color-orange')).toBe(true);
  });

  it('sets the size', () => {
    const wrapper = renderComponent({ value: 100, size: '128px' });

    expect(wrapper.attributes().style.includes('height: 128px')).toBe(true);
    expect(wrapper.attributes().style.includes('width: 128px')).toBe(true);
  });

  it('shows no progress indicator for 0', () => {
    const wrapper = renderComponent({ value: 0 });

    expect(wrapper.find('.lp-progress-circle > .fg-line').isVisible()).toBe(false);
  });

  it('shows no value when specified', () => {
    const wrapper = renderComponent({ value: 35, showValue: false });

    expect(wrapper.find('.lp-progress-circle > text').isVisible()).toBe(false);
    expect(wrapper.find('.lp-progress-circle > .fg-line').attributes('stroke-dasharray')).toBe('35, 100');
  });

  it('shows whole number for decimal value', () => {
    expect(
      renderComponent({ value: 1.45 })
        .find('.lp-progress-circle > text')
        .text()
    ).toBe('1%');
    expect(
      renderComponent({ value: 99.5 })
        .find('.lp-progress-circle > text')
        .text()
    ).toBe('100%');
  });

  it('throws error for invalid value', () => {
    expect(() => renderComponent({ value: -1 }, true)).toThrow();
    expect(() => renderComponent({ value: 101 }, true)).toThrow();
  });
});

function renderComponent(propsData: object, shouldThrow: boolean = false): Wrapper<ProgressCircle> {
  // Do not log the expected errors in the console.
  // ref: https://github.com/vuejs/vue-test-utils/issues/641#issuecomment-443651405
  const spy = shouldThrow
    ? jest.spyOn(global.console, 'error').mockImplementation(() => {
        /* noop */
      })
    : jest.fn();

  try {
    return shallowMount(ProgressCircle, { propsData });
  } finally {
    spy.mockRestore();
  }
}
