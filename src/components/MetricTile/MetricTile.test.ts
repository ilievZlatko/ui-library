import { mount, Wrapper } from '@vue/test-utils';
import { Icon } from '../icon/Icon';
import { MetricTile } from './MetricTile';

// tslint:disable:no-any

describe(MetricTile, () => {
  it('renders the component', () => {
    const wrapper = renderComponent();

    expect(wrapper.isVueInstance()).toBe(true);
  });

  it('applies the specified class name', () => {
    const wrapper = renderComponent({ className: 'foo' });

    expect(wrapper.find('.foo').exists()).toBe(true);
  });

  it('adds class when clickable', () => {
    const wrapper = renderComponent({ clickable: true });

    expect(wrapper.classes('clickable')).toBe(true);
  });

  it('adds class when loading', () => {
    const wrapper = renderComponent({ loading: true });

    expect(wrapper.classes('loading')).toBe(true);
  });

  it('displays correct title', () => {
    const wrapper = renderComponent({ title: 'FooBar' });

    expect(wrapper.text().includes('FooBar')).toBe(true);
  });

  it('displays correct value', () => {
    const wrapper = renderComponent({ value: 'Foo123' });

    expect(wrapper.text().includes('Foo123')).toBe(true);
  });

  it('renders total', () => {
    const wrapper = renderComponent({ value: 'Foo123', total: 'Bar123' });

    expect(wrapper.text().includes('Bar123')).toBe(true);
  });

  it('renders value hint', () => {
    const wrapper = renderComponent({ valueHint: 'foo', valueHintIcon: Icon.Type.EXCLAMATION_MEDIUM });
    const icon = wrapper.find('.tile-value').find(Icon);

    expect(icon.exists()).toBe(true);
    expect(icon.vm.$slots.tooltip![0].text).toBe('foo');
    expect(icon.props('type')).toBe(Icon.Type.EXCLAMATION_MEDIUM);
  });

  it('renders no value hint when loading', () => {
    const wrapper = renderComponent({ valueHint: 'foo', loading: true });

    expect(wrapper.find(Icon).exists()).toBe(false);
  });

  it('renders value subtext', () => {
    const wrapper = renderComponent({ valueSubtext: 'foo' });
    const subtext = wrapper.find('.value-subtext');

    expect(subtext.exists()).toBe(true);
    expect(subtext.text()).toBe('foo');
  });

  it('renders "below" slot content', () => {
    const wrapper = renderComponent({}, { below: '<div class="foo-bar">TestContent</div>' });

    expect(wrapper.find('.foo-bar').exists()).toBe(true);
  });

  it('renders "beside" slot content', () => {
    const wrapper = renderComponent({}, { beside: '<div class="foo-bar">TestContent</div>' });

    expect(wrapper.find('.foo-bar').exists()).toBe(true);
  });

  it('renders "valueHint" slot content', () => {
    const wrapper = renderComponent({}, { valueHint: '<div class="foo-bar">TestContent</div>' });

    // NOTE: The tooltip content doesn't render, it might be related to Tooltip component refactoring.
    expect(wrapper.find(Icon)?.vm.$slots.tooltip).toBeTruthy();
  });

  it('renders no "valueHint" slot when loading', () => {
    const wrapper = renderComponent({ loading: true }, { valueHint: '<div class="foo-bar">TestContent</div>' });

    expect(wrapper.find(Icon).exists()).toBe(false);
  });

  it('renders overlay when disabled', () => {
    const wrapper = renderComponent({ disabled: true });

    expect(wrapper.find('.disabled-overlay').exists()).toBe(true);
  });

  it('renders info icon with tooltip', () => {
    const wrapper = renderComponent({ tooltip: 'test' });

    expect(wrapper.find<Icon>(Icon).vm.tooltip).toBe('test');
  });

  it('emits `click` event on click', () => {
    const wrapper = renderComponent();

    wrapper.find('.tile-content').element.click();

    expect(wrapper.emitted('click')).toBeDefined();
  });

  describe('value size', () => {
    function assertStyles(valueSize: MetricTile.ValueSize, className: string = valueSize): () => void {
      return () => {
        const wrapper = renderComponent({ valueSize });
        expect(wrapper.find('.tile-value').classes()).toContain(className);
      };
    }

    it('applies correct styles when size is regular', assertStyles(MetricTile.ValueSize.REGULAR));

    it('applies correct styles when size is medium', assertStyles(MetricTile.ValueSize.MEDIUM));

    it('applies correct styles when size is large', assertStyles(MetricTile.ValueSize.LARGE));
  });
});

function renderComponent(props?: any, slots?: { below?: any; beside?: any; valueHint?: any }): Wrapper<MetricTile> {
  return mount(MetricTile, {
    propsData: {
      title: 'Test',
      value: '123',
      ...props
    },
    slots
  });
}
