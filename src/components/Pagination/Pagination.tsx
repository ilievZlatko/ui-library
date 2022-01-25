import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { Button } from '../Button/Button';
import { Icon } from '../icon/Icon';

import './Pagination.scss';

function inclusiveRange(from: number, to: number): Array<number> {
  return Array.from({ length: to - from + 1 }, (_, i) => i + from);
}

@Component({ name: 'Pagination' })
class Pagination extends Vue implements Pagination.Props {
  static readonly EVENT_CHANGE: string = 'change';
  // Will not work with anything other than 7
  private static readonly MAX_BUTTONS: number = 7;

  @Prop({ required: false })
  readonly className?: string;

  @Prop({ required: true })
  readonly count: number;

  @Prop({ required: false, default: 1 })
  readonly current: number;

  private get hasLeftPlaceholder(): boolean {
    return this.current > 4;
  }

  private get hasRightPlaceholder(): boolean {
    return this.count - this.current > 3;
  }

  private get pageButtonsStructure(): Array<number | null> {
    if (this.count <= Pagination.MAX_BUTTONS) {
      return inclusiveRange(1, this.count);
    }

    const left = this.hasLeftPlaceholder ? null : 2;
    const right = this.hasRightPlaceholder ? null : this.count - 1;

    const middle = this.hasLeftPlaceholder
      ? this.hasRightPlaceholder
        ? inclusiveRange(this.current - 1, this.current + 1)
        : inclusiveRange(this.count - 4, this.count - 2)
      : inclusiveRange(3, 5);

    return [1, left, ...middle, right, this.count];
  }

  public render(): VNode {
    return (
      <div class={cx('lp-pagination', this.className)}>
        <div class={cx('page-arrow page-button', { disabled: this.current === 1 })} onClick={this.onBack}>
          <Icon type={Icon.Type.ARROW_LEFT} clickable={false} />
        </div>
        <div class="page-list">
          {this.pageButtonsStructure.map((index) => (
            <div
              class={cx('page-button', { active: index === this.current, disabled: index === null })}
              onClick={() => index && this.onChange(index)}
            >
              {index ?? '...'}
            </div>
          ))}
        </div>
        <div class={cx('page-arrow page-button', { disabled: this.current === this.count })} onClick={this.onNext}>
          <Icon type={Icon.Type.ARROW_RIGHT} clickable={false} />
        </div>
      </div>
    );
  }

  private onChange(pageNumber: number): void {
    if (pageNumber > 0 && pageNumber <= this.count) {
      this.$emit(Pagination.EVENT_CHANGE, pageNumber);
    }
  }

  private onNext(): void {
    this.onChange(this.current + 1);
  }

  private onBack(): void {
    this.onChange(this.current - 1);
  }
}

namespace Pagination {
  export interface Props {
    className?: string;
    count: number;
    current?: number;
  }
}

export { Pagination };
