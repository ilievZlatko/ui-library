import { shallowMount, Wrapper } from '@vue/test-utils';
import { mountVNode } from 'leanplum-lib-testing';
import { Button, Checkbox, Dropdown, Icon } from 'leanplum-lib-ui';
import Vue from 'vue';
import { FilterDropdown } from './FilterDropdown';

describe(FilterDropdown, () => {
  let wrapper: Wrapper<FilterDropdown>;

  const options = [
    { label: 'Filter1', value: '1', icon: Icon.Type.ACTION_APPINBOX },
    { label: 'Filter2', value: '2', icon: Icon.Type.ACTION_APPINBOX },
    { label: 'Filter3', value: '3', icon: Icon.Type.ACTION_APPINBOX }
  ];

  const text = 'Type';

  beforeEach(() => {
    wrapper = shallowMount(FilterDropdown, {
      propsData: {
        options,
        selected: options,
        text
      }
    });
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe(Button, () => {
    it('renders Button', () => {
      expect(wrapper.contains(Button));
    });

    it('renders text', () => {
      expect(button().vm.text).toContain(text);
    });

    it('renders textAll', () => {
      wrapper.setProps({ textAll: 'test all', selected: [...options] });

      expect(button().vm.text).toContain('test all');
    });

    it('propagates disabled', () => {
      wrapper.setProps({ disabled: true });
      expect(button().vm.disabled).toBe(true);
    });

    context('when in NOT_ALL badgeMode', () => {

      it('renders badge when no options are selected', () => {
        wrapper.setProps({ selected: [] });
        expect(button().vm.badge).toBe('0');
      });

      it('renders badge when some options are selected', () => {
        wrapper.setProps({ selected: options.slice(-1) });

        expect(button().vm.badge).toBe('1');
      });

      it('render no badge when all options are selected', () => {
        expect(button().vm.badge).toBe(null);
      });
    });

    context('when in NOT_NONE badgeMode', () => {
      beforeEach(() => wrapper.setProps({ badgeMode: FilterDropdown.BadgeMode.NOT_NONE }));
      afterEach(() => wrapper.setProps({ badgeMode: FilterDropdown.BadgeMode.NOT_ALL }));

      it('render no badge when no options are selected', async () => {
        wrapper.setProps({ selected: [] });
        await wrapper.vm.$nextTick();
        expect(button().vm.badge).toBe(null);
      });

      it('renders badge when some options are selected', () => {
        wrapper.setProps({ selected: options.slice(-1) });

        expect(button().vm.badge).toBe('1');
      });

      it('renders badge when all options are selected', () => {
        expect(button().vm.badge).toBe(options.length.toString());
      });
    });

    context('when in ALWAYS badgeMode', () => {
      beforeEach(() => wrapper.setProps({ badgeMode: FilterDropdown.BadgeMode.ALWAYS }));
      afterEach(() => wrapper.setProps({ badgeMode: FilterDropdown.BadgeMode.NOT_ALL }));

      it('renders badge when no options are selected', () => {
        wrapper.setProps({ selected: [] });
        expect(button().vm.badge).toBe('0');
      });

      it('renders badge when some options selected', () => {
        wrapper.setProps({ selected: options.slice(-1) });

        expect(button().vm.badge).toBe('1');
      });

      it('renders badge when all options are selected', () => {
        expect(button().vm.badge).toBe(options.length.toString());
      });
    });

    context('when in NEVER badgeMode', () => {
      beforeEach(() => wrapper.setProps({ badgeMode: FilterDropdown.BadgeMode.NEVER }));
      afterEach(() => wrapper.setProps({ badgeMode: FilterDropdown.BadgeMode.NOT_ALL }));

      it('render no badge when no options are selected', () => {
        wrapper.setProps({ selected: [] });
        expect(button().vm.badge).toBe(null);
      });

      it('render no badge when some options are selected', () => {
        wrapper.setProps({ selected: options.slice(-1) });

        expect(button().vm.badge).toBe(null);
      });

      it('renders no badge when all options are selected', () => {
        expect(button().vm.badge).toBe(null);
      });
    });

    function button(): Wrapper<Button> {
      return wrapper.find<Button>(Button);
    }
  });

  describe(Dropdown, () => {
    it('renders Dropdown', () => {
      expect(dropdown().exists()).toBe(true);
    });

    it('passes options', () => {
      expect(dropdown().vm.options).toMatchObject(options);
    });

    it('disables close on select', () => {
      expect(dropdown().vm.closeOnSelect).toBe(false);
    });

    it('propagates disabled', () => {
      wrapper.setProps({ disabled: true });
      expect(dropdown().vm.disabled).toBe(true);
    });

    it(`emits ${FilterDropdown.EVENT_CHANGE} without already selected value on select`, () => {
      dropdown().vm.$emit('select', options[2]);
      expect(wrapper.emitted(FilterDropdown.EVENT_CHANGE)).toMatchObject([[options.slice(0, 2)]]);
    });

    it(`emits ${FilterDropdown.EVENT_CHANGE} with new value on select`, () => {
      dropdown().vm.$emit('select', { value: '4' });
      expect(wrapper.emitted(FilterDropdown.EVENT_CHANGE)).toMatchObject([[[...options, { value: '4' }]]]);
    });

    describe('item.customRenderer', () => {
      it('renders', () => {
        expect(item().exists()).toBe(true);
      });

      it('renders Checkbox', () => {
        expect(item().contains(Checkbox)).toBe(true);
      });

      it('passes checked true when item() is included in selected', () => {
        expect(checkbox().vm.checked).toBe(true);
      });

      it('passes checked false when item() is not included in selected', () => {
        wrapper.setProps({ selected: [] });
        expect(checkbox().vm.checked).toBe(false);
      });

      it('renders Icon', () => {
        expect(item().find<Icon>(Icon).vm.type).toBe(options[0].icon);
      });

      it('renders label', () => {
        expect(item().text()).toContain(options[0].label);
      });

      it(`emits ${FilterDropdown.EVENT_CHANGE} with new value on Checkbox change`, () => {
        wrapper.setProps({ selected: options.slice(1, 3) });
        dropdown().vm.$emit('select', { value: '1' });
        expect(wrapper.emitted(FilterDropdown.EVENT_CHANGE)).toMatchObject([
          [[...options.slice(1, 3), { value: '1' }]]
        ]);
      });

      function checkbox(): Wrapper<Checkbox> {
        return item().find<Checkbox>(Checkbox);
      }
    });

    function item(): Wrapper<Vue> {
      return mountVNode((dropdown().vm.options[0] as Dropdown.Item).customRenderer?.(options[0])!);
    }

    function dropdown(): Wrapper<Dropdown> {
      return wrapper.find<Dropdown>(Dropdown);
    }
  });
});
