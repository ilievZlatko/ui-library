import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import { ProgressCircle, StargateTarget } from 'leanplum-lib-ui';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, selectKnob } from '../../utils/storybookUtils';
import { Icon } from '../icon/Icon';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { MetricTile } from './MetricTile';

@Component({ name: 'DefaultMetricTileStory' })
class DefaultMetricTileStory extends Vue {
  value: string = '123,456';

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        <MetricTile title="Regular Value" value={this.value} onClick={() => this.onClick(this.value)} />

        <MetricTile
          title="Medium Value"
          value={this.value}
          valueSize={MetricTile.ValueSize.MEDIUM}
          onClick={() => this.onClick(this.value)}
        />

        <MetricTile
          title="Large Value"
          value={this.value}
          valueSize={MetricTile.ValueSize.LARGE}
          onClick={() => this.onClick(this.value)}
        />

        <MetricTile
          title="With value subtext"
          value={this.value}
          valueSubtext="custom value subtext"
          onClick={() => this.onClick(this.value)}
        />

        <MetricTile
          title="With value hint"
          value={this.value}
          valueHint="This is a custom value hint."
          onClick={() => this.onClick(this.value)}
        />

        <MetricTile
          title="With total"
          value={this.value}
          total="246,912"
          onClick={() => this.onClick(this.value)}
        />

        <MetricTile title="With slot beside" value={this.value} onClick={() => this.onClick(this.value)}>
          <ProgressCircle slot="beside" value={80} />
        </MetricTile>

        <MetricTile title="With slot below" value={this.value} onClick={() => this.onClick(this.value)}>
          <ProgressBar slot="below" value={50} showPercentage={true} />
        </MetricTile>

        <MetricTile
          title="Disabled"
          value={this.value}
          valueSize={MetricTile.ValueSize.LARGE}
          disabled={true}
          onClick={() => this.onClick(this.value)}
        />

        <MetricTile
          title="Loading"
          value={this.value}
          valueSize={MetricTile.ValueSize.LARGE}
          loading={true}
          onClick={() => this.onClick(this.value)}
        />

        <StargateTarget />
      </div>
    );
  }

  onClick(value: string): void {
    this.value = value;
    action('onClick')(value);
  }

  private get wrapperStyles(): Partial<CSSStyleDeclaration> {
    return {
      maxWidth: '400px'
    };
  }
}

@Component({ name: 'MetricTileKnobStory' })
class MetricTileKnobStory extends Vue {
  onClick = action('onClick');

  @Prop({ required: false, default: () => text('className', '') })
  readonly className?: string;

  @Prop({ required: true, default: () => text('title', 'Metric Title') })
  readonly title: string;

  @Prop({ required: true, default: () => text('value', '123,456') })
  readonly value: string;

  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('valueSize', MetricTile.ValueSize, MetricTile.ValueSize.REGULAR)
  })
  readonly valueSize: MetricTile.ValueSize;

  @Prop({ type: Boolean, required: false, default: () => boolean('disabled', false) })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('loading', false) })
  readonly loading: boolean;

  @Prop({ type: String, required: false, default: () => text('valueHint', 'Value Hint') })
  readonly valueHint: string;

  @Prop({ required: false, default: () => selectKnob('valueHintIcon', Icon.Type, undefined) })
  readonly valueHintIcon: string;

  @Prop({ type: String, required: false, default: () => text('valueSubtext', 'Value Subtext') })
  readonly valueSubtext: string;

  render(): VNode {
    return (
      <div style={this.wrapperStyles}>
        <MetricTile
          className={this.className}
          title={this.title}
          value={this.value}
          valueSize={this.valueSize}
          disabled={this.disabled}
          loading={this.loading}
          valueHint={this.valueHint}
          valueHintIcon={this.valueHintIcon}
          valueSubtext={this.valueSubtext}
          onClick={this.onClick}
        />
        <StargateTarget />
      </div>
    );
  }

  private get wrapperStyles(): Partial<CSSStyleDeclaration> {
    return {
      width: '400px'
    };
  }
}

storiesOf('MetricTile', module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Knob Story', () => MetricTileKnobStory);

storiesOf('MetricTile', module).add('Default', () => DefaultMetricTileStory);
