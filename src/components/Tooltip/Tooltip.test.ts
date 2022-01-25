import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import { createTestHarness } from 'leanplum-lib-testing';
import PortalVue from 'portal-vue';
import Vue, { VueConstructor } from 'vue';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Feedback } from '../Feedback/Feedback';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Tooltip } from './Tooltip';

describe(Tooltip, (): void => {
  let wrapper: Wrapper<Vue>;
  jest.useFakeTimers();

  afterEach(() => {
    wrapper.destroy();
  });

  it('renders the component', () => {
    wrapper = renderComponent();

    expect(wrapper.contains(Tooltip)).toBe(true);
  });

  it('renders in auto placement by default', () => {
    wrapper = renderComponent();

    expect(wrapper.find<Tooltip>(Tooltip).vm.placement).toBe(AnchoredPopup.Placement.RIGHT);
  });

  it('renders no arrow by default', () => {
    wrapper = renderComponent({ message: 'TEST_MESSAGE' });
    wrapper.find('.tooltip-anchor').trigger('mouseenter');

    jest.runAllTimers();

    expect(wrapper.find(Feedback).props('showArrow')).toBe(false);
  });

  it('renders arrow when needed', () => {
    wrapper = renderComponent({ message: 'Foo Bar', showArrow: true });
    wrapper.find('.tooltip-anchor').trigger('mouseenter');

    jest.runAllTimers();

    expect(wrapper.find(Feedback).props('showArrow')).toBe(true);
  });

  it('renders message after opening the portal', async () => {
    wrapper = renderComponent({ message: 'TEST_MESSAGE' });
    wrapper.find('.tooltip-anchor').trigger('mouseenter');

    jest.runAllTimers();

    expect(wrapper.find(StargateTarget).exists()).toBeTruthy();
    expect(wrapper.find(StargateTarget).text()).toBe('TEST_MESSAGE');
  });

  it('does not open popup when disabled', async () => {
    wrapper = renderComponent({ message: 'TEST_MESSAGE' });
    wrapper.setProps({ disabled: true });
    wrapper.find('.tooltip-anchor').trigger('mouseenter');
    jest.runAllTimers();

    expect(wrapper.find(StargateTarget).text()).toBe('');
  });
});

function renderComponent(propsData?: Record<string, unknown>): Wrapper<Vue> {
  const harness = createTestHarness(Tooltip, StargateTarget);
  const localVue: VueConstructor = createLocalVue();

  localVue.use(PortalVue);

  return mount(harness, {
    propsData,
    slots: {
      default: '<div class="tooltip-anchor"></div>'
    },
    localVue
  });
}
