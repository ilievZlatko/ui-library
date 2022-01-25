import { shallowMount, Slots, Wrapper } from '@vue/test-utils';
import { Icon } from '../icon/Icon';
import { OverflowableText } from '../OverflowableText/OverflowableText';
import { Header } from './Header';

describe(Header, () => {
  let wrapper: Wrapper<Header>;

  function renderComponent(props?: {}, slots?: Slots): Wrapper<Header> {
    return shallowMount(Header, {
      propsData: {
        ...props
      },
      slots
    });
  }

  beforeEach(() => (wrapper = renderComponent({ title: 'TestTitle' })));

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders title', () => {
    expect(wrapper.find<OverflowableText>(OverflowableText).vm.text).toContain('TestTitle');
  });

  it('renders subtitle', () => {
    wrapper.setProps({ subTitle: 'TestSubTitle' });
    expect(wrapper.text()).toContain('TestSubTitle');
  });

  it('renders info icon', () => {
    wrapper.setProps({ infoTooltip: 'foo' });
    expect(wrapper.find(Icon).exists()).toBe(true);
  });

  it('renders small title', () => {
    expect(wrapper.classes()).toContain('big');
    wrapper.setProps({ bigTitle: false });
    expect(wrapper.classes()).not.toContain('big');
  });

  it('renders non-bold title', () => {
    expect(wrapper.classes()).toContain('bold');
    wrapper.setProps({ boldTitle: false });
    expect(wrapper.classes()).not.toContain('bold');
  });

  it('renders without spacing', () => {
    expect(wrapper.classes()).toContain('with-spacing');
    wrapper.setProps({ withSpacing: false });
    expect(wrapper.classes()).not.toContain('with-spacing');
  });

  it('renders without separator', () => {
    expect(wrapper.classes()).toContain('with-separator');
    wrapper.setProps({ withSeparator: false });
    expect(wrapper.classes()).not.toContain('with-separator');
  });

  it('renders action slot', () => {
    wrapper = renderComponent({}, { actions: 'foo' });
    expect(wrapper.find('.actions').text()).toBe('foo');
  });

  it('renders loading state', () => {
    wrapper = renderComponent({ loading: true }, { actions: 'foo' });
    expect(wrapper.find('.actions').text()).toBe('');
  });
});
