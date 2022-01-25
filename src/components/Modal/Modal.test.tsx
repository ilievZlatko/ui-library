import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import { KeyboardConstants } from 'leanplum-lib-common';
import PortalVue from 'portal-vue';
import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Modal } from './Modal';

describe('Modal', () => {
  // This is needed to track all mounted wrappers. See cleanup fn below.
  let mountedWrapper: Wrapper<ModalHarness>;

  afterEach(() => {
    mountedWrapper.destroy();
  });

  it('should render with a title and default slot', async () => {
    const wrapper = renderComponent({ title: 'TESTING' });

    await Vue.nextTick();

    expect(wrapper.find(StargateTarget).text()).toContain('TESTING');
    expect(wrapper.find(StargateTarget).text()).toContain('UniqueBody');
  });

  it('should render with the correct root class names', async () => {
    await assertClassNames({ title: 'Hello ' }, 'lp-modal');
    await assertClassNames({ title: 'Hello ', alignTop: true }, 'lp-modal', 'align-top');
    await assertClassNames({ title: 'Hello', fullScreen: true }, 'lp-modal', 'full-screen');
    await assertClassNames({ title: 'Hello', spinner: Modal.Spinner.OVERLAY }, 'lp-modal');
    await assertClassNames({ title: 'Hello', spinner: Modal.Spinner.HIDDEN }, 'lp-modal');
    await assertClassNames({ title: 'Hello', spinner: Modal.Spinner.REPLACE_CONTENT }, 'lp-modal');

    async function assertClassNames(props: Modal.Props, ...classNames: Array<string>): Promise<void> {
      const wrapper = renderComponent(props);

      await Vue.nextTick();

      const modal = wrapper.find('.lp-modal');
      expect(wrapper.contains('.lp-modal')).toBe(true);
      expect(modal.classes()).toEqual(classNames);
    }
  });

  it('should render with the correct content class names', async () => {
    await assertClassNames({ title: 'Hello ' }, 'content');
    await assertClassNames({ title: 'Hello', fullScreen: true }, 'content');
    await assertClassNames({ title: 'Hello', spinner: Modal.Spinner.HIDDEN }, 'content');
    await assertClassNames({ title: 'Hello', spinner: Modal.Spinner.OVERLAY }, 'content', 'overlay-spinner');
    await assertClassNames(
      { title: 'Hello', spinner: Modal.Spinner.REPLACE_CONTENT },
      'content',
      'content-replacing-spinner'
    );

    async function assertClassNames(props: Modal.Props, ...classNames: Array<string>): Promise<void> {
      const wrapper = renderComponent(props);

      await Vue.nextTick();
      expect(classNames).toEqual(expect.arrayContaining(wrapper.find('.content').classes()));
    }
  });

  it('should render the spinner only if a valid prop is passed', async () => {
    await assertSpinnerState({ title: 'Hello', spinner: Modal.Spinner.HIDDEN }, false);
    await assertSpinnerState({ title: 'Hello', spinner: Modal.Spinner.OVERLAY }, true);
    await assertSpinnerState({ title: 'Hello', spinner: Modal.Spinner.REPLACE_CONTENT }, true);
    await assertSpinnerState({ title: 'Hello', spinner: 'asd' as Modal.Spinner }, false);

    async function assertSpinnerState(props: Modal.Props, showing: boolean): Promise<void> {
      const wrapper = renderComponent(props);

      await Vue.nextTick();

      expect(wrapper.contains('div.spinner-container')).toEqual(showing);
    }
  });

  describe('Emits close', () => {
    it('on ESC', async () => {
      // Given a Modal with escClose set to true.
      const wrapper = await renderComponent({ title: 'Hello', escClose: true });

      // When we click ESC.
      wrapper.trigger('keydown', { key: KeyboardConstants.ESC_KEY });

      // It should emit a close event.
      expect(wrapper.emitted().close).toBeDefined();
    });

    it('on overlay click', async () => {
      // Given a Modal with FadeClose set to true.
      const wrapper = await renderComponent({ title: 'Hello', fadeClose: true });

      // When we click the overlay.
      const modal = wrapper.find('.lp-modal');
      modal.trigger('click');
      await Vue.nextTick();

      // It should emit a close event.
      expect(wrapper.emitted().close).toBeDefined();
    });
  });

  @Component({ name: 'ModalHarness' })
  class ModalHarness extends Modal {
    mounted(): void {
      // No-op to override Modal.
    }

    render(): VNode {
      return (
        <div>
          <Modal
            title={this.title}
            width={this.width}
            minHeight={this.minHeight}
            fadeClose={this.fadeClose}
            escClose={this.escClose}
            closeButton={this.closeButton}
            spinner={this.spinner}
            fullScreen={this.fullScreen}
            alignTop={this.alignTop}
            bigTitle={this.bigTitle}
            onClose={() => this.$emit('close')}
          >
            <p>--UniqueBody--</p>
          </Modal>
          <StargateTarget />
        </div>
      );
    }
  }

  function renderComponent(propsData: Modal.Props): Wrapper<ModalHarness> {
    // Remove all previous wrappers from the DOM.
    if (mountedWrapper) {
      mountedWrapper.destroy();
    }

    // Render the new component.
    const localVue = createLocalVue();
    localVue.use(PortalVue);

    const wrapper = mount(ModalHarness, {
      propsData,
      attachToDocument: true,
      sync: false,
      localVue
    });

    mountedWrapper = wrapper;

    return wrapper;
  }
});
