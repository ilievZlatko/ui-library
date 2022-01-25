import { storiesOf } from '@storybook/vue';
import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { LoadingSpinner } from './LoadingSpinner';

@Component({ name: 'DefaultLoadingSpinnerStory' })
class DefaultLoadingSpinnerStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        {values(LoadingSpinner.Size).map((size) => (
          <LoadingSpinner size={size} />
        ))}
      </div>
    );
  }

  private get wrapperStyles(): Partial<CSSStyleDeclaration> {
    return {
      maxWidth: '400px'
    };
  }
}

storiesOf(`${StorybookSection.UTIL}/LoadingSpinner`, module).add('Default', () => DefaultLoadingSpinnerStory);
