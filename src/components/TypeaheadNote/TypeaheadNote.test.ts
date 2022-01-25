import { mount, Wrapper } from '@vue/test-utils';
import { TypeaheadNote } from './TypeaheadNote';

describe(
  TypeaheadNote,
  (): void => {
    let wrapper: Wrapper<TypeaheadNote>;

    function renderComponent(): Wrapper<TypeaheadNote> {
      return mount(TypeaheadNote, {
        propsData: {
          text: 'test text value'
        }
      });
    }

    beforeEach(() => (wrapper = renderComponent()));

    it('renders', () => {
      expect(wrapper.contains(TypeaheadNote)).toBe(true);
    });

    it('contains text', () => {
      expect(wrapper.html()).toContain('test text value');
    });
  }
);
