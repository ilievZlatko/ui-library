import { shallowMount, Wrapper } from '@vue/test-utils';
import { Icon } from '../icon/Icon';
import { InfoSection } from './InfoSection';

describe(InfoSection, () => {
  it('renders the component', () => {
    const wrapper = renderComponent();

    expect(wrapper.contains(InfoSection)).toBe(true);
  });

  it('renders custom icon', () => {
    const wrapper = renderComponent({ icon: Icon.Type.ENGAGE });

    expect(wrapper.contains(Icon)).toBe(true);
    expect(wrapper.find(Icon).props()).toMatchObject({ type: Icon.Type.ENGAGE, size: 20 });
  });

  it('renders specified title', () => {
    const wrapper = renderComponent({ title: 'FooBar' });

    expect(wrapper.find('.lp-info-section-title').text()).toContain('FooBar');
  });

  it('renders provided content', () => {
    const wrapper = renderComponent({}, { default: '<p class="test-foobar-content">FooBar!</p>' });

    expect(wrapper.contains('.test-foobar-content')).toBe(true);
    expect(wrapper.find('.lp-info-section-content').text()).toContain('FooBar!');
  });

  it('renders "sidebar" slot', () => {
    const wrapper = renderComponent({}, { sidebar: '<i class="icon-foobar">foo</i>' });

    expect(wrapper.contains('.icon-foobar')).toBe(true);
    expect(wrapper.find('.lp-info-section-sidebar > i').text()).toEqual('foo');
    expect(wrapper.contains(Icon)).toBe(false);
  });
});

function renderComponent(propsData?: Record<string, unknown>, slots?: Record<string, string>): Wrapper<InfoSection> {
  return shallowMount(InfoSection, {
    propsData,
    slots
  });
}
