import { createLocalVue, mount, Slots, Wrapper } from '@vue/test-utils';
import PortalVue from 'portal-vue';
import Vue, { VNode, VueConstructor } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { AutoPopup } from '../AutoPopup/AutoPopup';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Guide } from './Guide';

@Component({ name: 'GuideHarness' })
class GuideHarness extends Vue {
  @Prop() title: string;

  @Prop() message: string;

  @Prop() eventTrigger: string;

  render(): VNode {
    return (
      <div>
      <Guide title={this.title} message={this.message} eventTrigger={this.eventTrigger}>
          {this.$slots.default}
        </Guide>
        <StargateTarget />
      </div>
    );
  }
}

describe(Guide, (): void => {
  let wrapper: Wrapper<GuideHarness>;

  function renderComponent(message?: string, title?: string, slots?: Slots): Wrapper<GuideHarness> {
    const localVue: VueConstructor = createLocalVue();
    localVue.use(PortalVue);

    return mount(GuideHarness, {
      slots,
      propsData: {
        title,
        message,
        eventTrigger: AutoPopup.EventTrigger.CLICK
      },
      localVue
    });
  }

  afterEach(() => {
    wrapper.destroy();
  });

  context('with defaults', () => {
    beforeEach(() => (wrapper = renderComponent()));

    it('renders', () => {
      expect(wrapper.contains(Guide)).toBe(true);
    });

    it('renders in right placement', () => {
      expect(wrapper.find<Guide>(Guide).vm.placement).toBe(AutoPopup.Placement.RIGHT);
    });
  });

  describe('title', () => {
    beforeEach(() => (wrapper = renderComponent(undefined, 'TEST_TITLE')));

    it('renders title after opening portal', async () => {
      wrapper.find(Icon).trigger('click');

      await Vue.nextTick();

      expect(wrapper.html()).toContain('TEST_TITLE');
    });
  });

  describe('message', () => {
    beforeEach(() => (wrapper = renderComponent('TEST_MESSAGE')));

    it('renders content after opening portal', async () => {
      wrapper.find(Icon).trigger('click');

      await Vue.nextTick();

      expect(wrapper.find(StargateTarget).exists()).toBeTruthy();
      expect(wrapper.find(StargateTarget).html()).toContain('TEST_MESSAGE');
    });
  });

  describe('slotted default', () => {
    beforeEach(() => {
      wrapper = renderComponent(undefined, undefined, {
        default: {
          render(): VNode {
            return <div class="foo" />;
          }
        }
      });
    });

    it('renders slotted content when opened in portal', async () => {
      wrapper.find(Icon).trigger('click');

      await Vue.nextTick();

      expect(wrapper.find('.foo').exists()).toBe(true);
    });
  });
});
