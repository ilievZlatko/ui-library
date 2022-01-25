import { shallowMount, Wrapper } from '@vue/test-utils';
import { Icon } from '../icon/Icon';
import { InfoPanel } from './InfoPanel';

describe(InfoPanel, () => {
  let wrapper: Wrapper<InfoPanel>;

  beforeEach(() => {
    wrapper = shallowMount(InfoPanel, {
      propsData: { message: 'Test', type: InfoPanel.Type.WARNING },
      slots: { default: ['<span>foobar</span>'] }
    });
  });

  it('renders', () => {
    expect(wrapper.contains(InfoPanel)).toBe(true);
  });

  it('renders icon', () => {
    expect(wrapper.contains(Icon)).toBe(true);
    expect(wrapper.find(Icon).props()).toMatchObject({ type: Icon.Type.EXCLAMATION_MEDIUM, size: 16 });
  });

  it('renders message', () => {
    expect(wrapper.text()).toContain('Test');
  });

  it('accepts children', () => {
    expect(wrapper.contains('span')).toBe(true);
    expect(wrapper.text()).toContain('foobar');
  });
});
