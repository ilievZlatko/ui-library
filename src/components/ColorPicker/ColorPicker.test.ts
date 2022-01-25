import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import { createTestHarness } from 'leanplum-lib-testing';
import PortalVue from 'portal-vue';
import tinycolor from 'tinycolor2';
import Vue from 'vue';
import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';
import { StargateTarget } from '../Stargate/StargateTarget';
import { ColorPicker } from './ColorPicker';
import { HueSlider } from './sliders/hue/HueSlider';

describe('ColorPicker', () => {
  let mountedWrapper: Wrapper<Vue>;

  afterEach(() => {
    mountedWrapper.destroy();
  });

  it('should render', () => {
    const wrapper = renderComponent({ value: 'rgba(150,150,150,0.75)' });

    expect(wrapper.contains(ColorPicker)).toBeTruthy();
    expect(wrapper.find('.value-str').text()).toEqual('rgba(150, 150, 150, 0.75)');
    expect(wrapper.find(ColorPicker).classes()).not.toContain('new-ux');
  });

  it('should render even with a bad value', () => {
    const wrapper = renderComponent({ value: 'sanket' });

    expect(wrapper.contains(ColorPicker)).toBeTruthy();
    assertValueString(wrapper, 'rgba(0, 0, 0, 1)');
    expect(wrapper.contains(Modal)).toBeFalsy();
  });

  it('should allow directly changing the value using input field', async () => {
    const OLD_VALUE = 'rgba(150, 150, 150, 0.75)';
    const NEW_VALUE = 'rgba(120, 120, 120, 0.5)';

    const wrapper = renderComponent({ value: OLD_VALUE });

    // Ensure that no 'change' event has been emitted yet
    expect(wrapper.emitted().change).toBeUndefined();

    // Ensure that the current value displayed is the old vaulue
    assertValueString(wrapper, OLD_VALUE);

    // And the color picker is pristine
    assertPristine(wrapper, true);

    // When we open the color picker
    openColorPicker(wrapper);

    // And trigger a change using the input field
    await triggerInputChange(wrapper, NEW_VALUE);

    // Then the base value displayed outside the popup should still be the old value
    assertValueString(wrapper, OLD_VALUE);

    // But the component should be dirty (showing Reset and Save buttons)
    assertPristine(wrapper, false);

    // When we click the Save button
    findButtonOrFail(wrapper, 'Save').vm.$emit('click');

    // Then the component should fire the 'change' event
    expect(wrapper.emitted().change[0][0]).toEqual(NEW_VALUE);
  });

  it('should reset locals correctly after values were changed using input field', async () => {
    const wrapper = renderComponent({ value: 'rgba(150, 150, 150, 0.75)' });
    assertValueString(wrapper, 'rgba(150, 150, 150, 0.75)');

    openColorPicker(wrapper);
    await triggerInputChange(wrapper, 'rgba(120, 120, 120, 0.5)');

    expect((wrapper.find(HueSlider).props().color as tinycolor.Instance).toRgbString()).toEqual(
      'rgba(120, 120, 120, 0.5)'
    );
  });

  it('should reset the value when cross is clicked', () => {
    const wrapper = renderComponent({ value: 'rgba(150, 150, 150, 0.75)', clearButton: true });

    wrapper.find('.clear').trigger('click');

    expect(wrapper.emitted().clear).not.toBeUndefined();
  });

  it('should be disabled correctly', () => {
    const wrapper = renderComponent({ value: 'rgba(150, 150, 150, 0.75)', disabled: true });

    expect(wrapper.contains('.clear')).toBeFalsy();
    expect(wrapper.contains(Modal)).toBeFalsy();
    wrapper.find('.control').trigger('click');
    expect(wrapper.contains(Modal)).toBeFalsy();
  });

  it('applies the new styles correctly', (): void => {
    const wrapper = renderComponent({ useNewStyles: true });

    expect(wrapper.find(ColorPicker).classes()).toContain('new-ux');
  });

  function findButtonOrFail(wrapper: Wrapper<Vue>, text: string): Wrapper<Button> {
    const btn = wrapper.findAll<Button>(Button).wrappers.find((btn) => btn.text().indexOf(text) > -1) || null;

    expect(btn).not.toBeNull();

    return btn!;
  }

  function findButton(wrapper: Wrapper<Vue>, text: string): Wrapper<Button> | null {
    return wrapper.findAll<Button>(Button).wrappers.find((btn) => btn.text().indexOf(text) > -1) || null;
  }

  function openColorPicker(wrapper: Wrapper<Vue>): void {
    wrapper.find('.control').trigger('click');
    expect(wrapper.contains(Modal)).toBeTruthy();
    expect(wrapper.contains('.value-input')).toBeTruthy();
  }

  function assertPristine(wrapper: Wrapper<Vue>, isPristine: boolean): void {
    const btn = findButton(wrapper, 'Reset');

    // if the Reset button is not rendered yet, then the component is still pristine.
    expect(btn === null).toBe(isPristine);
  }

  function assertValueString(wrapper: Wrapper<Vue>, value: string): void {
    expect(wrapper.find('.value-str').text()).toEqual(value);
  }

  async function triggerInputChange(wrapper: Wrapper<Vue>, value: string): Promise<void> {
    expect(wrapper.contains('.value-input')).toBeTruthy();

    const input = wrapper.find('.value-input');
    (input.element as HTMLInputElement).value = value;
    input.trigger('change');

    await wrapper.vm.$nextTick();
  }

  function renderComponent(props: Record<string, unknown>): Wrapper<Vue> {
    const localVue = createLocalVue();
    localVue.use(PortalVue);

    const harness = createTestHarness(ColorPicker, StargateTarget, ['clear', 'input', 'change']);

    const wrapper = mount(harness, {
      propsData: {
        defaultValue: 'rgba(255, 255, 255, 0.5)',
        ...props
      },
      localVue
    });

    mountedWrapper = wrapper;

    return wrapper;
  }
});
