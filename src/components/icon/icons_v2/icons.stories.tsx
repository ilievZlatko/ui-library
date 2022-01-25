import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../../utils/storybookUtils';

import './migration.stories.scss';

const ICON_PATHS = require
  .context('./new', false, /.svg$/)
  .keys()
  .map((x) => x.replace('./', ''));

@Component({ name: 'IconDocumentationStory' })
class IconDocumentationStory extends Vue {
  private bgColor: string = '#f6f9f8';
  private fontColor: string = '#1076fb';
  private iconSize: string = '20px';

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper icons-wrapper">
        <h3>Description and guidelines</h3>
        <h4>Icon Size</h4>
        <p>
          Default SVG icon size is <b>20x20 px</b>. The icon itself (the area that path can occupy) is 16x16 px.
        </p>
        <p>The default icon height 20px is equal to the default line-height, which is also 20px.</p>
        <p>
          2px space around the icon shape is reserved for stroke-width, which is used to make the icon look thicker.
        </p>
        <div class="icon-layout">
          16px
          <div class="icon-preview" />
        </div>
        <h4>Icon thickness</h4>
        <p>
          Use <b>stroke-width</b> to make the icon bolder.
        </p>
        <h6>Example</h6>
        <ul class="icon-list">
          <li>
            <i
              style={{
                backgroundColor: this.bgColor,
                color: this.fontColor,
                width: this.iconSize,
                height: this.iconSize
              }}
              domPropsInnerHTML={require('./new/device-phone.svg')}
            />{' '}
            default (no icon stroke)
          </li>
          <li>
            <i
              class="bold"
              style={{
                backgroundColor: this.bgColor,
                color: this.fontColor,
                width: this.iconSize,
                height: this.iconSize
              }}
              domPropsInnerHTML={require('./new/device-phone.svg')}
            />{' '}
            stroke-width: 0.8;
          </li>
        </ul>
        <p>&nbsp;</p>
        <h4>Circle icon on solid background</h4>
        Use css to add border-radius and background color.
        <h6>Example</h6>
        <ul class="icon-list">
          <li>
            <i
              class="circle warning bold"
              style="width: 16px; height: 16px;"
              domPropsInnerHTML={require('./new/exclamation-10.svg')}
            />{' '}
            exclamation-10.svg <br />
            stroke-width: 0.8;
          </li>
          <li>
            <i
              class="circle error bold"
              style="width: 16px; height: 16px;"
              domPropsInnerHTML={require('./new/exclamation-10.svg')}
            />{' '}
            exclamation-10.svg <br />
            stroke-width: 0.8;
          </li>
          <li>
            <i
              class="circle dark bold"
              style="width: 16px; height: 16px;"
              domPropsInnerHTML={require('./new/exclamation-10.svg')}
            />{' '}
            exclamation-10.svg <br />
            stroke-width: 0.8;
          </li>
        </ul>
        <ul class="icon-list">
          <li>
            <i
              class="circle warning bold"
              style="width: 16px; height: 16px;"
              domPropsInnerHTML={require('./new/help-10.svg')}
            />{' '}
            help-10.svg <br />
            stroke-width: 0.8;
          </li>
          <li>
            <i
              class="circle error bold"
              style="width: 16px; height: 16px;"
              domPropsInnerHTML={require('./new/help-10.svg')}
            />{' '}
            help-10.svg <br />
            stroke-width: 0.8;
          </li>
          <li>
            <i
              class="circle dark bold"
              style="width: 16px; height: 16px;"
              domPropsInnerHTML={require('./new/help-10.svg')}
            />{' '}
            help-10.svg <br />
            stroke-width: 0.8;
          </li>
        </ul>
        <h4>Icons</h4>
        <div style={{ marginBottom: '20px' }}>
          <label>
            <span>Background Color:</span>
            <br />
            <input type="text" v-model={this.bgColor} />
          </label>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>
            <span>Font Color:</span>
            <br />
            <input type="text" v-model={this.fontColor} />
          </label>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>
            <span>Icon size:</span>
            <br />
            <input type="text" v-model={this.iconSize} /> use 20px, 40px, 60px, 80px, 100px etc.
          </label>
        </div>
        <ul class="icon-list">
          {ICON_PATHS.map((iconName) => (
            <li>
              <i
                style={{
                  backgroundColor: this.bgColor,
                  color: this.fontColor,
                  width: this.iconSize,
                  height: this.iconSize
                }}
                domPropsInnerHTML={require(`./new/${iconName}`)}
              />
              {iconName}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

storiesOf(`${StorybookSection.BASICS}/Icon`, module).add('Icons (new)', () => IconDocumentationStory);
