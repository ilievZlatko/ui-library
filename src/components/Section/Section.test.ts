import { mount, Slots, Wrapper } from '@vue/test-utils';
import { ErrorTooltip } from '../ErrorTooltip/ErrorTooltip';
import { Header } from '../Header/Header';
import { WarningTooltip } from '../WarningTooltip/WarningTooltip';
import { Section } from './Section';

describe(Section, (): void => {
  let wrapper: Wrapper<Section>;

  function renderComponent(propsData: object, slots?: Slots): Wrapper<Section> {
    return mount(Section, {
      propsData,
      slots
    });
  }

  beforeEach(() => (wrapper = renderComponent({ title: 'TestTitle' })));

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders title', () => {
    expect(wrapper.find<Header>(Header).vm.title).toBe('TestTitle');
  });

  it('renders subtitle', () => {
    wrapper.setProps({ subTitle: 'TestSubTitle' });
    expect(wrapper.find<Header>(Header).vm.subTitle).toBe('TestSubTitle');
  });

  it('renders warning border when in warn mode', () => {
    wrapper.setProps({ mode: Section.Mode.WARN });

    expect(wrapper.classes()).toContain('warn');
  });

  it('renders error border when in error mode', () => {
    wrapper.setProps({ mode: Section.Mode.ERROR });

    expect(wrapper.classes()).toContain('error');
  });

  it('renders warning', () => {
    wrapper.setProps({ warning: 'Test warning' });

    expect(wrapper.find<WarningTooltip>(WarningTooltip).exists()).toBe(true);
    expect(wrapper.classes()).toContain('warn');
  });

  it('renders error', () => {
    wrapper.setProps({ error: 'Test error' });

    expect(wrapper.find<ErrorTooltip>(ErrorTooltip).exists()).toBe(true);
    expect(wrapper.classes()).toContain('error');
  });

  it('renders error when both error and warning are provided', () => {
    wrapper.setProps({ error: 'Test error', warning: 'Test warning' });

    expect(wrapper.find<ErrorTooltip>(ErrorTooltip).exists()).toBe(true);
    expect(wrapper.classes()).toContain('error');
    expect(wrapper.find<WarningTooltip>(WarningTooltip).exists()).toBe(false);
    expect(wrapper.classes()).not.toContain('warn');
  });

  it('renders highlighted state', () => {
    wrapper = renderComponent({ highlighted: true }, { actions: 'foo' });

    expect(wrapper.classes()).toContain('highlighted');
  });

  it('renders loading state', () => {
    wrapper = renderComponent({ loading: true }, { actions: 'foo' });

    expect(wrapper.classes()).toContain('loading');
    expect(wrapper.find<Header>(Header).vm.loading).toBe(true);
  });

  it('renders inline styles', () => {
    wrapper = renderComponent({ inline: true });

    expect(wrapper.classes()).toContain('inline');
  });

  it('renders header without spacing when inline', () => {
    wrapper = renderComponent({ inline: true });

    expect(wrapper.find<Header>(Header).vm.withSpacing).toBe(false);
  });

  it('renders header without separator', () => {
    wrapper = renderComponent({ withSeparator: false });

    expect(wrapper.find<Header>(Header).vm.withSeparator).toBe(false);
  });

  it('emits "animationEnd" event', () => {
    wrapper.trigger('animationend');

    expect(wrapper.emitted(Section.EVENT_ANIMATION_END)?.length).toBe(1);
  });

  it('emits "click" event', () => {
    wrapper.trigger('click');

    expect(wrapper.emitted(Section.EVENT_CLICK)?.length).toBe(1);
  });
});
