import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import PortalVue from 'portal-vue';
import { Button } from '../Button/Button';
import { FileChooser } from './FileChooser';

// tslint:disable: no-any

const localVue = createLocalVue();
localVue.use(PortalVue);

describe(FileChooser, (): void => {
  it('renders the component', (): void => {
    const wrapper = mountComponent();

    expect(wrapper.isVueInstance()).toBeTruthy();
    expect(wrapper.find('.lp-file-chooser').exists()).toBeTruthy();
    expect(wrapper.find('.file-input-button').exists()).toBeTruthy();
  });

  it('renders provided button text', (): void => {
    const wrapper = mountComponent({ buttonText: 'Foo' });

    expect(wrapper.find(Button).props('text')).toBe('Foo');
  });

  it('renders provided button styles', (): void => {
    const wrapper = mountComponent({ buttonAppearance: Button.Appearance.OUTLINE, buttonColor: Button.Color.SUCCESS });

    expect(wrapper.find(Button).props('appearance')).toBe(Button.Appearance.OUTLINE);
    expect(wrapper.find(Button).props('color')).toBe(Button.Color.SUCCESS);
  });

  it('renders provided content', (): void => {
    const wrapper = mountComponent({}, { default: '<div class="foo-bar"></div>' });

    expect(wrapper.find('.file-input-content').exists()).toBe(true);
    expect(wrapper.find('.foo-bar').exists()).toBe(true);
  });

  it('renders component as enabled by default', (): void => {
    const wrapper = mountComponent();

    expect(wrapper.find(Button).props('disabled')).toBe(false);
  });

  it('renders component as disabled when specified', (): void => {
    const wrapper = mountComponent({ disabled: true });

    expect(wrapper.find(Button).props('disabled')).toBe(true);
  });

  it('renders clear button when specified', (): void => {
    const wrapper = mountComponent({ showClearButton: true });

    expect(wrapper.find('.file-input-clear').exists()).toBe(true);
    expect(wrapper.find('.file-input-clear').attributes('disabled')).toBeFalsy();
  });

  it('renders clear button as disabled when the component is disabled', (): void => {
    const wrapper = mountComponent({ showClearButton: true, disabled: true });

    expect(wrapper.find('.file-input-clear').exists()).toBe(true);
    expect(wrapper.find('.file-input-clear').attributes('disabled')).toBeTruthy();
  });

  it('emits `change` event with `File` value on selection', (): void => {
    const file: Partial<File> = { name: 'foo.txt', size: 123 };
    const wrapper = mountComponent();

    wrapper.find(Button).vm.$emit(Button.EVENT_FILE, file);

    expect(wrapper.emitted().change[0][0]).toBe(file);
    expect(wrapper.emitted().change[0][1]).toBeUndefined();
  });

  it('emits `change` event with `null` value on clear', (): void => {
    const wrapper = mountComponent({ showClearButton: true });

    wrapper.find('.file-input-clear').vm.$emit('click');

    expect(wrapper.emitted().change[0][0]).toBeNull();
  });
});

function mountComponent(props?: any, slots?: any): Wrapper<FileChooser> {
  return mount<FileChooser>(FileChooser, {
    localVue,
    propsData: { ...props },
    slots
  });
}
