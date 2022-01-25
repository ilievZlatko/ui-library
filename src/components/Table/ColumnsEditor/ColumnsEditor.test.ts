import { shallowMount, Wrapper } from '@vue/test-utils';
import { VueConstructor } from 'vue';
import { SlickItem, SlickList } from 'vue-slicksort';
import { Button } from '../../Button/Button';
import { Modal } from '../../Modal/Modal';
import { ColumnsEditor } from './ColumnsEditor';

const Item = (SlickItem as unknown) as VueConstructor;
const List = (SlickList as unknown) as VueConstructor;

describe(ColumnsEditor, () => {
  const storageKey = 'test-edit-columns';

  const columnOrderDescriptors: Array<ColumnsEditor.ColumnOrderDescriptor> = [
    { label: '1', locked: true, visible: true },
    { label: '2', locked: false, visible: true },
    { label: '4', locked: false, visible: false },
    { label: '3', locked: false, visible: false }
  ];

  const reordered: Array<ColumnsEditor.ColumnOrderDescriptor> = [
    { label: '3', locked: false, visible: false },
    { label: '2', locked: false, visible: true },
    { label: '4', locked: false, visible: false }
  ];

  let wrapper: Wrapper<ColumnsEditor>;

  beforeEach(() => {
    wrapper = shallowMount(ColumnsEditor, {
      propsData: {
        storageKey,
        columnOrderDescriptors,
        defaultColumnOrderDescriptors: columnOrderDescriptors
      }
    });
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders Button', () => {
    expect(wrapper.find<Button>(Button).vm.text).toBe('Edit Columns');
  });

  it('renders Modal on Button click', () => {
    openModal();
    expect(wrapper.contains(Modal)).toBe(true);
  });

  context('with opened Modal', () => {
    beforeEach(openModal);

    it('renders List', () => {
      expect(wrapper.contains(List)).toBe(true);
    });

    it('renders locked items', () => {
      columnOrderDescriptors
        .filter((x) => x.locked)
        .forEach(({ label }, i) =>
          expect(
            wrapper
              .findAll('.edit-column-item.locked')
              .at(i)
              .text()
          ).toBe(label)
        );
    });

    it('renders Item for not locked items', () => {
      columnOrderDescriptors
        .filter((x) => !x.locked)
        .forEach(({ label }, i) =>
          expect(
            wrapper
              .findAll(Item)
              .at(i)
              .text()
          ).toBe(label)
        );
    });

    it('orders items in List in the same order as the emitted value of the input event', () => {
      wrapper.find(List).vm.$emit('input', reordered);

      reordered.forEach(({ label }, i) =>
        expect(
          wrapper
            .findAll(Item)
            .at(i)
            .text()
        ).toBe(label)
      );
    });

    it('closes modal on cancel click', () => {
      button('cancel').vm.$emit(Button.EVENT_CLICK);
      expect(wrapper.contains(Modal)).toBe(false);
    });

    it('emits change event with items on apply click', () => {
      wrapper.find(List).vm.$emit('input', reordered);
      button('apply').vm.$emit(Button.EVENT_CLICK);
      expect(wrapper.emitted(ColumnsEditor.EVENT_CHANGE)).toMatchObject([
        [[{ label: '1', locked: true, visible: true }, ...reordered], false]
      ]);
    });

    it('resets items to default on reset click', () => {
      const defaultColumnOrderDescriptors = columnOrderDescriptors.slice().reverse();

      wrapper.setProps({ defaultColumnOrderDescriptors });
      wrapper.find(List).vm.$emit('input', reordered);
      button('reset').vm.$emit(Button.EVENT_CLICK);

      defaultColumnOrderDescriptors
        .filter((x) => !x.locked)
        .forEach(({ label }, i) =>
          expect(
            wrapper
              .findAll(Item)
              .at(i)
              .text()
          ).toBe(label)
        );
    });

    it('persists descriptors in localStorage', () => {
      wrapper.find(List).vm.$emit('input', reordered);
      expect(localStorage.getItem(storageKey)).toBe(
        JSON.stringify([{ label: '1', locked: true, visible: true }, ...reordered])
      );
    });
  });

  context('with persisted configuration', () => {
    const reversed = columnOrderDescriptors.slice().reverse();

    beforeAll(() => {
      localStorage.setItem(storageKey, JSON.stringify(reversed));
    });

    it('emits change event with configuration in storage', () => {
      expect(wrapper.emitted(ColumnsEditor.EVENT_CHANGE)).toMatchObject([[reversed, true]]);
    });

    context('prop value contains different columns', () => {
      beforeAll(() => {
        localStorage.setItem(storageKey, JSON.stringify(reordered));
      });

      it('does not emit change event', () => {
        expect(wrapper.emitted(ColumnsEditor.EVENT_CHANGE)).toBeUndefined();
      });
    });
  });

  function openModal(): void {
    wrapper.find(Button).vm.$emit(Button.EVENT_CLICK);
  }

  function button(text: string): Wrapper<Button> {
    return wrapper
      .find(Modal)
      .findAll<Button>(Button)
      .wrappers.find((x) => x.vm.text?.toLowerCase().includes(text))!;
  }
});
