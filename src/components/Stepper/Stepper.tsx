import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';

import './Stepper.scss';

@Component({ name: 'Stepper' })
class Stepper extends Vue {
  static readonly EVENT_CLICK = 'click';
  static readonly SLOT_STEP_INDICATOR = 'stepIndicator';

  private get stepperSteps(): Array<Stepper.Step | string> {
    return this.steps.map((x) => (typeof x === 'string') ? { label: x } : x);
  }

  @Prop({ required: true, type: Array, validator: (value) => value.length > 0 })
  readonly steps: Array<Stepper.Step | string>;

  @Prop({ required: false, type: Number, default: 0 })
  readonly activeStepIndex: number;

  readonly $scopedSlots: {
    [Stepper.SLOT_STEP_INDICATOR]?: (props: { step: Stepper.Step, index: number }) => Array<VNode>;
  };

  render(): VNode {
    return <ul class="lp-stepper">{this.stepperSteps.map(this.renderStep)}</ul>;
  }

  private renderStep(step: Stepper.Step, index: number): VNode {
    return (
      <li key={index} class={cx('stepper-step', { active: index === this.activeStepIndex })}>
        {this.renderStepIndicator(step, index)}
        {this.renderStepLabel(step, index)}
      </li>
    );
  }

  private renderStepIndicator(step: Stepper.Step, index: number): VNode {
    let content: Array<VNode | string> = [<div class="step-number">{index + 1}</div>];

    if (this.$scopedSlots[Stepper.SLOT_STEP_INDICATOR]) {
      content = this.$scopedSlots[Stepper.SLOT_STEP_INDICATOR]!({ step, index });
    }

    return <div class="step-indicator">{content}</div>;
  }

  private renderStepLabel(step: Stepper.Step, index: number): VNode {
    let content: VNode | string = (typeof step === 'string') ? step : step.label;

    if (step.link) {
      content = <a href={step.link} onClick={() => this.onStepClick(step, index)}>{content}</a>;
    }

    return <div class="step-label">{content}</div>;
  }

  private onStepClick(step: Stepper.Step, index: number): void {
    this.$emit(Stepper.EVENT_CLICK, { step, index });
  }
}

namespace Stepper {
  export interface Step {
    label: string;
    link?: string;
  }
}

export { Stepper };
