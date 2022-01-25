import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import { KeyboardConstants } from 'leanplum-lib-common';
import { createTestHarness } from 'leanplum-lib-testing';
import { DateTime, Interval, Settings } from 'luxon';
import PortalVue from 'portal-vue';
import Vue from 'vue';
import { Button } from '../Button/Button';
import { Calendar } from '../Calendar/Calendar';
import { StargateTarget } from '../Stargate/StargateTarget';
import { TextInput } from '../TextInput/TextInput';
import { WrappedTextInput } from '../WrappedTextInput/WrappedTextInput';
import { DateRangePicker } from './DateRangePicker';
import { DateRangeShortcuts } from './Shortcuts/DateRangeShortcuts';

const defaultRange = Interval.fromDateTimes(
  DateTime.fromObject({ year: 2019, month: 7, day: 10 }).startOf('day'),
  DateTime.fromObject({ year: 2019, month: 9, day: 10 }).endOf('day')
);

const excludeDatesBefore = DateTime.fromObject({ year: 2019, month: 6, day: 1 });
const excludeDatesAfter = DateTime.fromObject({ year: 2019, month: 11, day: 1 });

describe(DateRangePicker, (): void => {
  let wrapper: Wrapper<Vue>;

  beforeEach((): void => {
    Settings.resetCaches();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('renders', () => {
    wrapper = renderHarness({
      range: defaultRange,
      label: 'Start date'
    });

    expect(wrapper.contains(DateRangePicker)).toBe(true);
    expect(wrapper.find(WrappedTextInput).props().value).toEqual(formatRange(defaultRange));
  });

  it('renders empty state without range', () => {
    wrapper = renderHarness({
      label: 'Start date'
    });

    expect(wrapper.contains(DateRangePicker)).toBe(true);
    expect(wrapper.find(WrappedTextInput).props().value).toEqual('');
  });

  it('should highlight error on empty "end" input', async () => {
    // When we render the component.
    wrapper = renderHarness({
      label: 'Start date'
    });

    // Open the dropdown.
    openDropdown();
    await Vue.nextTick();

    // Select a new date and try to apply.
    wrapper
      .findAll(Calendar)
      .at(0)
      .vm.$emit('update', DateTime.fromObject({ year: 2019, month: 5, day: 1 }));

    wrapper
      .findAll(Button)
      .at(1)
      .vm.$emit(Button.EVENT_CLICK);
    await Vue.nextTick();

    // Then the 'end' input should be marked with error
    const errorMsg = wrapper.findAll<TextInput>(TextInput).at(1).vm.error;
    expect(errorMsg).not.toBe(null);
    expect(errorMsg.length).not.toBe(0);
  });

  describe('label', () => {
    it('renders wrapped input when set', () => {
      wrapper = renderHarness({
        range: defaultRange,
        label: 'Start date'
      });

      expect(wrapper.find(WrappedTextInput).exists()).toBe(true);
    });

    it('renders regular input when empty', () => {
      wrapper = renderHarness({
        range: defaultRange
      });

      expect(wrapper.find(TextInput).exists()).toBe(true);
    });
  });

  describe('outline', () => {
    it('applies outline style with label', () => {
      wrapper = renderHarness({
        range: defaultRange,
        label: 'Start date',
        outline: true
      });

      expect(wrapper.find(WrappedTextInput).classes()).toContain('outline');
    });

    it('applies outline style without label', () => {
      wrapper = renderHarness({
        range: defaultRange,
        outline: true
      });

      expect(wrapper.find(TextInput).classes()).toContain('outline');
    });
  });

  context('default state', () => {
    beforeEach(() => {
      wrapper = renderHarness({
        range: defaultRange,
        label: 'Start date'
      });
    });

    it('opens the dropdown on input focus', async () => {
      assertDropdownIsVisible(false);

      // When we enter/focus on the input.
      wrapper.find(WrappedTextInput).vm.$emit('focus');
      await Vue.nextTick();

      // Then the dropdown should be open.
      assertDropdownIsVisible(true);
    });

    it('passes the correct props to the input component', async () => {
      // Then the dropdown should have the correct props.
      expect(wrapper.find(WrappedTextInput).props()).toMatchObject({
        value: formatRange(defaultRange),
        label: 'Start date',
        placeholder: 'YYYY/MM/DD - YYYY/MM/DD'
      });
    });

    it('updates the date when the text input changes', async () => {
      openDropdown();
      await Vue.nextTick();

      // Then enters a string value.
      wrapper.find(TextInput).vm.$emit('input', '6/15/2019');
      await Vue.nextTick();

      // Then it should update the dropdown and local value.
      expect(wrapper.find(Calendar).props().selected).toContainEqual(
        DateTime.fromObject({ year: 2019, month: 6, day: 15 })
      );
    });

    it('shows an error when the text value is invalid', async () => {
      openDropdown();
      await Vue.nextTick();

      // Then enters a string value.
      wrapper.find(TextInput).vm.$emit('input', '--NOT__A__DATE--');
      await Vue.nextTick();

      // Then it should show an error, and clear the dropdown value.
      expect(wrapper.find(TextInput).props().error).toEqual('Please enter a valid date');
      expect(wrapper.find(Calendar).props().selected).toEqual([defaultRange.end]);
    });

    it('does not emit a value when input is unfocused', async () => {
      openDropdown();
      await Vue.nextTick();

      // Then enters a string value.
      wrapper.find(TextInput).vm.$emit('input', '6/20/2019');
      await Vue.nextTick();

      // Then it should update the dropdown and local value.
      expect(wrapper.find(Calendar).props().selected).toContainEqual(
        DateTime.fromObject({ year: 2019, month: 6, day: 20 })
      );

      // When they click out.
      wrapper.find(TextInput).vm.$emit('blur');
      await Vue.nextTick();

      // It should not emit an event.
      assertNoEmits();
    });

    it('emits a value when applied and the value is different', async () => {
      openDropdown();
      await Vue.nextTick();

      // Then enters a string value.
      wrapper.find(TextInput).vm.$emit('input', '6/20/2019');
      await Vue.nextTick();

      // Then it should update the dropdown and local value.
      expect(wrapper.find(Calendar).props().selected).toContainEqual(
        DateTime.fromObject({ year: 2019, month: 6, day: 20 })
      );

      // When they submit the value.
      wrapper.find(TextInput).vm.$emit('submit');
      await Vue.nextTick();

      // And press apply.
      apply();
      await wrapper.vm.$nextTick();

      // Then it should emit a change event, with the correct day.
      assertDropdownIsVisible(false);
      assertEmittedRangeEquals(
        defaultRange.set({
          start: DateTime.fromObject({ year: 2019, month: 6, day: 20 }),
          end: defaultRange.end
        })
      );
    });

    it('the emitted interval is inclusive ', async () => {
      openDropdown();
      await Vue.nextTick();

      const start = DateTime.fromObject({ year: 2019, month: 7, day: 29 });
      wrapper.find(Calendar).vm.$emit('update', start);
      await Vue.nextTick();

      const end = DateTime.fromObject({ year: 2019, month: 8, day: 29 });
      wrapper
        .findAll(Calendar)
        .at(1)
        .vm.$emit('update', end);
      await Vue.nextTick();

      // And press apply.
      apply();
      await wrapper.vm.$nextTick();

      // Then it should emit a change event, with the correct day.
      assertDropdownIsVisible(false);
      assertEmittedRangeEquals(
        defaultRange.set({
          start: DateTime.fromObject({ year: 2019, month: 7, day: 29 }).startOf('day'),
          end: DateTime.fromObject({ year: 2019, month: 8, day: 29 }).endOf('day')
        })
      );
    });

    it('does not emit an event if the value is unchanged', async () => {
      openDropdown();
      await Vue.nextTick();

      // Then enters a string value.
      wrapper.find(TextInput).vm.$emit('input', '7/10/2019');
      await Vue.nextTick();

      // Then applied same date.
      apply();
      await Vue.nextTick();

      // Then it should NOT emit a change event.
      assertNoEmits();
    });

    it('stores the updated value locally when the dropdown emits an update', async () => {
      openDropdown();
      await Vue.nextTick();
      assertDropdownIsVisible(true);

      // When we update the date to July 29th.
      const newDate = DateTime.fromObject({ year: 2019, month: 7, day: 29 });
      wrapper.find(Calendar).vm.$emit('update', newDate);
      await Vue.nextTick();

      // Then, the picker should store the correct value and send to the input.
      expect(wrapper.find(TextInput).props().value).toEqual('07/29/2019');
    });

    it('stores the correct month when the dropdown emits an update', async () => {
      openDropdown();
      await Vue.nextTick();

      assertDropdownIsVisible(true);
      expect(wrapper.find(Calendar).props().currentMonth).toEqual(defaultRange.start);

      // When the dropdown emits a new month (on click prev or next).
      const lastMonth = DateTime.fromObject({ year: 2019, month: 8, day: 2 });
      wrapper.find(Calendar).vm.$emit('updateMonth', lastMonth);

      await Vue.nextTick();

      // Then, the picker should store that value until we close the cal.
      expect(wrapper.find(Calendar).props().currentMonth).toEqual(lastMonth);
      wrapper.trigger('keydown', { key: KeyboardConstants.ESC_KEY });

      await Vue.nextTick();

      // When we reopen the calendar, it should be reset to the month of the current value.
      openDropdown();

      await Vue.nextTick();

      expect(wrapper.find(Calendar).props().currentMonth).toEqual(defaultRange.start);
    });

    describe('on keydown', () => {
      it('does not close the dropdown on valid keydown', async () => {
        openDropdown();
        await Vue.nextTick();

        assertDropdownIsVisible(true);

        // Type a value...
        wrapper.find(WrappedTextInput).trigger('keydown', { key: '1' });
        await Vue.nextTick();

        // Then, the dropdown should remain open.
        assertDropdownIsVisible(true);
      });

      it('closes dropdown on ESC and resets value', async () => {
        openDropdown();
        await Vue.nextTick();

        assertDropdownIsVisible(true);

        // Make a change...
        wrapper.find(TextInput).vm.$emit('input', '7/5/2019');
        await Vue.nextTick();
        expect(wrapper.find(TextInput).props().value).toEqual('7/5/2019');

        // And click ESC.
        wrapper.find(WrappedTextInput).trigger('keydown', { key: KeyboardConstants.ESC_KEY });
        await Vue.nextTick();

        // Then, the dropdown should be closed, and the value reset.
        assertDropdownIsVisible(false);
        assertDisplayedRange('07/10/2019 - 09/10/2019');
        assertNoEmits();
      });

      it('closes dropdown on TAB and resets value', async () => {
        openDropdown();
        await Vue.nextTick();

        assertDropdownIsVisible(true);

        // Set a value.
        wrapper.find(TextInput).vm.$emit('input', '7/5/2019');
        await Vue.nextTick();
        expect(wrapper.find(TextInput).props().value).toEqual('7/5/2019');

        // And press tab.
        wrapper.find('.lp-daterangepicker-anchor').trigger('keydown', { key: KeyboardConstants.TAB_KEY });
        await Vue.nextTick();

        // Then, the dropdown should be closed, and the value reset.
        assertDropdownIsVisible(false);
        assertDisplayedRange('07/10/2019 - 09/10/2019');
        assertNoEmits();
      });
    });

    it('closes dropdown on body mousedown and resets value', async () => {
      openDropdown();
      await Vue.nextTick();

      assertDropdownIsVisible(true);

      // Set a value.
      wrapper.find(TextInput).vm.$emit('input', '7/5/2019');
      await Vue.nextTick();

      expect(wrapper.find(TextInput).props().value).toEqual('7/5/2019');

      // Then click outside the component (the harness, in this case)
      wrapper.trigger('mousedown');
      await Vue.nextTick();

      // Then, the dropdown should be closed, and the value reset.
      assertDropdownIsVisible(false);
      assertDisplayedRange('07/10/2019 - 09/10/2019');
      assertNoEmits();
    });

    it('shows an error when text value end date is before start date', async () => {
      openDropdown();
      await Vue.nextTick();

      const endInput = wrapper.findAll(TextInput).at(1);

      // When they try to set an end value below the start range date.
      endInput.vm.$emit('input', '5/1/2019');
      await Vue.nextTick();

      // Then it should show an error, and but set the dropdown value.
      expect(endInput.props().error).toEqual('Please choose a date on or after 07/10/2019');
      expect(wrapper.find(Calendar).props().selected).toContainEqual(
        DateTime.fromObject({ year: 2019, month: 5, day: 1 }).endOf('day')
      );
      expect(endInput.props().value).toEqual('5/1/2019');
    });

    it('shows an error when text value start date is after end date', async () => {
      openDropdown();
      await Vue.nextTick();

      const startInput = wrapper.find(TextInput);

      // When they try to set an end value below the start range date.
      startInput.vm.$emit('input', '5/1/2029');
      await Vue.nextTick();

      // Then it should show an error, and but set the dropdown value.
      expect(wrapper.find(TextInput).props().error).toEqual('Please choose a date on or before 09/10/2019');
      expect(wrapper.find(Calendar).props().selected[0]).toEqual(DateTime.fromObject({ year: 2029, month: 5, day: 1 }));
      expect(wrapper.find(TextInput).props().value).toEqual('5/1/2029');
    });
  });

  context('when disabled', () => {
    beforeEach(() => {
      wrapper = renderHarness({
        range: defaultRange,
        disabled: true
      });
    });

    it('prevents opening', async () => {
      openDropdown();
      await Vue.nextTick();

      assertDropdownIsVisible(false);
    });

    it('does not emit', async () => {
      // If somehow the inner component tries to update.
      wrapper.find(TextInput).vm.$emit('submit', '6/10/2019');
      await Vue.nextTick();

      assertNoEmits();
    });
  });

  context('min and max range', () => {
    beforeEach(() => {
      wrapper = renderHarness({
        range: defaultRange,
        label: 'Start date',
        excludeDatesBefore,
        excludeDatesAfter
      });
    });

    it('passes the correct props to the dropdown component', async () => {
      openDropdown();
      await Vue.nextTick();

      // Then the dropdown should have the correct props.
      expect(
        wrapper
          .findAll(Calendar)
          .at(0)
          .props()
      ).toMatchObject({
        selected: [defaultRange.start, defaultRange.end],
        excludeDatesBefore,
        excludeDatesAfter,
        currentMonth: defaultRange.start
      });

      expect(
        wrapper
          .findAll(Calendar)
          .at(1)
          .props()
      ).toMatchObject({
        selected: [defaultRange.start, defaultRange.end],
        excludeDatesBefore,
        excludeDatesAfter,
        currentMonth: defaultRange.start.plus({ months: 1 })
      });
    });

    it('shows an error when the text value is below the minimum', async () => {
      openDropdown();
      await Vue.nextTick();

      // When they try to set a value below the min.
      wrapper.find(TextInput).vm.$emit('input', '5/1/2019');
      await Vue.nextTick();

      // Then it should show an error, and but set the dropdown value.
      expect(wrapper.find(TextInput).props().error).toEqual('Please choose a date on or after 06/01/2019');
      expect(wrapper.find(Calendar).props().selected[0]).toMatchObject(
        DateTime.fromObject({ year: 2019, month: 5, day: 1 })
      );
      expect(wrapper.find(TextInput).props().value).toEqual('5/1/2019');
    });
  });

  describe('quick selections', () => {
    beforeEach(() => {
      wrapper = renderHarness({
        range: defaultRange,
        label: 'Start date',
        excludeDatesAfter,
        excludeDatesBefore,
        quickOptions: DateRangeShortcuts.DEFAULT
      });
    });

    it('emits change when clicking quick selections', async () => {
      openDropdown();
      await Vue.nextTick();

      // Selecting option.
      expect(wrapper.find(DateRangeShortcuts).exists()).toBe(true);
      wrapper.find('.option').trigger('click');
      await Vue.nextTick();

      apply();
      await Vue.nextTick();

      // Expect component to emit selected range.
      expect(wrapper.find(DateRangePicker).emitted().change.length).toBe(1);
    });

    it('selects as many days within min max range when selecting quick option', async () => {
      const fakeTime = DateTime.fromSQL('2019-07-10 12:00').toMillis();
      Settings.now = () => fakeTime;

      openDropdown();
      await Vue.nextTick();

      // Selecting option.
      expect(wrapper.find(DateRangeShortcuts).exists()).toBe(true);
      wrapper
        .findAll('.option')
        .at(DateRangeShortcuts.DEFAULT.length - 1)
        .trigger('click');

      await Vue.nextTick();

      // Expect component to emit selected range.
      expect(wrapper.find<Calendar>(Calendar).vm.selected[0]).toMatchObject(excludeDatesBefore);
    });

    it('propagates null', async () => {
      wrapper.setProps({ quickOptions: [{ label: 'All Time' }] });
      await wrapper.vm.$nextTick();

      openDropdown();
      await wrapper.vm.$nextTick();

      wrapper.find(DateRangeShortcuts).vm.$emit('select', null);

      apply();
      await Vue.nextTick();

      expect(wrapper.emitted().change).toMatchObject([[null]]);
    });
  });

  function renderHarness(props: DateRangePicker.Props): Wrapper<Vue> {
    const localVue = createLocalVue();
    localVue.use(PortalVue);

    const harness = createTestHarness(DateRangePicker, StargateTarget, ['change']);

    return mount(harness, {
      localVue,
      attachToDocument: true,
      propsData: props,
      sync: false
    });
  }

  function assertNoEmits(): void {
    expect(wrapper.find(DateRangePicker).emitted().change).toBeUndefined();
  }

  function assertEmittedRangeEquals(range: Interval): void {
    const emits: Array<Array<Interval>> = wrapper.find(DateRangePicker).emitted().change;
    const emittedTime: Interval = emits.slice(-1)[0][0];
    expect(emittedTime).toEqual(range);
  }

  function assertDisplayedRange(expected: string): void {
    const displayed: string = (wrapper.find('input').element as HTMLInputElement).value;

    expect(displayed).toEqual(expected);
  }

  function formatRange({ start, end }: Interval): string {
    return `${formatDate(start)} - ${formatDate(end)}`;
  }

  function formatDate({ year, month, day }: DateTime): string {
    return DateTime.local(year, month, day).toFormat('MM/dd/yyyy');
  }

  function assertDropdownIsVisible(isVisible: boolean): void {
    if (isVisible) {
      expect(wrapper.findAll(Calendar).length).toBe(2);
      expect(wrapper.find('.lp-daterangepicker-dropdown').findAll(TextInput).length).toBe(2);
    } else {
      expect(wrapper.findAll(Calendar).length).toBe(0);
      expect(wrapper.find('.lp-daterangepicker-dropdown').exists()).toBe(false);
    }
  }

  function openDropdown(): void {
    wrapper.find('.lp-daterangepicker-anchor').trigger('click');
  }

  function apply(): void {
    wrapper
      .findAll(Button)
      .filter((button) => button.props().text === 'Apply')
      .at(0)
      .vm.$emit('click');
  }
});
