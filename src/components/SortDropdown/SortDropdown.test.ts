import { mount, Wrapper } from '@vue/test-utils';
import { createTestHarness } from 'leanplum-lib-testing';
import { AnchoredPopup, Button, Dropdown, Radio, StargateTarget, Table } from 'leanplum-lib-ui';
import values from 'lodash/values';
import Vue from 'vue';
import { SortDropdown } from './SortDropdown';

describe(SortDropdown, () => {
  let wrapper: Wrapper<Vue>;

  const options = ['tests', 'campaigns'];
  const direction = Table.SortDirection.DESCENDING;

  beforeEach(() => {
    wrapper = mount(
      createTestHarness(SortDropdown, StargateTarget, [
        SortDropdown.EVENT_CHANGE_DIRECTION,
        SortDropdown.EVENT_CHANGE_OPTION
      ]),
      {
        propsData: {
          options,
          direction,
          sortBy: options[0]
        }
      }
    );
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe(Dropdown, () => {
    it('renders Dropdown', () => {
      expect(wrapper.contains(Dropdown)).toBe(true);
    });

    it('propagates disabled', () => {
      wrapper.setProps({ disabled: true });
      expect(wrapper.find<Dropdown>(Dropdown).vm.disabled).toBe(true);
    });

    it('passes correct options', () => {
      expect(wrapper.find<Dropdown>(Dropdown).vm.options).toMatchObject([
        { header: 'Sort by' },
        {
          label: options[0],
          value: options[0]
        },
        {
          label: options[1],
          value: options[1]
        },
        { header: 'Sort order' },
        {
          label: 'Ascending',
          value: Table.SortDirection.ASCENDING
        },
        {
          label: 'Descending',
          value: Table.SortDirection.DESCENDING
        }
      ]);
    });

    it('passes correct options when provided options are only 1', () => {
      wrapper.setProps({ options: options.slice(1) });
      expect(wrapper.find<Dropdown>(Dropdown).vm.options).toMatchObject([
        { header: 'Sort order' },
        {
          label: 'Ascending',
          value: Table.SortDirection.ASCENDING
        },
        {
          label: 'Descending',
          value: Table.SortDirection.DESCENDING
        }
      ]);
    });

    it(`emits ${SortDropdown.EVENT_CHANGE_OPTION} when Dropdown emits select of option`, () => {
      wrapper.find(Dropdown).vm.$emit('select', { value: options[0] });
      expect(wrapper.emitted(SortDropdown.EVENT_CHANGE_OPTION)).toMatchObject([[options[0]]]);
    });

    it(`emits ${SortDropdown.EVENT_CHANGE_DIRECTION} when Dropdown emits select of direction`, () => {
      wrapper.find(Dropdown).vm.$emit('select', { value: Table.SortDirection.ASCENDING });
      expect(wrapper.emitted(SortDropdown.EVENT_CHANGE_DIRECTION)).toMatchObject([[Table.SortDirection.ASCENDING]]);
    });
  });

  describe(Button, () => {
    it('renders Button', () => {
      expect(wrapper.contains(Button)).toBe(true);
    });

    it('passes correct props', () => {
      expect(wrapper.find(Button).props()).toMatchObject({
        text: `Sort by ${options[0]}`,
        icon: expect.stringContaining('')
      });
    });

    it('propagates disabled', () => {
      wrapper.setProps({ disabled: true });
      expect(wrapper.find<Button>(Button).vm.disabled).toBe(true);
    });
  });

  describe(Radio, () => {
    beforeEach(() => {
      wrapper.find(AnchoredPopup).vm.$emit(AnchoredPopup.EVENT_TOGGLE, true);

      return wrapper.vm.$nextTick();
    });

    it('renders Radios for each options and direction', () => {
      expect(wrapper.findAll(Radio).wrappers).toHaveLength(options.length + values(Table.SortDirection).length);
    });

    it('passes correct props to option Radios', () => {
      const [op1, op2] = wrapper.findAll<Radio>(Radio).wrappers;
      expect(op1.vm.checked).toBe(true);
      expect(op2.vm.checked).toBe(false);
    });

    it('passes correct props to direction Radios', () => {
      const [dir1, dir2] = wrapper.findAll<Radio>(Radio).wrappers.slice(-2);
      expect(dir1.vm.checked).toBe(false);
      expect(dir2.vm.checked).toBe(true);
    });

    it(`emits ${SortDropdown.EVENT_CHANGE_OPTION} when selecting option Radio`, () => {
      wrapper
        .findAll(Radio)
        .at(1)
        .vm.$emit(Radio.EVENT_SELECT);
      expect(wrapper.emitted(SortDropdown.EVENT_CHANGE_OPTION)).toMatchObject([[options[1]]]);
    });

    it(`emits ${SortDropdown.EVENT_CHANGE_DIRECTION} when selecting direction Radio`, () => {
      wrapper
        .findAll(Radio)
        .at(2)
        .vm.$emit(Radio.EVENT_SELECT);
      expect(wrapper.emitted(SortDropdown.EVENT_CHANGE_DIRECTION)).toMatchObject([[Table.SortDirection.ASCENDING]]);
    });
  });
});
