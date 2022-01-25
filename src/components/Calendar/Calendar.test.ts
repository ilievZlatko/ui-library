import { cleanup, fireEvent, render, RenderResult } from 'leanplum-lib-testing';
import range from 'lodash/range';
import { DateTime, Interval } from 'luxon';
import { Calendar } from './Calendar';
import { convertDateTimeToObject } from './util/convertDateTimeToObject';

describe('Calendar', (): void => {
  afterEach(cleanup);

  it('should render correctly with no props', (): void => {
    // Given a month with no selected day.
    const { getByText, queryByText, queryAllByText, queryAllByTestId } = renderComponent({
      currentMonth: DateTime.fromObject({ year: 2019, month: 1, day: 10 })
    });

    // It should render the component.

    // With the correct header.
    expect(queryByText('January 2019')).not.toBeNull();

    // And rows of weeks/days.
    [1, 2, 30, 31].forEach((day: number) => {
      expect(queryAllByText(day.toString())).toHaveLength(2);
    });

    range(3, 29).forEach((day: number) => {
      expect(queryByText(day.toString())).not.toBeNull();
    });

    expect(queryAllByTestId('week')).toHaveLength(5);

    // The first day should be Sunday, Dec 30, outside the month.
    assertDayClasses(queryAllByText('30')[0], ['lp-day', 'weekend', 'outside-month']);

    // The second Tuesday (10th day in the Calendar grid) should be Jan 8th.
    assertDayClasses(getByText('8'), ['lp-day']);

    // And last day should be Saturday, Feb 2, outside the month.
    assertDayClasses(queryAllByText('2')[1], ['lp-day', 'weekend', 'outside-month']);
  });

  it('should render correctly with a selected day', (): void => {
    // Given March 2019 with March 20th selected.
    const { getByText, queryByText, queryAllByText, queryAllByTestId } = renderComponent({
      currentMonth: DateTime.fromObject({ year: 2019, month: 3, day: 1 }),
      selected: [DateTime.fromObject({ year: 2019, month: 3, day: 20 })]
    });

    // It should render the component.

    // With the correct header.
    expect(queryByText('March 2019')).not.toBeNull();

    // And rows of weeks/days.
    [...range(24, 28), ...range(1, 6)].forEach((day: number) => {
      expect(queryAllByText(day.toString())).toHaveLength(2);
    });

    range(7, 23).forEach((day: number) => {
      expect(queryByText(day.toString())).not.toBeNull();
    });

    expect(queryAllByTestId('week')).toHaveLength(6);

    // With the correct selected day.
    assertDayClasses(getByText('20'), ['lp-day', 'selected']);

    // The first day should be Sunday, Feb 24, outside the month.
    assertDayClasses(queryAllByText('24')[0], ['lp-day', 'weekend', 'outside-month']);

    // The second Tuesday (10th day in the Calendar grid) should be March 5th.
    assertDayClasses(queryAllByText('5')[0], ['lp-day']);

    // And last day should be Saturday, April 6, outside the month.
    assertDayClasses(queryAllByText('6')[1], ['lp-day', 'weekend', 'outside-month']);
  });

  it('should render the correct month if value is in future', (): void => {
    // Given a time in the future.
    const twoMonthsFromNow = DateTime.local().plus({ months: 2 });
    const currentMonth = convertDateTimeToObject(twoMonthsFromNow)!;

    // When we render the component.
    const { getByText } = renderComponent({
      currentMonth
    });

    // The correct month should be displayed.
    expect(getByText(twoMonthsFromNow.toFormat('MMMM yyyy'))).not.toBeNull();
  });

  it('should render the correct highlighted and selected days', (): void => {
    // Given a calendar with a highlighted range.
    const highlightedRange: Interval = Interval.fromDateTimes(
      DateTime.fromObject({ year: 2019, month: 9, day: 2 }),
      DateTime.fromObject({ year: 2019, month: 9, day: 5 })
    );

    // When we render the Calendar.
    const { queryAllByText } = renderComponent({
      currentMonth: DateTime.fromObject({ year: 2019, month: 9, day: 1 }),
      highlighted: [highlightedRange]
    });

    // Then, then displayed month should have the correct highlighted days.
    range(2, 5).forEach((day: number) => {
      expect(queryAllByText(day.toString())[0].parentElement!.className).toContain('highlighted');
    });
  });

  it('clicking prev should emit the correct month', (): void => {
    // Given a calendar.
    const { getEmittedValue, getByTestId } = renderComponent({
      currentMonth: DateTime.fromObject({ year: 2019, month: 1, day: 10 })
    });

    // When we click the previous month button.
    fireEvent.click(getByTestId('prev'));

    // Then, it should emit the last month.
    expect(getEmittedValue<DateTime>('updateMonth').map((x) => x.toISODate())).toEqual(['2018-12-10']);
  });

  it('clicking next should emit the correct month', (): void => {
    // Given a calendar.
    const { getEmittedValue, getByTestId } = renderComponent({
      currentMonth: DateTime.fromObject({ year: 2019, month: 1, day: 10 })
    });

    // When we click the next month button.
    fireEvent.click(getByTestId('next'));

    // Then, it should emit the next month.
    expect(getEmittedValue<DateTime>('updateMonth').map((x) => x.toISODate())).toEqual(['2019-02-10']);
  });

  it('selecting a day should emit the correct day', (): void => {
    // Given a calendar with February 2, 2019 selected.
    const { getEmittedValue, getByText } = renderComponent({
      currentMonth: DateTime.fromObject({ year: 2019, month: 2, day: 1 }),
      selected: [DateTime.fromObject({ year: 2019, month: 2, day: 2 })]
    });

    // When we click Feb 3rd (the 8th day in the Calendar grid).
    fireEvent.click(getByText('3'));

    // Then, we should emit the correct day.
    expect(getEmittedValue<DateTime>('update').map((x) => x.toISODate())).toEqual(['2019-02-03']);
    expect(getEmittedValue<DateTime>('updateMonth').map((x) => x.toISODate())).toEqual(['2019-02-03']);
  });

  function renderComponent(initialProps: Calendar.Props): RenderResult {
    return render(Calendar, {
      propsData: initialProps
    });
  }

  function assertDayClasses(element: HTMLElement, classes: Array<string>): void {
    expect(element.parentElement!.className.split(' ')).toEqual(classes);
  }
});
