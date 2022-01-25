import { shallowMount, Wrapper } from '@vue/test-utils';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { LegendWrapper } from '../LegendWrapper/LegendWrapper';
import { OverflowableText } from '../OverflowableText/OverflowableText';
import { Dropdown } from './../Dropdown/Dropdown';
import { DropdownInput } from './DropdownInput';

describe(DropdownInput, (): void => {
  // tslint:disable-next-line:no-any
  const renderComponent = (propsData?: any) =>
    shallowMount(DropdownInput, {
      propsData: {
        label: '',
        items: [],
        ...propsData
      }
    });

  it('renders', () => {
    const wrapper = renderComponent();

    expect(wrapper).toBeTruthy();
  });

  it('passes `label` to LegendWrapper', () => {
    const wrapper = renderComponent({
      label: 'foo'
    });

    expect(wrapper.find(LegendWrapper).props().label).toEqual('foo');
  });

  it('passes `required` to LegendWrapper', () => {
    const wrapper = renderComponent({
      label: 'foo',
      required: true
    });

    expect(wrapper.find(LegendWrapper).props().required).toEqual(true);
  });

  it('passes `error` prop to LegendWrapper', () => {
    const wrapper = renderComponent({
      label: 'foo',
      error: 'error msg'
    });

    expect(wrapper.find(LegendWrapper).props().error).toEqual('error msg');
  });

  it('passes `clearLabel` to Dropdown', () => {
    const wrapper = renderComponent({
      label: 'foo',
      clearLabel: 'clear_test_label'
    });

    expect(wrapper.find(Dropdown).props().options[0].label).toEqual('clear_test_label');
  });

  it('passes `popupClass` prop to Dropdown', () => {
    const wrapper = renderComponent({
      popupClass: 'example'
    });

    expect(wrapper.find(Dropdown).props().popupClass).toBe('lp-dropdowninput-popup example');
  });

  it('passes `popupPlacement` prop to Dropdown', () => {
    const wrapper = renderComponent({
      popupPlacement: AnchoredPopup.Placement.BOTTOM_END
    });

    expect(wrapper.find(Dropdown).props().popupPlacement).toBe(AnchoredPopup.Placement.BOTTOM_END);

    wrapper.setProps({ popupPlacement: AnchoredPopup.Placement.TOP });

    expect(wrapper.find(Dropdown).props().popupPlacement).toBe(AnchoredPopup.Placement.TOP);
  });

  it('passes `alignWidths` to Dropdown', () => {
    const wrapper = renderComponent({
      label: 'foo',
      alignWidths: true
    });

    expect(wrapper.find(Dropdown).props().alignWidths).toBe(true);

    wrapper.setProps({ alignWidths: false });

    expect(wrapper.find(Dropdown).props().alignWidths).toBe(false);
  });

  it('passes `enableSearch` to Dropdown', () => {
    const wrapper = renderComponent({
      label: 'foo'
    });
    expect(wrapper.find(Dropdown).props().enableSearch).toBe(false);

    wrapper.setProps({ enableSearch: true });
    expect(wrapper.find(Dropdown).props().enableSearch).toBe(true);
  });

  context('with selected value', () => {
    let wrapper: Wrapper<DropdownInput>;
    const items = [
      { value: 0, label: 'Foo' },
      { value: 1, label: 'Bar' }
    ];

    beforeEach(() => {
      wrapper = renderComponent({
        value: 1,
        items
      });
    });

    afterEach(() => {
      wrapper.destroy();
    });

    it('shows current value as text', () => {
      expect(wrapper.find<OverflowableText>(OverflowableText).vm.text).toEqual('Bar');
    });

    it('updates displayed option on dropdown selection', () => {
      wrapper.find(Dropdown).vm.$emit('select', items[0]);

      expect(wrapper.find<OverflowableText>(OverflowableText).vm.text).toEqual(items[0].label);
    });

    it('propagates dropdown selection to input event (v-model)', () => {
      wrapper.find(Dropdown).vm.$emit('select', items[0]);

      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input.length).toBe(1);
      expect(wrapper.emitted().input[0][0]).toBe(items[0].value);
    });

    it('is expanded when selected value is a number', () => {
      wrapper.find(Dropdown).vm.$emit('select', items[1]);
      wrapper.find(Dropdown).vm.$emit('close');

      expect(wrapper.find(LegendWrapper).props().expanded).toBeTruthy();
    });
  });
});
