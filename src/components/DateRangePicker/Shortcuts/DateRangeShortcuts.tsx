import { DateTime, DurationObjectUnits } from 'luxon';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import './DateRangeShortcuts.scss';

@Component({ name: 'DateRangeShortcuts' })
class DateRangeShortcuts extends Vue {
  @Prop({ required: true })
  readonly options: Array<DateRangeShortcuts.Option>;

  render(): VNode {
    return (
      <div class="shortcuts">
        <h4>Quick Select</h4>
        <ul>
          {this.options.map((option) => (
            <li class="option" onClick={() => this.updateRange(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  private updateRange({ offset }: DateRangeShortcuts.Option): void {
    if (!offset) {
      this.$emit('select', null);

      return;
    }

    const today = DateTime.local();

    const range = {
      start: offset.past ? today.minus(offset.past) : today,
      end: offset.future ? today.plus(offset.future) : today
    };

    this.$emit('select', range);
  }
}

namespace DateRangeShortcuts {
  export interface Props {
    options: Array<DateRangeShortcuts.Option>;
  }

  export interface OffsetFromToday {
    past?: DurationObjectUnits;
    future?: DurationObjectUnits;
  }

  export interface Option {
    label: string;
    offset?: OffsetFromToday;
  }

  export const DEFAULT: Array<DateRangeShortcuts.Option> = [
    {
      label: 'Yesterday',
      // Setting today to be yesterday.
      // If future: { days: -1 } was 0 it would include today too.
      offset: { past: { days: 1 }, future: { days: -1 } }
    },
    {
      label: 'Today',
      offset: {}
    },
    // Setting all of the below to have days -1 because they already include today.
    {
      label: 'Past 2 days',
      offset: { past: { days: 2 - 1 } }
    },
    {
      label: 'Past week',
      offset: { past: { weeks: 1, days: -1 } }
    },
    {
      label: 'Past 2 weeks',
      offset: { past: { weeks: 2, days: -1 } }
    },
    {
      label: 'Past 3 weeks',
      offset: { past: { weeks: 3, days: -1 } }
    },
    {
      label: 'Past month',
      offset: { past: { months: 1, days: -1 } }
    },
    {
      label: 'Past 2 months',
      offset: { past: { months: 2, days: -1 } }
    },
    {
      label: 'Past 3 months',
      offset: { past: { months: 3, days: -1 } }
    }
  ];
}

export { DateRangeShortcuts };
