import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { Button } from '../Button/Button';
import { Feedback } from '../Feedback/Feedback';
import { StargateTarget } from '../Stargate/StargateTarget';
import { AnchoredPopup } from './AnchoredPopup';

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  private opened: boolean = true;
  private placement: AnchoredPopup.Placement = AnchoredPopup.Placement.AUTO;

  onToggle: Function = action('onToggle');
  onAnchorClick: Function = action('onAnchorClick');
  onAnchorEnter: Function = action('onAnchorEnter');
  onAnchorLeave: Function = action('onAnchorLeave');
  onAnchorKeyup: Function = action('onAnchorKeyup');
  onPopupEnter: Function = action('onPopupEnter');
  onPopupLeave: Function = action('onPopupLeave');

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <AnchoredPopup
          opened={this.opened}
          style="margin: 120px auto;"
          placement={this.placement}
          onAnchorClick={this.onAnchorClick}
          onAnchorEnter={this.onAnchorEnter}
          onAnchorLeave={this.onAnchorLeave}
          onAnchorKeyup={this.onAnchorKeyup}
          onPopupEnter={this.onPopupEnter}
          onPopupLeave={this.onPopupLeave}
          onToggle={(newVal: boolean) => {
            this.opened = newVal;
            this.onToggle();
          }}
        >
          <template slot="anchor">
            <Button text="Anchor" />
          </template>

          <template slot="content">
            <Feedback>
              <p>
                What you can do:
                <ul>
                  <li>Click on a button below to reposition</li>
                  <li>Click anywhere else to dismiss</li>
                </ul>
              </p>
            </Feedback>
          </template>
        </AnchoredPopup>

        <Button
          style="margin: 160px auto 0;"
          text="Show right"
          stopPropagation={true}
          onClick={() => {
            this.opened = true;
            this.placement = AnchoredPopup.Placement.RIGHT;
          }}
        />

        <Button
          style="margin: 40px auto;"
          text="Show left"
          stopPropagation={true}
          onClick={() => {
            this.opened = true;
            this.placement = AnchoredPopup.Placement.LEFT;
          }}
        />

        <Button
          style="margin: 40px auto;"
          text="Show top"
          stopPropagation={true}
          onClick={() => {
            this.opened = true;
            this.placement = AnchoredPopup.Placement.TOP;
          }}
        />

        <Button
          style="margin: 40px auto;"
          text="Show bottom"
          stopPropagation={true}
          onClick={() => {
            this.opened = true;
            this.placement = AnchoredPopup.Placement.BOTTOM;
          }}
        />

        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.FEEDBACK}/AnchoredPopup`, module).add('Default', () => DefaultStory);
