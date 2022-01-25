import { shallowMount } from '@vue/test-utils';
import { SplitViewLayout } from './SplitViewLayout';

describe(SplitViewLayout, (): void => {
  it('renders', (): void => {
    const splitViewLayout = shallowMount(SplitViewLayout);
    expect(splitViewLayout.contains(SplitViewLayout)).toBe(true);
  });

  it('has a loading class if loading', (): void => {
    const splitViewLayout = shallowMount(SplitViewLayout, {
      propsData: { loading: true }
    });

    expect(splitViewLayout.find('.lp-split-view-layout').classes()).toContain('loading');
  });
});
