import { mount, Wrapper } from '@vue/test-utils';
import { VNode } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Pagination } from '../Pagination/Pagination';
import { ListView } from './ListView';

@Component({ name: 'ListHarness' })
class ListHarness<ItemType> extends Vue {
  @Prop({ required: true, type: Array })
  readonly items: Array<ItemType>;

  @Prop({ required: false, default: null, type: Number })
  readonly activeIndex: number | null;

  @Prop({ required: false, default: 0, type: Number })
  readonly paginateBy: number;

  @Prop({ required: false, default: false, type: Boolean })
  readonly disabled: boolean;

  render(): VNode {
    return (
      <ListView
        {...{ props: this.$props }}
        onClick={(item: ItemType) => this.$emit('click', item)}
        scopedSlots={{
          item: (item: ItemType) => {
            return <div class="test"> {item} </div>;
          }
        }}
      />
    );
  }
}

describe(ListView, () => {
  describe('general', () => {
    let wrapper: Wrapper<ListHarness<string>>;

    beforeEach(() => {
      wrapper = renderComponent(null);
    });

    it('renders the component', () => {
      expect(wrapper.contains(ListView)).toBe(true);
    });

    it('renders the items', () => {
      expect(wrapper.findAll('.test').length).toBe(3);
    });

    it('does not render pagination', () => {
      expect(wrapper.contains(Pagination)).toBe(false);
    });

    it('sets `active` class', () => {
      expect(wrapper.findAll('.list-item.active').length).toBe(0);
      wrapper.setProps({ activeIndex: 2 });
      expect(wrapper.findAll('.list-item.active').length).toBe(1);
    });

    it('emits click when clicking on li element', () => {
      wrapper.find('li').trigger('click');
      expect(wrapper.emitted().click).toBeDefined();
    });

    context('disabled', () => {
      beforeEach(() => {
        wrapper.setProps({ disabled: true });
      });

      it('sets disabled class', () => {
        expect(wrapper.find('.lp-list-view-wrapper').classes()).toContain('disabled');
      });

      it('does not emit click', () => {
        wrapper.find('li').trigger('click');
        expect(wrapper.emitted().click).toBeUndefined();
      });
    });
  });

  describe('pagination', () => {
    let wrapper: Wrapper<ListHarness<string>>;

    beforeEach(() => {
      wrapper = renderComponent(null, 1);
    });

    it('renders Pagination', () => {
      expect(wrapper.contains(Pagination)).toBe(true);
    });

    it('passes correct props', () => {
      expect(wrapper.find(Pagination).props()).toMatchObject({ current: 1, count: 3 });
    });

    it('updates current page on change', () => {
      wrapper.find(Pagination).vm.$emit('change', 2);
      expect(wrapper.find(Pagination).props()).toMatchObject({ current: 2 });
    });

    it('renders only "paginateBy" amount of items', () => {
      expect(wrapper.findAll('.test').length).toBe(1);
    });

    it('renders next page of items after updating page', () => {
      wrapper.find(Pagination).vm.$emit('change', 2);
      expect(wrapper.find('.test').text()).toBe('test2');
    });

    it('passes correct activeIndex', () => {
      wrapper.setProps({ activeIndex: 0 });
      expect(wrapper.contains('.list-item.active')).toBe(true);
      wrapper.find(Pagination).vm.$emit('change', 2);
      expect(wrapper.contains('.list-item.active')).toBe(false);
    });
  });

  describe('scrolling', () => {
    let wrapper: Wrapper<ListHarness<string>>;
    let el: HTMLUListElement;

    beforeEach(() => {
      wrapper = renderComponent(null);
      el = wrapper.find('.lp-list-view-wrapper').element as HTMLUListElement;
      jest.spyOn(el, 'clientHeight', 'get').mockReturnValue(100);
      jest.spyOn(el, 'scrollHeight', 'get').mockReturnValue(500);
    });

    it('sets scroll classes as expected', () => {
      expect(el.classList.contains('scrollable')).toBe(false);
      expect(el.classList.contains('scrolled')).toBe(false);
      expect(el.classList.contains('scrolled-to-end')).toBe(false);

      wrapper.setProps({ items: new Array(10).fill(0).map((_, i) => `Item #${i}`) });

      expect(el.classList.contains('scrollable')).toBe(true);
      expect(el.classList.contains('scrolled')).toBe(false);
      expect(el.classList.contains('scrolled-to-end')).toBe(false);

      scrollElementTo(el, 1);

      expect(el.classList.contains('scrollable')).toBe(true);
      expect(el.classList.contains('scrolled')).toBe(true);
      expect(el.classList.contains('scrolled-to-end')).toBe(false);

      scrollElementTo(el, el.scrollHeight - el.clientHeight);

      expect(el.classList.contains('scrollable')).toBe(true);
      expect(el.classList.contains('scrolled')).toBe(true);
      expect(el.classList.contains('scrolled-to-end')).toBe(true);

      scrollElementTo(el, el.scrollHeight - el.clientHeight - 1);

      expect(el.classList.contains('scrollable')).toBe(true);
      expect(el.classList.contains('scrolled')).toBe(true);
      expect(el.classList.contains('scrolled-to-end')).toBe(false);
    });

    it('resets scroll classes on items update', () => {
      // Force update of scroll state to take into account element mocks.
      wrapper.setProps({ items: ['one', 'two'] });
      // Scroll to the end so that all scroll state classes get added.
      scrollElementTo(el, el.scrollHeight - el.clientHeight);

      wrapper.setProps({ items: new Array(10).fill(0).map((_, i) => `Item #${i}`) });

      expect(el.classList.contains('scrollable')).toBe(true);
      expect(el.classList.contains('scrolled')).toBe(false);
      expect(el.classList.contains('scrolled-to-end')).toBe(false);
    });

    it('keeps scroll classes on prop update', () => {
      // Force update of scroll state to take into account element mocks.
      wrapper.setProps({ items: ['one', 'two'] });
      // Scroll to the end so that all scroll state classes get added.
      scrollElementTo(el, el.scrollHeight - el.clientHeight);

      wrapper.setProps({ activeIndex: 1 });

      expect(el.classList.contains('scrollable')).toBe(true);
      expect(el.classList.contains('scrolled')).toBe(true);
      expect(el.classList.contains('scrolled-to-end')).toBe(true);
    });
  });
});

function renderComponent(activeIndex: number | null, paginateBy?: number): Wrapper<ListHarness<string>> {
  return mount<ListHarness<string>>(ListHarness, {
    propsData: {
      paginateBy,
      activeIndex,
      items: ['test1', 'test2', 'test3']
    }
  });
}

// Workaround because the scroll methods are not implemented in JSDOM.
function scrollElementTo(el: HTMLElement, offset: number): void {
  el.scrollTop = offset;
  el.dispatchEvent(new Event('scroll'));
}
