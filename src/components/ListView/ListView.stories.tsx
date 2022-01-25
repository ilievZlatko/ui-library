import { action } from '@storybook/addon-actions';
import { number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ListView } from './ListView';

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  @Prop({ default: () => number('Active Index', 0) }) activeIndex: number;
  @Prop({ default: () => number('Paginate by', 8) }) paginateBy: number;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        <ListView
          activeIndex={this.activeIndex}
          paginateBy={this.paginateBy}
          items={Array<string>(256)
            .fill('item')
            .map((x, i) => `${x} ${i + 1}`)}
          scopedSlots={{
            item: (item: string) => {
              return <div style={this.listItemStyles}> {item} </div>;
            }
          }}
          onClick={action('click')}
        />
      </div>
    );
  }

  private get listItemStyles(): Partial<CSSStyleDeclaration> {
    return {
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px'
    };
  }

  private get wrapperStyles(): Partial<CSSStyleDeclaration> {
    return {
      width: '600px',
      padding: '0 10px'
    };
  }
}

storiesOf('ListView', module)
  .addDecorator(withKnobs)
  .add('Default Story', () => DefaultStory);
