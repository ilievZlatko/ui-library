import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/vue';
import { Icon } from 'leanplum-lib-ui';
import { withReadme } from 'storybook-readme';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { TabStrip } from './TabStrip';
import TabStripReadme from './TabStrip.md';

@Component({ name: 'ListStory' })
class ListStory extends Vue {
  activeTab: number = 0;

  render(): VNode {
    const headers: Array<TabStrip.Header> = [
      { title: 'SECTION 1', subtitle: 'Subtitle 1', icon: Icon.Type.SEARCH },
      { title: 'SECTION 2', subtitle: 'Subtitle 2', icon: Icon.Type.SEARCH },
      { title: 'SECTION 3', subtitle: 'Subtitle 3', icon: Icon.Type.SEARCH },
      { title: 'SECTION 4', subtitle: 'Subtitle 4', icon: Icon.Type.SEARCH }
    ];

    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        <h3>Simple</h3>
        <TabStrip
          active={this.activeTab}
          headers={headers.map(({ title }) => ({
            title
          }))}
          onTabChange={this.onTabChange}
          style={this.tabStripStyles}
        >
          {headers.map(({ title }) => (
            <div style="padding: 8px 4px;">{title} content</div>
          ))}
        </TabStrip>

        <h3>Large title</h3>
        <TabStrip
          active={this.activeTab}
          headers={headers.map(({ title }) => ({
            title
          }))}
          onTabChange={this.onTabChange}
          style={this.tabStripStyles}
          largeTitle={true}
        >
          {headers.map(({ title }) => (
            <div style="padding: 8px 4px;">{title} content</div>
          ))}
        </TabStrip>

        <h3>With icons</h3>
        <TabStrip
          active={this.activeTab}
          headers={headers.map(({ title, icon }) => ({
            title,
            icon
          }))}
          onTabChange={this.onTabChange}
          style={this.tabStripStyles}
        >
          {headers.map(({ title }) => (
            <div style="padding: 8px 4px;">{title} content</div>
          ))}
        </TabStrip>

        <h3>With icons and subtitle</h3>
        <TabStrip active={this.activeTab} headers={headers} onTabChange={this.onTabChange} style={this.tabStripStyles}>
          {headers.map(({ title }) => (
            <div style="padding: 8px 4px;">{title} content</div>
          ))}
        </TabStrip>

        <h3>With custom actions</h3>
        <TabStrip active={this.activeTab} headers={headers} onTabChange={this.onTabChange} style={this.tabStripStyles}>
          <div slot="actions">A non-tab component.</div>
          {headers.map(({ title }) => (
            <div style="padding: 8px 4px;">{title} content</div>
          ))}
        </TabStrip>
      </div>
    );
  }

  private get wrapperStyles(): Partial<CSSStyleDeclaration> {
    return {
      width: '600px',
      padding: '0 10px'
    };
  }

  private get tabStripStyles(): Partial<CSSStyleDeclaration> {
    return {
      boxShadow: '0 0 5px rgba(200, 200, 200, 0.5)'
    };
  }

  private storiesOnTabChange: Function = action('onTabChange');

  private onTabChange(index: number): void {
    this.activeTab = index;
    this.storiesOnTabChange(index);
  }
}

@Component({ name: 'ListWithBadgeStory' })
class ListWithBadgeStory extends Vue {
  activeTab: number = 0;

  render(): VNode {
    const headers: Array<TabStrip.Header> = [
      { title: 'SECTION 1', badge: '3' },
      { title: 'SECTION 2', badge: '5' },
      { title: 'SECTION 3', badge: '7' },
      { title: 'SECTION 4' }
    ];

    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        <h3>Simple</h3>
        <TabStrip active={this.activeTab} headers={headers} onTabChange={this.onTabChange}>
          {headers.map(({ title }) => (
            <div style="padding: 8px 4px;">{title} content</div>
          ))}
        </TabStrip>
      </div>
    );
  }

  private get wrapperStyles(): Partial<CSSStyleDeclaration> {
    return {
      width: '600px',
      padding: '0 10px'
    };
  }

  private storiesOnTabChange: Function = action('onTabChange');

  private onTabChange(index: number): void {
    this.activeTab = index;
    this.storiesOnTabChange(index);
  }
}

@Component({ name: 'VerticalStory' })
class VerticalStory extends Vue {
  activeTab: number = 0;

  render(): VNode {
    const headers: Array<TabStrip.Header> = [
      { title: 'SECTION 1', subtitle: 'Subtitle 1', icon: Icon.Type.SEARCH },
      { title: 'SECTION 2', subtitle: 'Subtitle 2', icon: Icon.Type.SEARCH },
      { title: 'SECTION 3', subtitle: 'Subtitle 3', icon: Icon.Type.SEARCH },
      { title: 'SECTION 4', subtitle: 'Subtitle 4', icon: Icon.Type.SEARCH }
    ];

    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        <h3>Simple</h3>
        <TabStrip
          vertical={true}
          active={this.activeTab}
          headers={headers.map(({ title }) => ({
            title
          }))}
          onTabChange={this.onTabChange}
          style={this.tabStripStyles}
        >
          {headers.map(({ title }) => (
            <div style="padding: 8px 4px;">{title} content</div>
          ))}
        </TabStrip>

        <h3>Large title</h3>
        <TabStrip
          vertical={true}
          active={this.activeTab}
          headers={headers.map(({ title }) => ({
            title
          }))}
          onTabChange={this.onTabChange}
          style={this.tabStripStyles}
          largeTitle={true}
        >
          {headers.map(({ title }) => (
            <div style="padding: 8px 4px;">{title} content</div>
          ))}
        </TabStrip>

        <h3>With icons</h3>
        <TabStrip
          vertical={true}
          active={this.activeTab}
          headers={headers.map(({ title, icon }) => ({
            title,
            icon
          }))}
          onTabChange={this.onTabChange}
          style={this.tabStripStyles}
        >
          {headers.map(({ title }) => (
            <div style="padding: 8px 4px;">{title} content</div>
          ))}
        </TabStrip>

        <h3>With icons and subtitle</h3>
        <TabStrip active={this.activeTab} headers={headers} onTabChange={this.onTabChange} style={this.tabStripStyles} vertical={true}>
          {headers.map(({ title }) => (
            <div style="padding: 8px 4px;">{title} content</div>
          ))}
        </TabStrip>

        <h3>With custom actions</h3>
        <TabStrip active={this.activeTab} headers={headers} onTabChange={this.onTabChange} style={this.tabStripStyles} vertical={true}>
          <div slot="actions">A non-tab component.</div>
          {headers.map(({ title }) => (
            <div style="padding: 8px 4px;">{title} content</div>
          ))}
        </TabStrip>
      </div>
    );
  }

  private get wrapperStyles(): Partial<CSSStyleDeclaration> {
    return {
      width: '600px',
      padding: '0 10px'
    };
  }

  private get tabStripStyles(): Partial<CSSStyleDeclaration> {
    return {
      boxShadow: '0 0 5px rgba(200, 200, 200, 0.5)'
    };
  }

  private storiesOnTabChange: Function = action('onTabChange');

  private onTabChange(index: number): void {
    this.activeTab = index;
    this.storiesOnTabChange(index);
  }
}

storiesOf(`${StorybookSection.LAYOUT}/TabStrip`, module)
  .addDecorator(withReadme(TabStripReadme))
  .add('List of Tabs', () => ListStory)
  .add('With badges', () => ListWithBadgeStory)
  .add('Vertical mode', () => VerticalStory);
