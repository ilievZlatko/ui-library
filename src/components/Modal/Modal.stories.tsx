import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { Button } from '../Button/Button';
import { InfoPanel } from '../InfoPanel/InfoPanel';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Tooltip } from '../Tooltip/Tooltip';
import { Modal } from './Modal';

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal title="This is the title" closeButton={true} onClose={action('Close event emitted')}>
          <p>This is the default slot</p>
          <p slot="footer">This is the footer slot</p>
        </Modal>
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'SimpleModalStory' })
class SimpleModalStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal simple={true}>
          <InfoPanel message="This is a simple modal, it just renders the info panel inside of it" />
        </Modal>
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'CenteredStory' })
class CenteredStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal title="This is default behaviour - centered" />
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'TopStory' })
class TopStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal title="This is top-aligned" alignTop={true} />
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'FullscreenStory' })
class FullscreenStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal title="This is fullscreen modal" fullScreen={true} />
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'LoadingOverlayStory' })
class LoadingOverlayStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal title="This is loading overlay example" spinner={Modal.Spinner.OVERLAY}>
          <p> The Spinner is in OVERLAY mode, thus showing the content of the modal underneath.</p>
        </Modal>
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'LoadingReplaceContentStory' })
class LoadingReplaceContentStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal title="This is loading that hides modal content" spinner={Modal.Spinner.REPLACE_CONTENT}>
          <p> The Spinner is in OVERLAY mode, thus showing the content of the modal underneath.</p>
        </Modal>
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'DefaultTitleStory' })
class DefaultTitleStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal title="This is default title" />
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'BigTitleStory' })
class BigTitleStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal title="This is big title" bigTitle={true} />
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'WithoutTitleWithClose' })
class WithoutTitleWithClose extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal closeButton={true}>
          <p>This is the default slot</p>
        </Modal>
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'WithoutTitleAndClose' })
class WithoutTitleAndClose extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal>
          <p>This is the default slot</p>
        </Modal>
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'ShowHideFooterSlots' })
class ShowHideFooterSlots extends Vue {
  showSlots: boolean = false;
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal title="Show and hide footer slot">
          <Button onClick={() => (this.showSlots = true)} text="Show footer button" />
          {this.showSlots && (
            <template slot="footer">
              <Button onClick={() => (this.showSlots = false)} text="Hide footer button" />
            </template>
          )}
        </Modal>
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'TooltipInModal' })
class TooltipInModal extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Button onClick={() => alert('You clicked under the modal!')} text="Try to click" />
        <Modal title="Show and hide footer slot">
          <Tooltip message="I'm a helpful tooltip">
            <Button text="Hover me" />
          </Tooltip>
        </Modal>
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'ModalInModal' })
class ModalInModal extends Vue {
  showSecondModal: boolean = false;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal title="First modal">
          <Button onClick={() => this.setModalState(!this.showSecondModal)} text="Try to click" />
          {this.showSecondModal && (
            <Modal title="Second modal" onClose={() => this.setModalState(false)} escClose={true} fadeClose={true}>
              <h1>Test</h1>
            </Modal>
          )}
        </Modal>
        <StargateTarget />
      </div>
    );
  }

  private setModalState(newValue: boolean): void {
    this.showSecondModal = newValue;
  }
}

@Component({ name: 'OverflowContentStory' })
class OverflowContentStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal
          width="300px"
          title="Very long title content that should wrap, because it is wider than the modal width"
          closeButton={true}
        >
          <p>Long modal content that should align with the close button of the modal, because the modal width matches the title width.</p>
        </Modal>
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'CustomClass' })
class CustomClass extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal className="a-custom-class" title="Show and hide footer slot" closeButton={true}>
          <p>This is the default slot</p>
        </Modal>
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'ModalKnobStory' })
class ModalKnobStory extends Vue {
  onClose = action('onClose');

  @Prop({ required: false, default: () => boolean('simple', false) })
  simple: boolean;

  @Prop({ required: false, default: () => text('title', 'Title') })
  title: string | null;

  @Prop({ required: false, default: () => text('width', '500px') })
  width: string;

  @Prop({ required: false, default: () => text('className', '') })
  className: string;

  @Prop({ required: false, default: () => text('minHeight', '120px') })
  minHeight: string;

  @Prop({ required: false, default: () => boolean('fadeClose', false) })
  fadeClose: boolean;

  @Prop({ required: false, default: () => boolean('escClose', false) })
  escClose: boolean;

  @Prop({ required: false, default: () => boolean('closeButton', false) })
  closeButton: boolean;

  @Prop({ type: String, required: false, default: () => selectKnob('spinner', Modal.Spinner, undefined) })
  spinner: Modal.Spinner;

  @Prop({ required: false, default: () => boolean('fullScreen', false) })
  fullScreen: boolean;

  @Prop({ required: false, default: () => boolean('alignTop', false) })
  alignTop: boolean;

  @Prop({ required: false, default: () => boolean('bigTitle', false) })
  bigTitle: boolean;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Modal
          simple={this.simple}
          title={this.title}
          width={this.width}
          className={this.className}
          minHeight={this.minHeight}
          fadeClose={this.fadeClose}
          escClose={this.escClose}
          closeButton={this.closeButton}
          spinner={this.spinner}
          fullScreen={this.fullScreen}
          alignTop={this.alignTop}
          bigTitle={this.bigTitle}
          onClose={this.onClose}
        >
          <p>This is the default slot</p>
        </Modal>
        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.MODAL}/Modal`, module)
  .addDecorator(withKnobs)
  .add('Knob Story', () => ModalKnobStory)
  .add('Default', () => DefaultStory)
  .add('Simple', () => SimpleModalStory)
  .add('Show and hide footer', () => ShowHideFooterSlots)
  .add('Overflowing content', () => OverflowContentStory)
  .add('Custom classes', () => CustomClass);

storiesOf(`${StorybookSection.MODAL}/Modal/Positioning`, module)
  .add('Centered', () => CenteredStory)
  .add('Top', () => TopStory)
  .add('Fullscreen', () => FullscreenStory);

storiesOf(`${StorybookSection.MODAL}/Modal/Loading`, module)
  .add('LoadingOverlay', () => LoadingOverlayStory)
  .add('LoadingReplaceContent', () => LoadingReplaceContentStory);

storiesOf(`${StorybookSection.MODAL}/Modal/Title`, module)
  .add('DefaultTitle', () => DefaultTitleStory)
  .add('BigTitle', () => BigTitleStory)
  .add('WithoutTitleWithClose', () => WithoutTitleWithClose)
  .add('WithoutTitleAndClose', () => WithoutTitleAndClose);

storiesOf(`${StorybookSection.MODAL}/Modal/Nesting`, module)
  .add('TooltipInModal', () => TooltipInModal)
  .add('ModalinModal', () => ModalInModal);
