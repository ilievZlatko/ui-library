import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import PortalVue from 'portal-vue';
import Vue, { VNode, VueConstructor } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Icon } from '../icon/Icon';
import { PortalPopper } from '../PortalPopper/PortalPopper';
import { StargateTarget } from '../Stargate/StargateTarget';
import { AnchoredPopup } from './AnchoredPopup';

@Component({ name: 'PopupHarness' })
class PopupHarness extends Vue {
  public static readonly CONTENT: string = 'SIMPLE_TEXT';

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  opened: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  alignWidths: boolean;

  render(): VNode {
    return (
      <div>
        <AnchoredPopup opened={this.opened} alignWidths={this.alignWidths}>
          <template slot="anchor">
            <Icon type={Icon.Type.CLOSE} />
          </template>
          <template slot="content">
            <div>{PopupHarness.CONTENT}</div>
          </template>
        </AnchoredPopup>
        <StargateTarget />
      </div>
    );
  }
}

describe(AnchoredPopup, (): void => {
  let wrapper: Wrapper<PopupHarness>;

  function renderComponent(propsData: { opened?: boolean; alignWidths?: boolean }): Wrapper<PopupHarness> {
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

    it('renders in tooltip mode', () => {
      expect(wrapper.find(AnchoredPopup).props().opened).toBe(false);
    });

    it('renders in auto placement', () => {
      expect(wrapper.find(AnchoredPopup).props().placement).toBe(AnchoredPopup.Placement.AUTO);
    });

    it('renders content hidden by default', () => {
      expect(wrapper.find('.lp-anchored-popup').exists()).toBe(false);
    });

    it('renders without sizeToAnchor modifier', () => {
      expect(wrapper.find(PortalPopper).props().modifiers.sizeToAnchor).toBeUndefined();
    });
  });

  context('when opened', () => {
    beforeEach(() => (wrapper = renderComponent({ opened: true })));

    it('renders popup', () => {
      expect(wrapper.find('.lp-anchored-popup').exists()).toBe(true);
    });
  });

  context('when align widths set', () => {
    beforeEach(() => (wrapper = renderComponent({ alignWidths: true })));

    it('renders with modifiers', () => {
      expect(wrapper.find(PortalPopper).props().modifiers.sizeToAnchor).toBeDefined();
    });
  });
});
