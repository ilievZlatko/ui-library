import { shallowMount, Wrapper } from '@vue/test-utils';
import { Icon } from 'leanplum-lib-ui';
import { Thumbnail } from '../../..';
import { OverflowableText } from '../OverflowableText/OverflowableText';

describe(Thumbnail, () => {
  let wrapper: Wrapper<Thumbnail>;

  const icon = Icon.Type.USER;

  beforeEach(() => {
    wrapper = shallowMount(Thumbnail, { propsData: { icon } });
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders Icon', () => {
    expect(wrapper.contains(Icon)).toBe(true);
  });

  it('passes icon as type to Icon', () => {
    wrapper.setProps({ clickable: true });
    expect(wrapper.find<Icon>(Icon).vm.type).toBe(icon);
  });

  it('passes hoverIcon as type ot Icon when hovered is true', () => {
    const hoverIcon = Icon.Type.UPLOAD;
    wrapper.setProps({ hovered: true, hoverIcon });
    expect(wrapper.find<Icon>(Icon).vm.type).toBe(hoverIcon);
  });

  it('passes size to Icon', () => {
    const size = 50;
    wrapper.setProps({ size });
    expect(wrapper.find<Icon>(Icon).vm.size).toBe(size);
  });

  it('calculates padding to accommodate for an svg of size 20px', () => {
    wrapper.setProps({ size: 50 });
    expect(wrapper.find<Icon>(Icon).vm.padding).toBe(15);
  });

  it('renders title', () => {
    const title = 'title';
    wrapper.setProps({ title });
    expect(wrapper.find<OverflowableText>(OverflowableText).vm.text).toBe(title);
  });

  it('renders subtitle', () => {
    const subtitle = 'subtitle';
    wrapper.setProps({ subtitle });
    expect(wrapper.find<OverflowableText>(OverflowableText).vm.text).toBe(subtitle);
  });
});
