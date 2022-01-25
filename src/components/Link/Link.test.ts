import { shallowMount, Wrapper } from '@vue/test-utils';
import { Icon } from '../icon/Icon';
import { Link } from './Link';

describe(
  Link,
  (): void => {
    let wrapper: Wrapper<Link>;

    function renderComponent(): Wrapper<Link> {
      return shallowMount(Link, {
        propsData: {
          text: 'Test',
          to: 'http://localhost:8080/dashboard'
        },
        stubs: ['router-link']
      });
    }

    beforeEach(() => (wrapper = renderComponent()));

    it('renders', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('renders link text', () => {
      expect(wrapper.html()).toContain('Test');
    });

    it('renders no icon', () => {
      expect(wrapper.find<Icon>(Icon).exists()).toBe(false);
    });

    it('renders icon if icon type provided', () => {
      wrapper.setProps({ icon: Icon.Type.ARROW_LEFT });
      expect(wrapper.find<Icon>(Icon).exists()).toBe(true);
    });
  }
);
