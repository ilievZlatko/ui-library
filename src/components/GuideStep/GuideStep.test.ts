import { mount, Wrapper } from '@vue/test-utils';
import { Header } from '../Header/Header';
import { Icon } from '../icon/Icon';
import { GuideStep } from './GuideStep';

describe(GuideStep, () => {
  let wrapper: Wrapper<GuideStep>;
  const title = 'Test step';
  const subTitle = 'Test subTitle';

  beforeEach(() => (wrapper = renderComponent()));

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders title', () => {
    expect(wrapper.find<Header>(Header).vm.title).toBe(title);
  });

  it('renders subtitle', () => {
    expect(wrapper.find<Header>(Header).vm.subTitle).toBe(subTitle);
  });

  it('renders index', () => {
    expect(wrapper.find('.step-icon').text()).toBe('1');
  });

  it('renders content', () => {
    expect(wrapper.find('.slotted-content').exists()).toBe(true);
  });

  context('with icon', () => {
    beforeEach(() => (wrapper = renderComponent({ indexIcon: Icon.Type.INFO })));

    it('renders icon', () => {
      expect(wrapper.find<Icon>(Icon).exists()).toBe(true);
      expect(wrapper.find<Icon>(Icon).vm.type).toBe(Icon.Type.INFO);
    });
  });

  function renderComponent(props?: {}): Wrapper<GuideStep> {
    return mount(GuideStep, {
      slots: {
        default: '<div class="slotted-content"/>'
      },
      propsData: {
        indexIcon: 1,
        title,
        subTitle,
        ...props
      }
    });
  }
});
