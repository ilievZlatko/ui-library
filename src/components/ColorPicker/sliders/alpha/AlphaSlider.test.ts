import { mount, Wrapper } from '@vue/test-utils';
import tinycolor from 'tinycolor2';
import { AlphaSlider } from './AlphaSlider';

describe('AlphaSlider', (): void => {
  it('should render', (): void => {
    const wrapper = renderComponent(tinycolor('rgba(120, 150, 180, 0.5'));

    expect(wrapper.contains(AlphaSlider)).toBeTruthy();
  });

  it('should still render with an invalid color value', (): void => {
    const wrapper = renderComponent(tinycolor('sanket'));

    expect(wrapper.contains(AlphaSlider)).toBeTruthy();
  });

  xit('should emit change when the slider is updated', (): void => {
    const wrapper = renderComponent(tinycolor('rgba(120, 150, 180, 0.5'));

    wrapper.find('.bar').trigger('click', { clientX: 20 });

    expect((wrapper.emitted().change[0][0] as tinycolor.Instance).toRgbString()).toEqual('rgba(120, 150, 180, 0.11)');
  });

  function renderComponent(color: tinycolor.Instance): Wrapper<AlphaSlider> {
    return mount(AlphaSlider, {
      propsData: {
        color,
        hue: color.toHsv().h
      }
    });
  }
});
