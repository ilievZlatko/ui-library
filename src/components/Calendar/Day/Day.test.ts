import { mount, Wrapper } from '@vue/test-utils';
import { DateTime } from 'luxon';
import { Day } from './Day';

describe('Day', (): void => {
  it('should render correctly', (): void => {
    // Give the Day is Saturday, May 25, 2019
    const props: Day.Props = {
      value: DateTime.fromObject({ year: 2019, month: 5, day: 25 }),
      month: DateTime.fromObject({ year: 2019, month: 5, day: 1 }),
      selected: false
    };

    // When we render the Day.
    const wrapper: Wrapper<Day> = renderComponent(props);

    // Then it should have the correct classes.
    expect(wrapper.contains(Day)).toBe(true);
    expect(wrapper.classes()).toContain('weekend');
    expect(wrapper.classes()).not.toContain('outside-month');
  });

  it('should render a highlighted day correctly', (): void => {
    // Given the Day is Friday, May 24, 2019 and highlighted is true.
    const props: Day.Props = {
      value: DateTime.fromObject({ year: 2019, month: 5, day: 24 }),
      month: DateTime.fromObject({ year: 2019, month: 5, day: 1 }),
      highlighted: true,
      selected: false
    };

    // When we render the Day.
    const wrapper: Wrapper<Day> = renderComponent(props);

    // Then it should have the correct classes.
    expect(wrapper.classes()).toContain('highlighted');
  });

  it('should render a day ouside the min/max as disabled', (): void => {
    // Given the Day is Sunday, May 26, 2019 and the minDate is May 27.
    const props: Day.Props = {
      value: DateTime.fromObject({ year: 2019, month: 5, day: 26 }),
      month: DateTime.fromObject({ year: 2019, month: 5, day: 1 }),
      minDate: DateTime.fromObject({ year: 2019, month: 5, day: 27 })
    };

    // When we render the Day.
    const wrapper: Wrapper<Day> = renderComponent(props);

    // Then the day should be disabled.
    expect(wrapper.classes()).toContain('disabled');
  });

  it('should render hidden class if outside month and includeDaysOutsideMonth is false', (): void => {
    // Given the Day is Sunday, May 26, 2019, the month is June and includeDaysOusideMonth is false.
    const props: Day.Props = {
      value: DateTime.fromObject({ year: 2019, month: 5, day: 26 }),
      month: DateTime.fromObject({ year: 2019, month: 6, day: 1 }),
      includeDaysOutsideMonth: false
    };

    // When we render the Day.
    const wrapper: Wrapper<Day> = renderComponent(props);

    // Then the day should be rendered with a null label.
    expect(wrapper.find(Day)).toBeDefined();
    expect(wrapper.find(Day).classes()).toContain('hidden');
  });

  it('selecting a day should emit the correct value', (): void => {
    // Given the Day is Monday, June 3, 2019.
    const props: Day.Props = {
      value: DateTime.fromObject({ year: 2019, month: 6, day: 3 }),
      month: DateTime.fromObject({ year: 2019, month: 6, day: 1 }),
      selected: false
    };
    const wrapper: Wrapper<Day> = renderComponent(props);

    // When we select a day.
    wrapper.find(Day).trigger('click');

    // Then, we should emit the correct value.
    expect(getEmittedDay(wrapper)).toEqual(props.value);
  });

  function renderComponent(initialProps?: Day.Props): Wrapper<Day> {
    return mount(Day, {
      propsData: initialProps
    });
  }

  function getEmittedDay(wrapper: Wrapper<Day>): DateTime {
    const emits: Array<Array<DateTime>> = wrapper.emitted().update;

    return emits.slice(-1)[0][0];
  }
});
