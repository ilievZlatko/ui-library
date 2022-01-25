import { mount, Wrapper } from '@vue/test-utils';
import tinycolor from 'tinycolor2';
import { SaturationSlider } from './SaturationSlider';

describe('SaturationSlider', (): void => {
  it('should render', (): void => {
    const wrapper = renderComponent(tinycolor('rgba(120, 150, 180, 0.5'));

    expect(wrapper.contains(SaturationSlider)).toBeTruthy();
  });

  it('should still render with an invalid color value', (): void => {
    const wrapper = renderComponent(tinycolor('sanket'));

    expect(wrapper.contains(SaturationSlider)).toBeTruthy();
  });

  xit('should emit change when the slider is updated', (): void => {
    const wrapper = renderComponent(tinycolor('rgba(120, 150, 180, 0.5'));

    wrapper.find('.bar.saturation').trigger('click', {
      clientX: 30,
      clientY: 50
    });

    expect((wrapper.emitted().change[0][0] as tinycolor.Instance).toRgbString()).toEqual('rgba(136, 153, 170, 0.5)');
  });

  function renderComponent(color: tinycolor.Instance): Wrapper<SaturationSlider> {
    return mount(SaturationSlider, {
      propsData: {
        color,
        hue: color.toHsv().h
      },
      attachToDocument: true
    });
  }
});
