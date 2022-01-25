import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { Button } from '../Button/Button';
import { Icon } from '../icon/Icon';
import { Collapsible } from './Collapsible';

const dummyText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eu turpis venenatis, iaculis urna eget,
auctor urna. Morbi vel tortor sit amet sapien rhoncus convallis. Mauris condimentum tincidunt lorem vulputate
malesuada. Etiam sit amet augue at orci finibus tempus. Fusce venenatis mollis mattis. Donec laoreet tincidunt
sollicitudin. Praesent elit enim, gravida id tincidunt ac, eleifend vitae erat. Etiam elementum tortor mi,
quis maximus lorem tempus id. In in lorem odio. Sed ac ex leo. Ut vitae consectetur libero. Pellentesque
habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc sed leo quis est
consectetur tincidunt. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
Nullam consectetur sem vitae ultricies consectetur. Sed erat turpis, sollicitudin vitae ipsum vel, porttitor
cursus nisi. Vestibulum sollicitudin ultrices placerat. Phasellus tincidunt vel eros ac fringilla. Nunc sed
pulvinar tellus. Curabitur at rutrum mauris. Aenean rutrum justo et ex malesuada, sed lacinia enim lacinia.
Integer facilisis eget eros quis mattis. Ut varius ullamcorper mollis. Maecenas tempor porttitor massa ut
maximus. Ut ornare interdum luctus. Nunc elementum ornare dolor ut eleifend. Sed vel sapien et erat venenatis
hendrerit at eget augue. Pellentesque mi enim, sagittis mattis pulvinar ut, ultrices nec velit.`;

@Component({ name: 'DefaultCollapsibleStory' })
class DefaultCollapsibleStory extends Vue {
  render(): VNode {
    return (
      <div style="margin: 16px; max-width: 1200px">
        <h1>Collpased</h1>
        <Collapsible title="Simple" style="margin-bottom: 16px;">
          <p>{dummyText}</p>
        </Collapsible>
        <h1>Expanded</h1>
        <Collapsible title="With action" expanded={true} style="margin-bottom: 16px;">
          <Button
            slot="action"
            color={Button.Color.PRIMARY}
            appearance={Button.Appearance.LIGHTEN}
            icon={Icon.Type.EDIT}
            stopPropagation={true}
            onClick={action('click')}
          />
          <p>{dummyText}</p>
        </Collapsible>
        <h1>Active</h1>
        <Collapsible title="Simple" active={true} style="margin-bottom: 16px;">
          <p>{dummyText}</p>
        </Collapsible>
        <h1>Disabled</h1>
        <Collapsible title="Simple" disabled={true} style="margin-bottom: 16px;">
          <p>{dummyText}</p>
        </Collapsible>
      </div>
    );
  }
}

@Component({ name: 'CollapsibleKnobStory' })
class CollapsibleKnobStory extends Vue {
  @Prop({ type: Boolean, required: false, default: () => boolean('expanded', false) })
  readonly expanded: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('disabled', false) })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('active', false) })
  readonly active: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('embedded', false) })
  readonly embedded: boolean;

  @Prop({ type: String, required: false, default: () => text('text', 'Title') })
  readonly title: string;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Collapsible
          style="width: 400px"
          title={this.title}
          active={this.active}
          expanded={this.expanded}
          embedded={this.embedded}
          disabled={this.disabled}
        >
          <p>{dummyText}</p>
        </Collapsible>
      </div>
    );
  }
}

storiesOf(`${StorybookSection.LAYOUT}/Collapsible`, module)
  .addDecorator(withKnobs)
  .add('Knob Story', () => CollapsibleKnobStory)
  .add('Default', () => DefaultCollapsibleStory);
