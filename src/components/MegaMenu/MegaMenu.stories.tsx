import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import { withReadme } from 'storybook-readme';
import { VNode } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { StargateTarget } from '../Stargate/StargateTarget';
import { MegaMenu } from './MegaMenu';
import MegaMenuReadme from './MegaMenu.md';

@Component({ name: 'MegaMenuStory' })
class MegaMenuStory extends Vue {
  @Prop({ required: false, type: String, default: () => text('Mega Menu width', '100%') })
  readonly width: string;

  @Prop({ required: false, type: String, default: () => text('Empty state filter term', 'empty') })
  readonly filterTerm: string;

  @Prop({ required: false, type: String, default: () => text('Search Placeholder', 'Search') })
  readonly searchPlaceholder: string;

  private searchTerm: string = '';

  onSelect: Function = action('onSelect');

  config: Array<MegaMenu.Column> = [
    {
      groups: [
        {
          title: 'User',
          items: [
            {
              value: 'userAttribute',
              label: 'User attribute'
            },
            {
              value: 'userBucket',
              label: 'User bucket'
            },
            {
              value: 'userId',
              label: 'User ID'
            },
            {
              value: 'nonPayingUsers',
              label: 'Non-paying users'
            },
            {
              value: 'payingUsers',
              label: 'Paying users'
            },
            {
              value: 'lifetimeValue',
              label: 'Lifetime value'
            },
            {
              value: 'savedAudience',
              label: 'Saved audience',
              disabled: true,
              tooltip: 'There are no saved audiences available'
            }
          ]
        },
        {
          title: 'Session',
          items: [
            {
              value: 'sessionStart',
              label: 'Session start'
            },
            {
              value: 'sessionStartUserTmz',
              label: "Session start time in user's timezone"
            }
          ]
        }
      ]
    },
    {
      groups: [
        {
          title: 'Device',
          items: [
            {
              value: 'deviceModel',
              label: 'Device model'
            },
            {
              value: 'osName',
              label: 'OS name'
            },
            {
              value: 'osVersion',
              label: 'OS version'
            },
            {
              value: 'browserName',
              label: 'Browser name',
              tooltip: "Name of the browser, I'm a random tooltip"
            },
            {
              value: 'appVersion',
              label: 'App version'
            }
          ]
        }
      ]
    },
    {
      groups: [
        {
          title: 'Saved Audiences',
          subtitle: 'Showing 5 out of 300 audiences.',
          columns: 3,
          items: [
            {
              value: 'Saved Audience 1',
              label: 'Saved Audience 1'
            },
            {
              value: 'Saved Audience 2',
              label: 'Saved Audience 2'
            },
            {
              value: 'Saved Audience 3',
              label: 'Saved Audience 3'
            },
            {
              value: 'Saved Audience 4',
              label: 'Saved Audience 4'
            },
            {
              value: 'Saved Audience 5',
              label: 'Saved Audience 5'
            }
          ]
        }
      ]
    }
  ];

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        <MegaMenu config={this.config} filterTerm={this.searchTerm} onSelect={this.onSelect} />
        <h4>with MegaMenu.Search</h4>
        <div>
          <MegaMenu.Search
            searchTerm={this.searchTerm}
            searchPlaceholder={this.searchPlaceholder}
            onSearch={(value: string): void => {
              this.searchTerm = value;
            }}
          />
          <MegaMenu
            config={MegaMenu.filterColumns(this.config, this.searchTerm)}
            filterTerm={this.searchTerm}
            onSelect={this.onSelect}
          />
        </div>

        <h4>MegaMenu.EmptyState</h4>
        <MegaMenu.EmptyState filterTerm={this.filterTerm} />
        <StargateTarget />
      </div>
    );
  }

  private get wrapperStyles(): Partial<CSSStyleDeclaration> {
    return {
      maxWidth: this.width
    };
  }
}

storiesOf(`${StorybookSection.LAYOUT}/MegaMenu`, module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(MegaMenuReadme))
  .add('Default', () => MegaMenuStory);
