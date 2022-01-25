import { KeyboardConstants } from 'leanplum-lib-common';
import { cleanup, createTestHarness, fireEvent, render, RenderResult } from 'leanplum-lib-testing';
import { StargateTarget } from 'leanplum-lib-ui';
import PortalVue from 'portal-vue';
import Vue from 'vue';
import { HelpCenter } from './HelpCenter';

describe(HelpCenter, () => {
  afterEach(cleanup);

  it('renders', async () => {
    const { getByText } = renderComponent();

    await Vue.nextTick();

    getByText('3 Ways to Get Help');
  });

  it('emits close', async () => {
    const { emitted } = renderComponent();

    await Vue.nextTick();

    fireEvent.keyDown(document, { key: KeyboardConstants.ESC_KEY });

    await Vue.nextTick();

    expect(emitted().close).toBeDefined();
  });

  function renderComponent(): RenderResult {
    const harness = createTestHarness(HelpCenter, StargateTarget, ['close']);

    return render(harness, PortalVue);
  }
});
