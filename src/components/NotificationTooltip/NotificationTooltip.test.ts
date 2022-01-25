import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import { createTestHarness } from 'leanplum-lib-testing';
import PortalVue from 'portal-vue';
import Vue, { VueConstructor } from 'vue';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Tooltip } from '../Tooltip/Tooltip';
import { NotificationTooltip } from './NotificationTooltip';

describe(NotificationTooltip, (): void => {
  let wrapper: Wrapper<Vue>;

  function renderComponent(propsData: {} = {}): Wrapper<Vue> {
    const localVue: VueConstructor = createLocalVue();
    localVue.use(PortalVue);

    const harness = createTestHarness(NotificationTooltip, StargateTarget);

    return mount(harness, {
      propsData,
      localVue
    });
  }

  context('with defaults', () => {
    beforeEach(() => (wrapper = renderComponent()));
    afterEach(() => wrapper.destroy());

    it('renders', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('renders icon anchor', () => {
      expect(wrapper.find<Icon>(Icon).exists()).toBe(true);
    });

    it('passes default value to icon', () => {
      expect(wrapper.find<Icon>(Icon).vm.circle).toBe(Icon.Circle.INFO);
    });

    it('passes default value to tooltip', () => {
      expect(wrapper.find<Tooltip>(Tooltip).vm.type).toBe(Tooltip.Type.INFO);
    });
  });

  context('with error type', () => {
    beforeEach(() => (wrapper = renderComponent({ type: NotificationTooltip.Type.ERROR })));
    afterEach(() => wrapper.destroy());

    it('passes error type to icon', () => {
      expect(wrapper.find<Icon>(Icon).vm.circle).toBe(Icon.Circle.DANGER);
    });

    it('passes error type to tooltip', () => {
      expect(wrapper.find<Tooltip>(Tooltip).vm.type).toBe(Tooltip.Type.ERROR);
    });
  });

  context('with warn type', () => {
    beforeEach(() => (wrapper = renderComponent({ type: NotificationTooltip.Type.WARNING })));
    afterEach(() => wrapper.destroy());

    it('passes warn type to icon', () => {
      expect(wrapper.find<Icon>(Icon).vm.circle).toBe(Icon.Circle.WARNING);
    });

    it('passes warn type to tooltip', () => {
      expect(wrapper.find<Tooltip>(Tooltip).vm.type).toBe(Tooltip.Type.WARNING);
    });
  });
});
