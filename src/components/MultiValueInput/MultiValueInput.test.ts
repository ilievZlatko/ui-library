import { mount, Wrapper } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import { KeyboardConstants } from 'leanplum-lib-common';
import { Button } from '../Button/Button';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import { Dropdown } from '../Dropdown/Dropdown';
import { ErrorTooltip } from '../ErrorTooltip/ErrorTooltip';
import { Pill } from '../Pill/Pill';
import { MultiValueInput } from './MultiValueInput';

describe(MultiValueInput, (): void => {
  let wrapper: Wrapper<MultiValueInput>;

  function renderComponent(props?: {}): Wrapper<MultiValueInput> {
    return mount(MultiValueInput, {
      propsData: {
        pills: [],
        ...props
      }
    });
  }

  context('empty', () => {
    beforeEach(() => (wrapper = renderComponent()));

    it('renders', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('renders no pills', () => {
      expect(wrapper.find(Pill).exists()).toBe(false);
    });

    it('renders typeahead dropdown', () => {
      expect(wrapper.find(Dropdown).exists()).toBe(true);
    });

    it('renders button', () => {
      expect(wrapper.find(Button).exists()).toBe(true);
    });

    it('emits select event on typeahead select', () => {
      expect(wrapper.emitted(MultiValueInput.EVENT_CHANGE)).toBeUndefined();
      wrapper.find<Dropdown>(Dropdown).vm.$emit('select', { label: 'new_val' });
      expect(wrapper.emitted(MultiValueInput.EVENT_CHANGE)[0][0]).toMatchObject(['new_val']);
    });

    it('renders input and dropdown after typeahead select and update', async () => {
      wrapper.find<Dropdown>(Dropdown).vm.$emit('select', { label: 'new_val' });
      wrapper.setProps({ pills: ['new_val']});
      await flushPromises();
      expect(wrapper.find(Dropdown).exists()).toBe(true);
    });

    it('renders input and dropdown after ENTER keyup and update', async () => {
      (wrapper.find('input').element as HTMLInputElement).value = 'test';
      wrapper.find('input').trigger('input');
      wrapper.find('input').trigger('keyup', { key: KeyboardConstants.ENTER_KEY });
      wrapper.setProps({ pills: ['test']});
      await flushPromises();
      expect(wrapper.find(Dropdown).exists()).toBe(true);
    });

    it('emits input event on input value change', () => {
      expect(wrapper.emitted(MultiValueInput.EVENT_INPUT)).toBeUndefined();
      wrapper.find('input').trigger('keyup');
      expect(wrapper.emitted(MultiValueInput.EVENT_INPUT)).toBeDefined();
    });

    it('emits button click event on button click', () => {
      expect(wrapper.emitted(MultiValueInput.EVENT_BUTTON_CLICK)).not.toBeDefined();
      wrapper.find<Button>(Button).vm.$emit(Button.EVENT_CLICK);
      expect(wrapper.emitted(MultiValueInput.EVENT_BUTTON_CLICK)).toBeDefined();
    });

    it('supports multi value paste', async () => {
      expect(wrapper.emitted(MultiValueInput.EVENT_CHANGE)).toBeUndefined();

      const text = `a	b
        c, d`;

        wrapper.find('input').trigger('paste', {
        clipboardData: {
          getData(): string {
            return text;
          }
        }
      });
      await flushPromises();

      expect(wrapper.emitted(MultiValueInput.EVENT_CHANGE)[0][0]).toMatchObject(['a', 'b', 'c', 'd']);
    });

    context('with char limit', () => {
      const MAX_CHAR_LENGTH: number = 200;
      beforeEach(() => (wrapper = renderComponent({ maxLength: MAX_CHAR_LENGTH })));

      it('passes char limit to text input', () => {
        expect(wrapper.find('input').attributes('maxlength')).toBe(MAX_CHAR_LENGTH.toString());
      });
    });

    context('with pills limit', () => {
      const MAX_PILLS: number = 2;
      beforeEach(() => (wrapper = renderComponent({ maxPillCount: MAX_PILLS })));

      it('shows confirm paste modal when over the limit', async () => {
        expect(wrapper.find<ConfirmModal>(ConfirmModal).exists()).toBe(false);

        const text = `a, b, c, d`;

          wrapper.find('input').trigger('paste', {
          clipboardData: {
            getData(): string {
              return text;
            }
          }
        });
        await flushPromises();

        expect(wrapper.find<ConfirmModal>(ConfirmModal).exists()).toBe(true);
      });

      it('inserts values up to the limit', async () => {
        expect(wrapper.emitted(MultiValueInput.EVENT_CHANGE)).toBeUndefined();

        const text = `a, b, c, d`;

          wrapper.find('input').trigger('paste', {
          clipboardData: {
            getData(): string {
              return text;
            }
          }
        });
        await flushPromises();

        wrapper.find<ConfirmModal>(ConfirmModal).vm.$emit(ConfirmModal.EVENT_CONFIRM);

        expect(wrapper.emitted(MultiValueInput.EVENT_CHANGE)[0][0]).toMatchObject(['a', 'b']);
      });
    });
  });

  context('with 2 pills', () => {
    beforeEach(() => wrapper = renderComponent({ pills: ['1', '2']}));

    it('renders 2 pills', () => {
      expect(wrapper.findAll(Pill).length).toBe(2);
    });

    it('renders no typeahead dropdown', () => {
      expect(wrapper.find('input').exists()).toBe(false);
    });

    it('renders input after pill click event', async () => {
      wrapper.find<Pill>(Pill).vm.$emit(Pill.EVENT_CLICK);
      await flushPromises();
      expect(wrapper.find('input').exists()).toBe(true);
    });

    it('renders input after button click', async () => {
      wrapper.find<Button>(Button).vm.$emit(Button.EVENT_CLICK);
      await flushPromises();
      expect(wrapper.find('input').exists()).toBe(true);
    });

    it('emits no change after input ENTER_KEY event without changes', async () => {
      expect(wrapper.emitted(MultiValueInput.EVENT_CHANGE)).toBeUndefined();

      wrapper.find<Pill>(Pill).vm.$emit(Pill.EVENT_CLICK);
      await flushPromises();
      wrapper.find('input').trigger('keyup', { key: KeyboardConstants.ENTER_KEY });

      expect(wrapper.emitted(MultiValueInput.EVENT_CHANGE)).toBeUndefined();
    });

    it('emits change after input ENTER_KEY event with changes', async () => {
      expect(wrapper.emitted(MultiValueInput.EVENT_CHANGE)).toBeUndefined();

      wrapper.find<Pill>(Pill).vm.$emit(Pill.EVENT_CLICK);
      await flushPromises();
      (wrapper.find('input').element as HTMLInputElement).value = 'test';
      wrapper.find('input').trigger('input');
      wrapper.find('input').trigger('keyup', { key: KeyboardConstants.ENTER_KEY });

      expect(wrapper.emitted(MultiValueInput.EVENT_CHANGE)[0][0]).toMatchObject(['test', '2']);
    });

    it('emits change after pill close event', () => {
      expect(wrapper.emitted(MultiValueInput.EVENT_CHANGE)).toBeUndefined();
      wrapper.find<Pill>(Pill).vm.$emit(Pill.EVENT_CLOSE);
      expect(wrapper.emitted(MultiValueInput.EVENT_CHANGE)[0][0]).toMatchObject(['2']);
    });

    it('shows no error by default', () => {
      expect(wrapper.find(ErrorTooltip).exists()).toBe(false);
    });

    it('passes error message to pill', () => {
      wrapper.setProps({ errors: [['test error'], []] });
      expect(wrapper.findAll<Pill>(Pill).at(0).vm.error).toMatchObject(['test error']);
      expect(wrapper.findAll<Pill>(Pill).at(1).vm.error).toMatchObject([]);
    });

    it('passes warn message to pill', () => {
      wrapper.setProps({ warnings: [[], ['test warn']] });
      expect(wrapper.findAll<Pill>(Pill).at(0).vm.warning).toMatchObject([]);
      expect(wrapper.findAll<Pill>(Pill).at(1).vm.warning).toMatchObject(['test warn']);
    });

    it('shows input error', async () => {
      wrapper.find<Button>(Button).vm.$emit(Button.EVENT_CLICK);
      await flushPromises();

      expect(wrapper.find('input').classes()).not.toContain('error');
      wrapper.setProps({ errors: [[], [], ['test error']] });
      expect(wrapper.find('input').classes()).toContain('error');
    });

    it('shows input warning', async () => {
      wrapper.find<Button>(Button).vm.$emit(Button.EVENT_CLICK);
      await flushPromises();

      expect(wrapper.find('input').classes()).not.toContain('warning');
      wrapper.setProps({ warnings: [[], [], ['test warning']] });
      expect(wrapper.find('input').classes()).toContain('warning');
    });

    it('shows only input error when error and warning are set', async () => {
      wrapper.find<Button>(Button).vm.$emit(Button.EVENT_CLICK);
      await flushPromises();

      expect(wrapper.find('input').classes()).not.toContain('error');
      expect(wrapper.find('input').classes()).not.toContain('warning');
      wrapper.setProps({ errors: [[], [], ['test error']], warnings: [[], [], ['test warning']] });
      expect(wrapper.find('input').classes()).toContain('error');
      expect(wrapper.find('input').classes()).not.toContain('warning');
    });

    context('with pills limit', () => {
      const MAX_PILLS: number = 4;
      beforeEach(() => (wrapper = renderComponent({ pills: ['1', '2'], maxPillCount: MAX_PILLS })));

      it('shows confirm paste modal when over the limit', async () => {
        wrapper.find<Button>(Button).vm.$emit(Button.EVENT_CLICK);
        await flushPromises();

        expect(wrapper.find<ConfirmModal>(ConfirmModal).exists()).toBe(false);

        const text = `a, b, c, d`;

          wrapper.find('input').trigger('paste', {
          clipboardData: {
            getData(): string {
              return text;
            }
          }
        });
        await flushPromises();

        expect(wrapper.find<ConfirmModal>(ConfirmModal).exists()).toBe(true);
      });

      it('inserts values up to the limit', async () => {
        wrapper.find<Button>(Button).vm.$emit(Button.EVENT_CLICK);
        await flushPromises();

        expect(wrapper.emitted(MultiValueInput.EVENT_CHANGE)).toBeUndefined();

        const text = `a, b, c, d`;

          wrapper.find('input').trigger('paste', {
          clipboardData: {
            getData(): string {
              return text;
            }
          }
        });
        await flushPromises();

        wrapper.find<ConfirmModal>(ConfirmModal).vm.$emit(ConfirmModal.EVENT_CONFIRM);

        expect(wrapper.emitted(MultiValueInput.EVENT_CHANGE)[0][0]).toMatchObject(['1', '2', 'a', 'b']);
      });
    });
  });
});
