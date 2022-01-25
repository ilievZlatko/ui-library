import { shallowMount, Wrapper } from '@vue/test-utils';
import { Dictionary } from 'leanplum-lib-common';
import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';
import { ConfirmModal } from './ConfirmModal';

describe(ConfirmModal, (): void => {
  let wrapper: Wrapper<ConfirmModal>;

  function renderComponent(data?: Dictionary<unknown>): Wrapper<ConfirmModal> {
    return shallowMount(ConfirmModal, {
      slots: { default: '<p>Test content</p>' },
      propsData: {
        title: 'Test title',
        ...data
      }
    });
  }

  beforeEach(() => (wrapper = renderComponent()));

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  context('when not opened', () => {
    beforeEach(() => (wrapper = renderComponent({ opened: false })));

    it('renders nothing if not opened', () => {
      expect(wrapper.html()).toBeUndefined();
    });
  });

  it('renders custom title', () => {
    expect(wrapper.find<Modal>(Modal).vm.title).toBe('Test title');
  });

  it('renders slot content', () => {
    expect(wrapper.html()).toContain('Test content');
  });

  it('renders custom cancel button label', () => {
    wrapper.setProps({ cancelLabel: 'testCancel' });
    expect(wrapper.findAll<Button>(Button).at(0).vm.text).toBe('testCancel');
  });

  it('renders custom confirm button label', () => {
    wrapper.setProps({ confirmLabel: 'testConfirm' });
    expect(wrapper.findAll<Button>(Button).at(1).vm.text).toBe('testConfirm');
  });

  it('emits cancel event on cancel click', () => {
    expect(wrapper.emitted()[ConfirmModal.EVENT_CANCEL]).toBeUndefined();
    wrapper
      .findAll<Button>(Button)
      .at(0)
      .vm.$emit('click');
    expect(wrapper.emitted()[ConfirmModal.EVENT_CANCEL]).toBeDefined();
  });

  it('emits confirm event on confirm click', () => {
    expect(wrapper.emitted()[ConfirmModal.EVENT_CONFIRM]).toBeUndefined();
    wrapper
      .findAll<Button>(Button)
      .at(1)
      .vm.$emit('click');
    expect(wrapper.emitted()[ConfirmModal.EVENT_CONFIRM]).toBeDefined();
  });
});
