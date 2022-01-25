import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { Decorator, StorybookSection } from '../../utils/storybookUtils';
import { Breadcrumbs } from './Breadcrumbs';

@Component({ name: 'DefaultBreadcrumbsStory' })
class DefaultBreadcrumbsStory extends Vue {

  render(): VNode {
    const items: Array<Breadcrumbs.Item<string>> = [
      {
        label: 'First',
        value: 'first'
      },
      {
        label: 'Second',
        value: 'second'
      },
      {
        label: 'Third',
        value: 'third'
      }
    ];

    return <Breadcrumbs items={items} onSelect={(i: Breadcrumbs.Item<string>) => action('Selected')(i)} />;
  }
}

storiesOf(`${StorybookSection.INDICATOR}/Breadcrumbs`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Default Story', () => DefaultBreadcrumbsStory);
