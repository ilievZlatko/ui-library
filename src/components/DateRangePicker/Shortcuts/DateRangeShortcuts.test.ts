import { mount } from '@vue/test-utils';
import { DateTime, Interval, Settings } from 'luxon';
import { DateRangeShortcuts } from './DateRangeShortcuts';

describe(DateRangeShortcuts, (): void => {
  beforeEach((): void => {
    Settings.resetCaches();
  });

  it('renders', () => {
    const wrapper = mount(DateRangeShortcuts, { propsData: { options: DateRangeShortcuts.DEFAULT } });

    expect(wrapper.findAll('.option').length).toBe(DateRangeShortcuts.DEFAULT.length);
  });

  it('emits select when clicking quick option', async () => {
    const fakeTime = DateTime.fromSQL('2019-07-10 12:00').toMillis();
    Settings.now = () => fakeTime;

    const wrapper = mount(DateRangeShortcuts, { propsData: { options: DateRangeShortcuts.DEFAULT } });

    wrapper.find('.option').trigger('click');
    await wrapper.vm.$nextTick();

    const emits = wrapper.find(DateRangeShortcuts).emitted().select;

    expect(emits.length).toBe(1);

    const { start, end }: Interval = emits.slice(-1)[0][0];
    const emittedRange = Interval.fromDateTimes(
      DateTime.fromObject({ year: start.year, month: start.month, day: start.day }),
      DateTime.fromObject({ year: end.year, month: end.month, day: end.day })
    );

    const yesterday = DateTime.local()
      .minus({ days: 1 })
      .startOf('day');

    const expectedRange = Interval.fromDateTimes(yesterday, yesterday);

    expect(emittedRange).toMatchObject(expectedRange);
  });

  it('emits null when quick options does not have an offset', async () => {
    const wrapper = mount(DateRangeShortcuts, { propsData: { options: [{ label: 'All' }] } });
    wrapper.find('.option').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find(DateRangeShortcuts).emitted().select).toMatchObject([[null]]);
  });
});
