import { mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import { KeyboardConstants } from 'leanplum-lib-common';
import * as utils from '../../utils/getTextWidth';
import { Icon } from '../icon/Icon';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { TextInput } from './TextInput';

const PLACEHOLDER: string = 'test label';
const VALUE: string = 'test value';

describe(TextInput, () => {
  it('renders without error', () => {
    const textInput = mount(TextInput, {
      propsData: {
        placeholder: PLACEHOLDER
      }
    });

    expect(textInput.contains(TextInput)).toBeTruthy();
  });

  it('renders placeholder', () => {
    const textInput = mount(TextInput, {
      propsData: {
        placeholder: PLACEHOLDER
      }
    });

    expect((textInput.find('input').element as HTMLInputElement).placeholder).toBe(PLACEHOLDER);
  });

  it('renders not-focused', () => {
    const textInput = mount(TextInput, {
      propsData: {
        autoFocus: false
      }
    });

    expect(textInput.find('input').element).not.toBe(document.activeElement);
  });

  it('renders focused', async () => {
    const textInput = mount(TextInput, {
      propsData: {
        autoFocus: true
      }
    });
    // workaround for jsdom(v16) bug with focus: https://github.com/jsdom/jsdom/issues/2586
    document.body.appendChild(textInput.vm.$el);

    await flushPromises();

    expect(textInput.find('input').element).toBe(document.activeElement);
  });

  it('renders value', () => {
    const textInput = mount(TextInput, {
      propsData: {
        placeholder: PLACEHOLDER,
        value: VALUE
      }
    });

    expect((textInput.find('input').element as HTMLInputElement).value).toBe(VALUE);
  });

  it('renders icon when passed', () => {
    const textInput = mount(TextInput, {
      propsData: {
        placeholder: PLACEHOLDER,
        value: VALUE,
        icon: Icon.Type.COPY
      }
    });

    expect(textInput.contains(Icon)).toBe(true);
  });

  it("emits 'change' event on change", () => {
    const textInput = mount(TextInput, {
      propsData: {
        placeholder: PLACEHOLDER,
        value: VALUE
      }
    });

    const inputField = textInput.find('input');
    inputField.trigger('change');
    expect(textInput.emitted().change).toEqual([[VALUE]]);
  });

  it("emits 'input' event on input", () => {
    const textInput = mount(TextInput, {
      propsData: {
        placeholder: PLACEHOLDER,
        value: VALUE
      }
    });

    const inputField = textInput.find('input');
    inputField.trigger('input');
    expect(textInput.emitted().input).toEqual([[VALUE]]);
  });

  it("emits 'submit' event on ENTER", () => {
    const textInput = mount(TextInput, {
      propsData: {
        placeholder: PLACEHOLDER,
        value: VALUE
      }
    });

    const inputField = textInput.find('input');
    inputField.trigger('keydown', { key: KeyboardConstants.ENTER_KEY });
    expect(textInput.emitted().submit).toEqual([[VALUE]]);
  });

  it('renders a password field if type=password', () => {
    const textInput = mount(TextInput, {
      propsData: {
        type: TextInput.Type.PASSWORD
      }
    });

    expect(textInput.find('input').attributes('type')).toEqual('password');
  });

  it('emits input on mouse paste', async () => {
    const textInput = mount(TextInput, {
      propsData: {
        placeholder: PLACEHOLDER,
        value: VALUE
      }
    });

    textInput.find('input').trigger('paste', {
      clipboardData: {
        getData(): string {
          return 'discarded';
        }
      }
    });

    await textInput.vm.$nextTick();

    // The original value is emitted because the actual paste
    // functionality is not triggered and the input still holds
    // its original value.
    expect(textInput.emitted().input[0][0]).toBe(VALUE);
  });

  it('renders LoadingSpinner when loading is true', () => {
    const textInput = mount(TextInput, {
      propsData: {
        placeholder: PLACEHOLDER,
        value: VALUE,
        loading: true
      }
    });

    expect(textInput.contains(LoadingSpinner)).toBe(true);
  });

  it('does not render LoadingSpinner when loading is true and disabled is true', () => {
    const textInput = mount(TextInput, {
      propsData: {
        placeholder: PLACEHOLDER,
        value: VALUE,
        loading: true,
        disabled: true
      }
    });

    expect(textInput.contains(LoadingSpinner)).toBe(false);
  });

  describe('expand', () => {
    afterEach(() => jest.clearAllMocks());

    it('renders with static width if expandConfig is passed', () => {
      jest.spyOn(utils, 'getTextWidth').mockReturnValue(100);

      const textInput = mount(TextInput, {
        propsData: {
          value: VALUE,
          expandConfig: {
            defaultWidth: 200,
            minWidth: 100,
            maxWidth: 300
          }
        }
      });

      expect(textInput.find('label').html()).toContain('style');
    });

    it('sets the default width as initial width when empty', () => {
      jest.spyOn(utils, 'getTextWidth').mockReturnValue(100);

      const textInput = mount(TextInput, {
        propsData: {
          value: '',
          expandConfig: {
            defaultWidth: 200,
            minWidth: 150,
            maxWidth: 300
          }
        }
      });

      expect(textInput.find('label').html()).toContain('200px');
    });

    it("sets the width of the text as width if it's larger than the min width", () => {
      jest.spyOn(utils, 'getTextWidth').mockReturnValue(250);

      const textInput = mount(TextInput, {
        propsData: {
          value: VALUE,
          expandConfig: {
            defaultWidth: 200,
            minWidth: 150,
            maxWidth: 300
          }
        }
      });

      expect(textInput.find('label').html()).toContain('250px');
    });

    it('sets the max width as width if the text is larger than max width', () => {
      jest.spyOn(utils, 'getTextWidth').mockReturnValue(400);

      const textInput = mount(TextInput, {
        propsData: {
          value: VALUE,
          expandConfig: {
            defaultWidth: 200,
            minWidth: 150,
            maxWidth: 300
          }
        }
      });

      expect(textInput.find('label').html()).toContain('300px');
    });
  });
});
