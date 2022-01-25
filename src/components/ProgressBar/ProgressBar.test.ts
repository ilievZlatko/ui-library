import { mount, Wrapper } from '@vue/test-utils';
import { ProgressBar } from './ProgressBar';

describe(
  ProgressBar,
  (): void => {
    it('renders style getter as it should', () => {
      const wrapper = renderComponent({ value: 55 });

      expect(wrapper.vm.translateStyle).toBe('transform: translateX(-45%);');
    });

    it('renders empty style', () => {
      const wrapper = renderComponent({ value: 0 });

      expect(wrapper.vm.translateStyle).toBe('transform: translateX(-100%);');
    });

    it('renders full style', () => {
      const wrapper = renderComponent({ value: 100 });

      expect(wrapper.vm.translateStyle).toBe('transform: translateX(-0%);');
    });

    it('renders secondary style', () => {
      const wrapper = renderComponent({ value: 50, secondaryValue: 10 });

      expect(wrapper.vm.translateSecondaryStyle).toBe('transform: translateX(-40%);');
    });

    // tslint:disable-next-line:no-any
    function renderComponent(propsData: {}): Wrapper<ProgressBar> {
      return mount(ProgressBar, { propsData });
    }
  }
);
