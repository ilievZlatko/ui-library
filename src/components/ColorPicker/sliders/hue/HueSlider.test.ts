import { mount, Wrapper } from '@vue/test-utils';
import tinycolor from 'tinycolor2';
import { HueSlider } from './HueSlider';

describe('HueSlider', (): void => {
  it('should render', (): void => {
    const wrapper = renderComponent(tinycolor('rgba(120, 150, 180, 0.5'));

    expect(wrapper.contains(HueSlider)).toBeTruthy();
  });

  it('should still render with an invalid color value', (): void => {
    const wrapper = renderComponent(tinycolor('sanket'));

    expect(wrapper.contains(HueSlider)).toBeTruthy();
  });

  it('should emit change when the slider is clicked', (): void => {
    const wrapper = renderComponent(tinycolor('rgba(120, 150, 180, 0.5'));

    wrapper.vm.updateHuePosition(50);

    expect(wrapper.emitted().change[0][0]).toEqual(118);
  });

  it('should update local values on drag', (done: jest.DoneCallback): void => {
    const wrapper = renderComponent(tinycolor('rgba(150, 150, 150, 0.75)'));

    wrapper.trigger('mousedown');
    setTimeout((): void => {
      wrapper.trigger('mousemove', { clientY: 30 });
      setTimeout((): void => {
        wrapper.trigger('mouseup');
        setTimeout((): void => {
          expect(wrapper.emitted().change[0][0]).toEqual(69);
          done();
        }, 10);
      }, 10);
    }, 10);
  });

  function renderComponent(color: tinycolor.Instance): Wrapper<HueSlider> {
    return mount(HueSlider, {
      propsData: {
        color,
        hue: color.toHsv().h
      },
      attachToDocument: true
    });
  }
});
