import { action } from '@storybook/addon-actions';
import { number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, StorybookSection } from '../../utils/storybookUtils';
import { Pagination } from './Pagination';

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  @Prop({ default: () => number('Pages count', 7) }) count: number;
  @Prop({ default: () => number('Current page', 1) }) current: number;

  render(): VNode {
    return <Pagination count={this.count} current={this.current} onChange={action('change')} />;
  }
}

@Component({ name: 'DefaultStory' })
class SecondaryStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        {Array(10)
          .fill(undefined)
          .map((x, i) => (
            <Pagination count={10} current={i + 1} />
          ))}
      </div>
    );
  }

  private get wrapperStyles(): Partial<CSSStyleDeclaration> {
    return {
      width: '600px',
      padding: '0 10px'
    };
  }
}

storiesOf(`${StorybookSection.LAYOUT}/Pagination`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Default Story', () => DefaultStory);

storiesOf(`${StorybookSection.LAYOUT}/Pagination`, module).add('All States from 1 - 10', () => SecondaryStory);
