import { shallowMount, Wrapper } from '@vue/test-utils';
import { DateObjectUnits, DateTime } from 'luxon';
import { IncrementalInput } from '../IncrementalInput/IncrementalInput';
import { TimeInput } from './TimeInput';

describe(TimeInput, () => {
  let wrapper: Wrapper<TimeInput>;

  beforeEach(() => {
    wrapper = renderComponent({ value: DateTime.fromObject({ hour: 11, minute: 25 }) });
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the correct values', () => {
    assertDisplayedTime('11', '25', 'AM');
  });

  it('updates inputs on change value', () => {
    wrapper.setProps({ value: DateTime.fromObject({ hour: 6, minute: 40 }) });
    assertDisplayedTime('06', '40', 'AM');
  });

  describe('hour', () => {
    let hour: Wrapper<IncrementalInput>;

    beforeEach(() => {
      hour = wrapper.find<IncrementalInput>(IncrementalInput);
    });

    it(`updates on ${IncrementalInput.EVENT_UP}`, () => {
      hour.vm.$emit(IncrementalInput.EVENT_UP);
      assertDisplayedTime('12', '25', 'PM');
      assertEmittedTime({ hour: 12, minute: 25 });
    });

    it(`updates on ${IncrementalInput.EVENT_DOWN}`, () => {
      hour.vm.$emit(IncrementalInput.EVENT_DOWN);
      assertDisplayedTime('10', '25', 'AM');
      assertEmittedTime({ hour: 10, minute: 25 });
    });

    it(`updates on ${IncrementalInput.EVENT_CHANGE}`, () => {
      hour.vm.$emit(IncrementalInput.EVENT_CHANGE, '6');
      assertDisplayedTime('6', '25', 'AM');
      assertEmittedTime({ hour: 6, minute: 25 });
    });
  });

  describe('minute', () => {
    let minute: Wrapper<IncrementalInput>;

    beforeEach(() => {
      minute = wrapper.findAll<IncrementalInput>(IncrementalInput).at(1);
    });

    it(`updates on ${IncrementalInput.EVENT_UP}`, () => {
      minute.vm.$emit(IncrementalInput.EVENT_UP);
      assertDisplayedTime('11', '30', 'AM');
      assertEmittedTime({ hour: 11, minute: 30 });
    });

    it(`updates on ${IncrementalInput.EVENT_DOWN}`, () => {
      minute.vm.$emit(IncrementalInput.EVENT_DOWN);
      assertDisplayedTime('11', '20', 'AM');
      assertEmittedTime({ hour: 11, minute: 20 });
    });

    it(`updates on ${IncrementalInput.EVENT_CHANGE}`, () => {
      minute.vm.$emit(IncrementalInput.EVENT_CHANGE, '10');
      assertDisplayedTime('11', '10', 'AM');
      assertEmittedTime({ hour: 11, minute: 10 });
    });
  });

  describe('meridian', () => {
    let meridian: Wrapper<IncrementalInput>;

    beforeEach(() => {
      meridian = wrapper.findAll<IncrementalInput>(IncrementalInput).at(2);
    });

    it(`updates on ${IncrementalInput.EVENT_UP}`, () => {
      meridian.vm.$emit(IncrementalInput.EVENT_UP);
      assertDisplayedTime('11', '25', 'PM');
      assertEmittedTime({ hour: 23, minute: 25 });
    });

    it(`updates on ${IncrementalInput.EVENT_DOWN}`, () => {
      meridian.vm.$emit(IncrementalInput.EVENT_DOWN);
      assertDisplayedTime('11', '25', 'PM');
      assertEmittedTime({ hour: 23, minute: 25 });
    });
  });

  context('invalid', () => {
    describe('hour', () => {
      it('sets error on invalid hour input', () => {
        const hour = wrapper.find<IncrementalInput>(IncrementalInput);

        hour.vm.$emit(IncrementalInput.EVENT_CHANGE, '——INVALID——');

        expect(hour.vm.error).toBeDefined();
        assertNoEmits();
        assertDisplayedTime('——INVALID——', '25', 'AM');
      });

      it('sets error on below range hour input', () => {
        const hour = wrapper.find<IncrementalInput>(IncrementalInput);

        hour.vm.$emit(IncrementalInput.EVENT_CHANGE, '0');

        expect(hour.vm.error).toBeDefined();
        assertNoEmits();
        assertDisplayedTime('0', '25', 'AM');
      });

      it('sets error on above range hour input', () => {
        const hour = wrapper.find<IncrementalInput>(IncrementalInput);

        hour.vm.$emit(IncrementalInput.EVENT_CHANGE, '13');

        expect(hour.vm.error).toBeDefined();
        assertNoEmits();
        assertDisplayedTime('13', '25', 'AM');
      });

      it(`formats on invalid value on ${IncrementalInput.EVENT_UP}`, () => {
        wrapper.find<IncrementalInput>(IncrementalInput).vm.$emit(IncrementalInput.EVENT_CHANGE, '——INVALID——');
        wrapper.find<IncrementalInput>(IncrementalInput).vm.$emit(IncrementalInput.EVENT_UP);

        assertDisplayedTime('12', '25', 'PM');
      });

      it(`formats on invalid value on ${IncrementalInput.EVENT_DOWN}`, () => {
        wrapper.find<IncrementalInput>(IncrementalInput).vm.$emit(IncrementalInput.EVENT_CHANGE, '——INVALID——');
        wrapper.find<IncrementalInput>(IncrementalInput).vm.$emit(IncrementalInput.EVENT_DOWN);

        assertDisplayedTime('10', '25', 'AM');
      });
    });

    describe('minute', () => {
      it('sets error on invalid minute input', () => {
        const [, minute] = wrapper.findAll<IncrementalInput>(IncrementalInput).wrappers;

        minute.vm.$emit(IncrementalInput.EVENT_CHANGE, '——INVALID——');

        expect(minute.vm.error).toBeDefined();
        assertNoEmits();
        assertDisplayedTime('11', '——INVALID——', 'AM');
      });

      it('sets error on below range minute input', () => {
        const minute = wrapper.findAll<IncrementalInput>(IncrementalInput).at(1);

        minute.vm.$emit(IncrementalInput.EVENT_CHANGE, '-1');

        expect(minute.vm.error).toBeDefined();
        assertNoEmits();
        assertDisplayedTime('11', '-1', 'AM');
      });

      it('sets error on above range minute input', () => {
        const minute = wrapper.findAll<IncrementalInput>(IncrementalInput).at(1);

        minute.vm.$emit(IncrementalInput.EVENT_CHANGE, '60');

        expect(minute.vm.error).toBeDefined();
        assertNoEmits();
        assertDisplayedTime('11', '60', 'AM');
      });

      it(`formats on invalid value on ${IncrementalInput.EVENT_UP}`, () => {
        wrapper
          .findAll<IncrementalInput>(IncrementalInput)
          .at(1)
          .vm.$emit(IncrementalInput.EVENT_CHANGE, '——INVALID——');
        wrapper
          .findAll<IncrementalInput>(IncrementalInput)
          .at(1)
          .vm.$emit(IncrementalInput.EVENT_UP);

        assertDisplayedTime('11', '30', 'AM');
      });

      it(`formats on invalid value on ${IncrementalInput.EVENT_DOWN}`, () => {
        wrapper
          .findAll<IncrementalInput>(IncrementalInput)
          .at(1)
          .vm.$emit(IncrementalInput.EVENT_CHANGE, '——INVALID——');
        wrapper
          .findAll<IncrementalInput>(IncrementalInput)
          .at(1)
          .vm.$emit(IncrementalInput.EVENT_DOWN);

        assertDisplayedTime('11', '20', 'AM');
      });
    });
  });

  it('propagates disabled to inputs', () => {
    wrapper.setProps({ disabled: true });
    expect(wrapper.findAll<IncrementalInput>(IncrementalInput).wrappers.every((wrapper) => wrapper.vm.disabled)).toBe(
      true
    );
  });

  function renderComponent(propsData: TimeInput.Props): Wrapper<TimeInput> {
    return shallowMount(TimeInput, { propsData });
  }

  function assertEmittedTime(time: DateObjectUnits): void {
    expect(wrapper.emitted().change.slice(-1)[0][0]).toMatchObject(time);
  }

  function assertNoEmits(): void {
    expect(wrapper.emitted().change).toBeUndefined();
  }

  function assertDisplayedTime(hour: string, minutes: string, meridian: string): void {
    const [hourInput, minuteInput, meridianInput] = wrapper.findAll<IncrementalInput>(IncrementalInput).wrappers;

    expect(hourInput.vm.value).toEqual(hour);
    expect(minuteInput.vm.value).toEqual(minutes);
    expect(meridianInput.vm.value).toEqual(meridian);
  }
});
