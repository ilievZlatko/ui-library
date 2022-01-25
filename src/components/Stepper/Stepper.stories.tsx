import { number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, StorybookSection } from '../../utils/storybookUtils';
import { AutoPopup } from '../AutoPopup/AutoPopup';
import { Guide } from '../Guide/Guide';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Stepper } from './Stepper';

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  private selectedStepIndex: number = -1;

  private get currentStepIndex(): number {
    return (this.selectedStepIndex !== -1) ? this.selectedStepIndex : this.activeStepIndex;
  }

  private get steps(): Array<string> {
    return ['Step 1', 'Step 2', 'Step 3'];
  }

  private get stepsWithLinks(): Array<Stepper.Step> {
    return this.steps.map((x) => ({ label: x, link: 'javascript:void(0)' }));
  }

  @Prop({ required: true, type: Number, default: () => number('activeStepIndex', 0) })
  readonly activeStepIndex: number;

  render(): VNode {
    return (
      <div style="width: 600px">
        <Stepper activeStepIndex={this.activeStepIndex} steps={this.steps} />
        <br />
        <Stepper
          activeStepIndex={this.currentStepIndex}
          steps={this.stepsWithLinks}
          scopedSlots={{
            [Stepper.SLOT_STEP_INDICATOR]: this.renderStepIndicator
          }}
          onClick={this.onStepClick}
        />
        <StargateTarget />
      </div>
    );
  }

  private renderStepIndicator({ step, index }: { step: Stepper.Step, index: number }): VNode {
    if (index === 0) {
      return <Icon type={Icon.Type.CHECKMARK} circle={Icon.Circle.SUCCESS} />;
    }

    if (index === 1) {
      return (
        <Guide eventTrigger={AutoPopup.EventTrigger.HOVER} type={Guide.Type.WARNING}>
          <p>Ooops, something is wrong..</p>
        </Guide>
      );
    }

    return <Icon type={Icon.Type.CIRCLE} />;
  }

  private onStepClick({ index }: { index: number }): void {
    this.selectedStepIndex = index;
  }
}

storiesOf(`${StorybookSection.INDICATOR}/Stepper`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Default', () => DefaultStory);
