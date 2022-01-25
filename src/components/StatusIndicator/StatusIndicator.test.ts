import { mount, Wrapper } from '@vue/test-utils';
import { StatusIndicator } from './StatusIndicator';

describe(StatusIndicator, (): void => {
  let wrapper: Wrapper<StatusIndicator>;

  function renderComponent({
    label,
    color = StatusIndicator.Color.DARK30,
    embedded = false
  }: {
    label: string;
    color?: StatusIndicator.Color;
    embedded?: boolean;
  }): Wrapper<StatusIndicator> {
    return mount(StatusIndicator, {
      propsData: {
        label,
        color,
        embedded
      }
    });
  }

  beforeEach(() => (wrapper = renderComponent({ label: 'testLabel' })));

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders label', () => {
    expect(wrapper.html()).toContain('testLabel');
  });

  it('renders correct embedded class', () => {
    wrapper.setProps({ embedded: true });
    expect(wrapper.classes()).toContain('embedded');
  });
});
