import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import { copyToClipboard } from 'leanplum-lib-common';
import { createTestHarness } from 'leanplum-lib-testing';
import PortalVue from 'portal-vue';
import Vue from 'vue';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Tooltip } from '../Tooltip/Tooltip';
import { CopyText } from './CopyText';

describe(CopyText, (): void => {
  const TOOLTIP = 'TEST TOOLTIP';
  const TOOLTIP_COPIED = 'TEST TOOLTIP COPIED';
  let copyText: Wrapper<Vue>;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(PortalVue);

    const harness = createTestHarness(CopyText, StargateTarget);

    copyText = mount(harness, {
      propsData: { textToCopy: 'test text', tooltipText: TOOLTIP, tooltipTextCopied: TOOLTIP_COPIED },
      localVue
    });
  });

  afterEach(() => {
    copyText.destroy();
  });

  it('renders', (): void => {
    expect(copyText.contains(CopyText)).toBe(true);
  });

  it('places textToCopy text in clipboard', () => {
    copyText.find('span').trigger('click');

    expect(copyToClipboard).toHaveBeenCalledWith('test text');
  });

  it('changed the tooltip after copy', async () => {
    expect(copyText.find('.copy-text').html()).not.toContain(TOOLTIP_COPIED);

    copyText.find('.copy-text').trigger('click');
    await Vue.nextTick();

    expect(copyText.find<Tooltip>(Tooltip).vm.message).toBe(TOOLTIP_COPIED);
  });
});
