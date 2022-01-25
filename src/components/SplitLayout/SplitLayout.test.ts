import { shallowMount, Wrapper } from '@vue/test-utils';
import { Icon } from '../icon/Icon';
import { Pane, SplitLayout } from './SplitLayout';

describe(SplitLayout, () => {
  let wrapper: Wrapper<SplitLayout>;

  beforeAll(() => {
    // tslint:disable-next-line: no-any
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ width: 1000 } as any);
  });

  beforeEach(() => {
    wrapper = shallowMount(SplitLayout, {
      slots: {
        left: '<div id="left" />',
        right: '<div id="right" />'
      },
      propsData: {
        storageKey: 'test',
        leftMin: 300,
        rightMin: 300
      }
    });
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders left slot', () => {
    expect(wrapper.contains('#left')).toBe(true);
  });

  it('renders right slot', () => {
    expect(wrapper.contains('#right')).toBe(true);
  });

  it('renders separator in the middle', () => {
    expect(wrapper.find('.lp-split-pane-separator').element.style.transform).toBe('translateX(500px)');
  });

  it('renders separator indicator when enabled', () => {
    wrapper.setProps({ showResizeIndicator: true });
    expect(wrapper.contains('.lp-resize-indicator')).toBe(true);
  });

  it('renders collapsible button when collapsiblePane is provided', () => {
    wrapper.setProps({ collapsiblePane: Pane.LEFT });
    expect(wrapper.contains('.collapse-button')).toBe(true);
  });

  it('collapses the collapsible pane on collapse button click', () => {
    wrapper.setProps({ collapsiblePane: Pane.LEFT });
    wrapper.find(Icon).vm.$emit('click');
    expect(wrapper.find('.lp-split-pane').classes()).toContain('collapsed');
  });

  it('emits collapsedPaneChange on collapse button click', () => {
    wrapper.setProps({ collapsiblePane: Pane.LEFT });
    wrapper.find(Icon).vm.$emit('click');
    expect(wrapper.emitted(SplitLayout.EVENT_COLLAPSED_PANE_CHANGE)).toMatchObject([[Pane.LEFT]]);
  });

  it('expands pane when provided collapsed pane becomes null', () => {
    wrapper.setProps({ collapsedPane: Pane.LEFT });
    expect(wrapper.find('.lp-split-pane').classes()).toContain('collapsed');
    wrapper.setProps({ collapsedPane: null });
    expect(wrapper.find('.lp-split-pane').classes()).not.toContain('collapsed');
  });
});
