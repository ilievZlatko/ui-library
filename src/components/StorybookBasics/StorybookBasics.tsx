import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import './StorybookBasics.scss';

@Component({ name: 'StorybookBasics' })
class StorybookBasics extends Vue {

  @Prop({ required: true, type: String })
  mode: StorybookBasics.Mode;

  render(): VNode {
    return (
      <div class="lp-storybook-basics">
        {this.mode === StorybookBasics.Mode.LAYOUT && this.renderLayout()}
        {this.mode === StorybookBasics.Mode.TYPOGRAPHY && this.renderTypography()}
        {this.mode === StorybookBasics.Mode.COLORS && this.renderColors()}
      </div>
    );
  }

  private renderLayout(): Array<VNode> {
    return [
      <h2>Spacing</h2>,
      <div class="grid">
        2px <div class="highlight"><div class="spacing xs"/></div><div>$spacing-xsmall</div>
        4px <div class="highlight"><div class="spacing small"/></div><div>$spacing-small</div>
        8px <div class="highlight"><div class="spacing regular"/></div><div>$spacing-regular</div>
        12px <div class="highlight"><div class="spacing medium"/></div><div>$spacing-medium</div>
        16px <div class="highlight"><div class="spacing large"/></div><div>$spacing-large</div>
        20px <div class="highlight"><div class="spacing xlarge"/></div><div>$spacing-xlarge</div>
        24px <div class="highlight"><div class="spacing xxlarge"/></div><div>$spacing-xxlarge</div>
        32px <div class="highlight"><div class="spacing xxxlarge"/></div><div>$spacing-xxxlarge</div>
        36px <div class="highlight"><div class="spacing four-xlarge"/></div><div>$spacing-4xlarge</div>
        40px <div class="highlight"><div class="spacing five-xlarge"/></div><div>$spacing-5xlarge</div>
      </div>,
      <h2>Item Size</h2>,
      <div class="grid">
        32px <div class="size item-medium"/><div>$size-item-medium</div>
        36px <div class="size item-regular"/><div>$size-item-regular</div>
        40px <div class="size item-large"/><div>$size-item-large</div>
        44px <div class="size item-xlarge"/><div>$size-item-xlarge</div>
      </div>,
      <h2>Item Radius</h2>,
      <div class="grid">
        2px <div class="radius small"/><div>$radius-small</div>
        4px <div class="radius regular"/><div>$radius-regular</div>
        8px <div class="radius medium"/><div>$radius-medium</div>
        10000px <div class="radius circle"/><div>$radius-circle</div>
      </div>
    ];
  }

  private renderTypography(): VNode {
    return (
      <div class="grid typography">
        <div class="font large">This is a large sized text</div>{this.renderFontInfo('40px', '40px', 'circular-book-bold')}
        <div class="font medium">This is a medium sized text</div>{this.renderFontInfo('32px', '36px', 'circular-book-bold')}
        <div class="font heading">This is a heading</div>{this.renderFontInfo('24px', '32px', 'circular-book-bold')}
        <div class="font titleBold">This is a bold title</div>{this.renderFontInfo('18px', '24px', 'circular-book-bold')}
        <div class="font title">This is a title</div>{this.renderFontInfo('18px', '24px', 'circular-book')}
        <div class="font bold">This is a bold text</div>{this.renderFontInfo('14px', '20px', 'circular-book-bold')}
        <div class="font regular">This is a regular text</div>{this.renderFontInfo('14px', '20px', 'circular-book')}
        <div class="font explanatory">This is an explanation</div>{this.renderFontInfo('12px', '16px', 'circular-book')}
        <div class="font titleUppercase">This is a title in all caps</div>
          {this.renderFontInfo('11px', '16px', 'circular-book-bold', '1px', 'uppercase')}
      </div>
    );
  }

  private renderColors(): VNode {
    return (
      <div class="grid">
        #1076FB <div class="color blue"/><div>$color-blue</div>
        #1DB92C <div class="color green"/><div>$color-green</div>
        #FFC100 <div class="color yellow"/><div>$color-yellow</div>
        #FF801D <div class="color orange"/><div>$color-orange</div>
        #FE2A4B <div class="color red"/><div>$color-red</div>
        #191919 <div class="color dark90"/><div>$color-dark90</div>
        #4A4C4C <div class="color dark70"/><div>$color-dark70</div>
        #B2B7B9 <div class="color dark30"/><div>$color-dark30</div>
        #E1E4E5 <div class="color light10"/><div>$color-light10</div>
        #F6F9FB <div class="color light02"/><div>$color-light02</div>
        #FFFFFF <div class="color white"/><div>$color-white</div>
      </div>
    );
  }

  private renderFontInfo(fontSize: string, lineHeight: string, family: string, letterspacing?: string, transform?: string): VNode {
    return (
      <div>
        <div>Font size: {fontSize}</div>
        <div>Line height: {lineHeight}</div>
        <div>Font family: {family}, Helvetica, Arial, Sans Serif</div>
        {letterspacing && <div>Letterspacing: {letterspacing}</div>}
        {transform && <div>text-transform: {transform}</div>}
      </div>
    );
  }
}

namespace StorybookBasics {
  export enum Mode {
    LAYOUT = 'Layout',
    TYPOGRAPHY = 'Typography',
    COLORS = 'Colors'
  }
}

export { StorybookBasics };
