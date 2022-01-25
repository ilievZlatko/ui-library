import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { Button } from '../Button/Button';
import { Dropdown } from '../Dropdown/Dropdown';
import { Icon } from '../icon/Icon';
import { TypeaheadNote } from '../TypeaheadNote/TypeaheadNote';

import './DropdownButton.scss';

// tslint:disable:jsdoc-format
/**
 * Dropdown component.
 *
 * A component that can wrap another component and use it as an anchor for a popup.
 * Basic usage:
 * ```
<DropdownButton items={[{ label: 'Hello', value: 'world!' }]} activeItem={myActiveItem} onSelect={onSelect}/>
 *```
 *
 * @event select: Fired when the user selects an option. Provides the selected `DropdownItem` as param.
 */
@Component({ name: 'DropdownButton' })
class DropdownButton extends Vue {
  @Prop({ type: Array, required: true })
  readonly items: Array<Dropdown.Item>;

  @Prop({ type: Object, required: false, default: null })
  readonly activeItem: Dropdown.Item | null;

  @Prop({ type: Boolean, required: false, default: false })
  readonly inline: boolean;

  @Prop({
    type: String,
    required: false,
    default: 'light',
    validator(value: Button.Color): boolean {
      return values(Button.Color).indexOf(value) > -1;
    }
  })
  readonly color: Button.Color;

  @Prop({ type: Boolean, default: false, required: false })
  readonly hasIcon: boolean;

  @Prop({ type: String, default: '', required: false })
  readonly header: string;

  @Prop({ type: String, default: '', required: false })
  readonly placeholder: string;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly enableSearch: boolean;

  render(): VNode {
    return (
      <Dropdown
        options={this.items}
        selectedItem={this.activeItem}
        disabled={this.disabled}
        enableSearch={this.enableSearch}
        onSelect={this.onSelect}
        onClose={this.onClose}
      >
        {this.header && <TypeaheadNote text={this.header} slot="header" />}
        <Button
          class={cx('lp-dropdown-button-anchor', { placeholder: !this.activeItem?.label && !!this.placeholder })}
          text={this.activeItem?.label ?? this.placeholder}
          icon={this.hasIcon ? Icon.Type.CARET_DOWN_SMALL : null}
          iconPlacement={Button.IconPlacement.RIGHT}
          inline={this.inline}
          disabled={this.disabled}
          color={this.color}
        />
      </Dropdown>
    );
  }

  onSelect(selected: Dropdown.Item): void {
    this.$emit('select', selected);
  }

  onClose(): void {
    this.$emit('close');
  }
}

namespace DropdownButton {
  export type Color = Button.Color;
  export const Color = Button.Color;
}

export { DropdownButton };
