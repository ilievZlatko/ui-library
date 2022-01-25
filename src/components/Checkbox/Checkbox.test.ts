import { shallowMount, Wrapper } from '@vue/test-utils';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders the correct class names', () => {
    assertClassNames({}, 'container', 'unchecked');
    assertClassNames({ checked: true }, 'container', 'checked');
    assertClassNames({ text: 'abc', checked: true }, 'container', 'checked');
    assertClassNames({ disabled: true }, 'container', 'disabled', 'unchecked');
    assertClassNames({ disabled: true, checked: true }, 'container', 'disabled', 'checked');
    assertClassNames({ indeterminate: true, checked: true }, 'container', 'indeterminate');
    assertClassNames({ indeterminate: true, checked: false }, 'container', 'indeterminate');
    assertClassNames({ indeterminate: true, checked: true, disabled: true }, 'container', 'indeterminate', 'disabled');
    assertClassNames({ indeterminate: true, checked: false, disabled: true }, 'container', 'indeterminate', 'disabled');

    function assertClassNames(props: Partial<Checkbox.Props>, ...classNames: Array<string>): void {
      const wrapper = renderComponent(props);
      expect(classNames).toEqual(expect.arrayContaining(wrapper.find('label.container').classes()));
    }
  });

  it('renders a checkbox with no text', () => {
    const wrapper = renderComponent();
    expect(wrapper.contains('span.text')).toBeFalsy();
  });

  it('renders a checkbox with a default slot', () => {
    const wrapper = shallowMount(Checkbox, {
      slots: {
        default: 'agree'
      }
    });
    expect(wrapper.contains('div.text')).toBeTruthy();
    expect(wrapper.find('div.text').text()).toEqual('agree');
  });

  function renderComponent(propsData: Checkbox.Props = {}): Wrapper<Checkbox> {
    return shallowMount(Checkbox, {
      propsData
    });
  }
});
