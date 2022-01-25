import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import { KeyboardConstants } from 'leanplum-lib-common';
import PortalVue from 'portal-vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { StargateTarget } from '../Stargate/StargateTarget';
import { PortalPopper } from './PortalPopper';

describe(PortalPopper, () => {
  const PORTAL_CONTENT: string = 'SHOW_ME';
  let wrapper: Wrapper<Harness>;

  afterEach(() => {
    wrapper.destroy();
  });

  it('should render content through portal when opened', async () => {
    // Given a Harness with a portal popper.
    wrapper = renderHarness();
    await Vue.nextTick();

    expect(wrapper.html()).not.toContain(PORTAL_CONTENT);

    // When we open the popper by passing a new prop value.
    wrapper.setProps({ open: true });
    await Vue.nextTick();

    // It should show the content in the portal.
    expect(wrapper.find(StargateTarget).html()).toContain(PORTAL_CONTENT);
    expect(wrapper.find('.outside-portal').html()).not.toContain(PORTAL_CONTENT);
  });

  it('should render content through portal initial if showing is true', async () => {
    // Given a harness that sets open to true
    wrapper = renderHarness(true);
    await Vue.nextTick();

    // It should show the content in the portal.
    expect(wrapper.find(StargateTarget).html()).toContain(PORTAL_CONTENT);
    expect(wrapper.find('.outside-portal').html()).not.toContain(PORTAL_CONTENT);
  });

  it('should emit a "close" event on body mouse down when the popper is opened', async () => {
    // Given a Harness with a portal popper.
    wrapper = renderHarness();
    await Vue.nextTick();

    expect(wrapper.html()).not.toContain(PORTAL_CONTENT);

    // Click the body does not emit the event, while it's closed.
    wrapper.trigger('mousedown');
    await Vue.nextTick();

    expect(wrapper.find(PortalPopper).emitted().close).toBeUndefined();

    // When we open the popper.
    wrapper.setProps({ open: true });
    await Vue.nextTick();

    // It should show the content in the portal.
    expect(wrapper.find(StargateTarget).html()).toContain(PORTAL_CONTENT);
    expect(wrapper.find('.outside-portal').html()).not.toContain(PORTAL_CONTENT);

    // When the user clicks out.
    wrapper.trigger('mousedown');
    await Vue.nextTick();

    // It should emit the close event.
    expect(wrapper.find(PortalPopper).emitted().close).toHaveLength(1);

    // But not when they click inside the popper content.
    wrapper.find('h2').trigger('mousedown');
    expect(wrapper.find(PortalPopper).emitted().close).toHaveLength(1);
  });

  it('should emit a "close" event on ESC or TAB when the popper is opened', async () => {
    // Given a Harness with a portal popper.
    wrapper = renderHarness(true);
    await Vue.nextTick();

    // When the user clicks out.
    wrapper.trigger('keydown', { key: KeyboardConstants.ESC_KEY });
    await Vue.nextTick();

    expect(wrapper.find(PortalPopper).emitted().close).toHaveLength(1);

    wrapper.trigger('keydown', { key: KeyboardConstants.TAB_KEY });
    await Vue.nextTick();

    expect(wrapper.find(PortalPopper).emitted().close).toHaveLength(2);
  });

  @Component({ name: 'Harness' })
  class Harness extends Vue {
    private popperId: string = 'harness-popper';
    private anchorId: string = 'harness-anchor';

    @Prop({ required: true })
    open: boolean;

    render(): VNode {
      return (
        <div>
          <div class="outside-portal">
            <PortalPopper anchorId={this.anchorId} popperId={this.popperId} showing={this.open} placement="bottom">
              <h2 id={this.popperId}>{PORTAL_CONTENT}</h2>
            </PortalPopper>
          </div>
          <StargateTarget />
        </div>
      );
    }
  }

  const localVue = createLocalVue();
  localVue.use(PortalVue);

  function renderHarness(openPopper: boolean = false): Wrapper<Harness> {
    return mount(Harness, {
      attachToDocument: true,
      propsData: {
        open: openPopper
      },
      localVue,
      sync: false
    });
  }
});
