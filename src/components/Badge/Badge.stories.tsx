import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { Badge } from './Badge';

@Component({ name: 'DefaultBadgeStory' })
class DefaultBadgeStory extends Vue {
  @Prop({ default: () => text('text', 'Badge') }) text: String;

  render(): VNode {
    return <Badge text={this.text} />;
  }
}

@Component({ name: 'BadgeWithColorStory' })
class BadgeWithColorStory extends Vue {
  @Prop({ default: () => text('text', 'Badge') }) text: String;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <div>
          Primary: <Badge text={this.text} color={Badge.Color.PRIMARY} />
        </div>
        <div>
          Primary Light: <Badge text={this.text} color={Badge.Color.PRIMARY_LIGHT} />
        </div>
        <div>
          Grey: <Badge text={this.text} color={Badge.Color.GREY} />
        </div>
        <div>
          Grey Light: <Badge text={this.text} color={Badge.Color.GREY_LIGHT} />
        </div>
        <div>
          Black: <Badge text={this.text} color={Badge.Color.BLACK} />
        </div>
        <div>
          Black Light: <Badge text={this.text} color={Badge.Color.BLACK_LIGHT} />
        </div>
        <div>
          Green: <Badge text={this.text} color={Badge.Color.GREEN} />
        </div>
        <div>
          Green Light: <Badge text={this.text} color={Badge.Color.GREEN_LIGHT} />
        </div>
        <div>
          Red: <Badge text={this.text} color={Badge.Color.RED} />
        </div>
        <div>
          Red Light: <Badge text={this.text} color={Badge.Color.RED_LIGHT} />
        </div>
        <div>
          Plum: <Badge text={this.text} color={Badge.Color.PLUM} />
        </div>
        <div>
          Plum Light: <Badge text={this.text} color={Badge.Color.PLUM_LIGHT} />
        </div>
        <div>
          Orange: <Badge text={this.text} color={Badge.Color.ORANGE} />
        </div>
        <div>
          Orange Light: <Badge text={this.text} color={Badge.Color.ORANGE_LIGHT} />
        </div>
        <div>
          Cyan: <Badge text={this.text} color={Badge.Color.CYAN} />
        </div>
        <div>
          Cyan Light: <Badge text={this.text} color={Badge.Color.CYAN_LIGHT} />
        </div>
        <div>
          Yellow: <Badge text={this.text} color={Badge.Color.YELLOW} />
        </div>
        <div>
          Yellow Light: <Badge text={this.text} color={Badge.Color.YELLOW_LIGHT} />
        </div>
      </div>
    );
  }
}

@Component({ name: 'BadgeKnobStory' })
class BadgeKnobStory extends Vue {
  @Prop({ required: true, type: String, default: () => text('text', 'Badge') })
  text: String;

  @Prop({ type: String, required: false, default: () => selectKnob('color', Badge.Color, undefined) })
  color: Badge.Color;

  render(): VNode {
    return <Badge text={this.text} color={this.color} />;
  }
}

storiesOf(`${StorybookSection.INDICATOR}/Badge`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Knob Story', () => BadgeKnobStory)
  .add('Default Story', () => DefaultBadgeStory)
  .add('Badge With Color Story', () => BadgeWithColorStory);
