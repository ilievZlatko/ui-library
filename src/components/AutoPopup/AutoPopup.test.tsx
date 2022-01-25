import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import PortalVue from 'portal-vue';
import Vue, { VNode, VueConstructor } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { AutoPopup } from './AutoPopup';

@Component({ name: 'PopupHarness' })
class PopupHarness extends Vue {
  public static readonly CONTENT: string = 'SIMPLE_TEXT';

  @Prop({
    type: String,
    required: false,
    default: () => AutoPopup.EventTrigger.CLICK
  })
  eventTrigger: AutoPopup.EventTrigger;

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  disabled: boolean;

  render(): VNode {
    return (
      <div>
        <AutoPopup eventTrigger={this.eventTrigger} disabled={this.disabled}>
          <Icon slot="anchor" type={Icon.Type.CLOSE} />
          <div id="popup-content" slot="content">
            {PopupHarness.CONTENT}
          </div>
        </AutoPopup>
        <StargateTarget />
      </div>
    );
  }
}

describe(AutoPopup, (): void => {
  let wrapper: Wrapper<PopupHarness>;

  async function triggerEvent(wrapper: Wrapper<Vue>, event: string): Promise<void> {
    wrapper.find<AnchoredPopup>(AnchoredPopup).vm.$emit(event);
    await flushPromises();
  }

  function renderComponent(propsData: {
    eventTrigger?: AutoPopup.EventTrigger;
    disabled?: boolean;
  }): Wrapper<PopupHarness> {
    const localVue: VueConstructor = createLocalVue();
    localVue.use(PortalVue);

    return mount(PopupHarness, {
      propsData,
      localVue
    });
  }

  afterEach(() => {
    wrapper.destroy();
  });

  context('with defaults', () => {
    beforeEach(() => (wrapper = renderComponent({})));

    it('renders', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('renders in "click" mode', () => {
      expect(wrapper.find<AutoPopup>(AutoPopup).vm.eventTrigger).toBe(AutoPopup.EventTrigger.CLICK);
    });

    it('passes placement prop to AnchoredPopup', () => {
      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.placement).toBe(AutoPopup.Placement.AUTO);
    });
  });

  context('in "click" mode', () => {
    beforeEach(() => (wrapper = renderComponent({ eventTrigger: AutoPopup.EventTrigger.CLICK })));

    it('renders in auto placement', () => {
      expect(wrapper.find(AutoPopup).props().placement).toBe(AutoPopup.Placement.AUTO);
    });

    it('does not render popup when anchor hover in', async () => {
      await triggerEvent(wrapper, 'anchorEnter');
      expect(wrapper.find('#popup-content').exists()).toBe(false);
    });

    it('renders popup when clicked', async () => {
      expect(wrapper.find('#popup-content').exists()).toBe(false);
      await triggerEvent(wrapper, 'anchorClick');
      expect(wrapper.find('#popup-content').exists()).toBe(true);
    });

    it('hides popup when clicked', async () => {
      expect(wrapper.find('#popup-content').exists()).toBe(false);
      await triggerEvent(wrapper, 'anchorClick');
      expect(wrapper.find('#popup-content').exists()).toBe(true);

      await triggerEvent(wrapper, 'anchorClick');
      expect(wrapper.find('#popup-content').exists()).toBe(false);
    });

    it('does not render popup when disabled', async () => {
      wrapper.setProps({ disabled: true });

      await triggerEvent(wrapper, 'anchorClick');

      expect(wrapper.contains('#popup-content')).toBe(false);
    });

    it('emits open event when opened', async () => {
      await triggerEvent(wrapper, 'anchorClick');

      expect(wrapper.find<AutoPopup>(AutoPopup).emitted('open')).toBeDefined();
    });

    it('emits close event when closed', async () => {
      await triggerEvent(wrapper, 'anchorClick'); // open
      await triggerEvent(wrapper, 'anchorClick'); // close

      expect(wrapper.find<AutoPopup>(AutoPopup).emitted('close')).toBeDefined();
    });
  });

  context('in "hover" mode', () => {
    beforeEach(() => (wrapper = renderComponent({ eventTrigger: AutoPopup.EventTrigger.HOVER })));

    it('renders popup when anchor hover in', async () => {
      await triggerEvent(wrapper, 'anchorEnter');
      expect(wrapper.find('#popup-content').exists()).toBe(true);
    });

    it('hides popup when anchor hover out', async () => {
      await triggerEvent(wrapper, 'anchorEnter');
      expect(wrapper.find('#popup-content').exists()).toBe(true);

      await triggerEvent(wrapper, 'anchorLeave');
      expect(wrapper.find('#popup-content').exists()).toBe(false);
    });

    it('hides popup when popup hover out', async () => {
      await triggerEvent(wrapper, 'anchorEnter');
      expect(wrapper.find('#popup-content').exists()).toBe(true);

      await triggerEvent(wrapper, 'popupLeave');
      expect(wrapper.find('#popup-content').exists()).toBe(false);
    });

    it('hides popup when clicked', async () => {
      expect(wrapper.find('#popup-content').exists()).toBe(false);
      await triggerEvent(wrapper, 'anchorEnter');
      expect(wrapper.find('#popup-content').exists()).toBe(true);

      await triggerEvent(wrapper, 'anchorClick');
      expect(wrapper.find('#popup-content').exists()).toBe(false);
    });
  });

  context('in "click_hover" mode', () => {
    beforeEach(() => (wrapper = renderComponent({ eventTrigger: AutoPopup.EventTrigger.CLICK_HOVER })));

    it('renders popup when clicked', async () => {
      expect(wrapper.find('#popup-content').exists()).toBe(false);
      await triggerEvent(wrapper, 'anchorClick');
      expect(wrapper.find('#popup-content').exists()).toBe(true);
    });

    it('hides popup when anchor hover out', async () => {
      await triggerEvent(wrapper, 'anchorClick');
      expect(wrapper.find('#popup-content').exists()).toBe(true);

      await triggerEvent(wrapper, 'anchorLeave');
      expect(wrapper.find('#popup-content').exists()).toBe(false);
    });

    it('hides popup when popup hover out', async () => {
      await triggerEvent(wrapper, 'anchorClick');
      expect(wrapper.find('#popup-content').exists()).toBe(true);

      await triggerEvent(wrapper, 'popupLeave');
      expect(wrapper.find('#popup-content').exists()).toBe(false);
    });
  });
});
