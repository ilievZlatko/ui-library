import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Button } from '../Button/Button';
import { Icon } from '../icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';

import './FileChooser.scss';

@Component({ name: 'FileChooser' })
class FileChooser extends Vue {
  private isLoading: boolean = false;

  @Prop({ required: false, default: Button.Appearance.NORMAL })
  readonly buttonAppearance: Button.Appearance;

  @Prop({ required: false, default: Button.Color.LIGHT })
  readonly buttonColor: Button.Color;

  @Prop({ required: false, default: 'Choose File' })
  readonly buttonText: string;

  @Prop({ required: false })
  readonly contentType: FileChooser.DataType;

  @Prop({ required: false, default: false })
  readonly disabled: boolean;

  @Prop({ required: false, default: false })
  readonly showClearButton: boolean;

  @Prop({ required: false, default: false })
  readonly multiple: boolean;

  $slots: {
    default: Array<VNode>;
  };

  render(): VNode {
    return (
      <div class="lp-file-chooser">
        {this.renderContent()}
        <Button
          class="file-input-button"
          type={Button.Type.FILE}
          multiple={this.multiple}
          text={this.buttonText}
          appearance={this.buttonAppearance}
          color={this.buttonColor}
          disabled={this.disabled}
          loading={this.isLoading}
          onFile={this.onUpload}
        />
        {this.renderClearButton()}
      </div>
    );
  }

  private renderContent(): VNode | null {
    if (!this.$slots?.default) {
      return null;
    }

    return (
      <div class="file-input-content">
        {this.$slots.default}
      </div>
    );
  }

  private renderClearButton(): VNode | null {
    if (!this.showClearButton) {
      return null;
    }

    const buttonAppearance = (
      this.buttonAppearance !== Button.Appearance.OUTLINE
        ? Button.Appearance.LIGHTEN
        : Button.Appearance.OUTLINE
    );

    return (
      <Button
        class="file-input-clear"
        icon={Icon.Type.DELETE}
        appearance={buttonAppearance}
        color={Button.Color.DANGER}
        disabled={this.disabled}
        tooltip="Clear"
        tooltipPlacement={Tooltip.Placement.TOP}
        onClick={this.onClear}
      />
    );
  }

  private onUpload(file: File | FileList | null): void {
    if (file) {
      if (this.contentType) {
        const reader = new FileReader();
        const method = `readAs${this.contentType}` as keyof FileReader;
        reader.onload = (event: ProgressEvent<FileReader>) => {
          const fileContent = event.target?.result;
          this.isLoading = false;
          this.$emit('change', file, fileContent);
        };
        if (reader[method] instanceof Function) {
          this.isLoading = true;
          (reader[method] as Function)(file);
        }
      } else {
        this.$emit('change', file);
      }
    }
  }

  private onClear(e: MouseEvent): void {
    this.$emit('change', null);
  }
}

namespace FileChooser {
  export enum DataType {
    ARRAY_BUFFER = 'ArrayBuffer',
    BINARY_STRING = 'BinaryString',
    DATA_URL = 'DataURL',
    TEXT = 'Text'
  }
}

export { FileChooser };
