import { shallowMount, Wrapper } from '@vue/test-utils';
import { Badge } from './Badge';

describe(Badge, () => {
  let wrapper: Wrapper<Badge>;

  beforeEach(() => {
    wrapper = shallowMount(Badge, { propsData: { text: 'test badge' } });
  });

  it('renders', () => {
    expect(wrapper.contains(Badge)).toBe(true);
  });

  it('renders text', () => {
    expect(wrapper.text()).toContain('test badge');
  });
});
