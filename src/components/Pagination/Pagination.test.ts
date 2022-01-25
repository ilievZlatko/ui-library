import { shallowMount, Slots, Wrapper } from '@vue/test-utils';
import { PartialKeys } from 'leanplum-lib-common';
import { Pagination } from './Pagination';

describe(Pagination, () => {
  it('renders the component', () => {
    const wrapper = renderComponent();

    expect(wrapper.isVueInstance()).toBe(true);
  });

  it('applies the specified class name', () => {
    const wrapper = renderComponent({ className: 'foo' });

    expect(wrapper.find('.foo').exists()).toBe(true);
  });

  it('renders correct number of pages', () => {
    const wrapper = renderComponent({ count: 4 });

    expect(wrapper.findAll('.page-list > .page-button').length).toBe(4);
  });

  it('displays correct page as active', () => {
    const wrapper = renderComponent();

    expect(wrapper.find('.page-button.active').text()).toEqual('1');

    wrapper.setProps({ current: 4 });

    expect(wrapper.find('.page-button.active').text()).toEqual('4');
  });

  it('disables the prev button on first page', () => {
    const wrapper = renderComponent({ count: 4, current: 1 });

    expect(
      wrapper
        .findAll('.page-arrow')
        .at(0)
        .classes()
        ).toContain('disabled');
  });

  it('disables the next button on last page', () => {
    const wrapper = renderComponent({ count: 4, current: 4 });

    expect(
      wrapper
        .findAll('.page-arrow')
        .at(1)
        .classes()
    ).toContain('disabled');
  });

  it('renders enabled prev/next buttons in mid-range', () => {
    const wrapper = renderComponent({ count: 5, current: 3 });

    for (const item of wrapper.findAll('.page-arrow').wrappers) {
      expect(item.classes()).not.toContain('disabled');
    }
  });

  it('emits `change` event on page click', () => {
    const wrapper = renderComponent();

    wrapper
      .findAll('.page-list > .page-button')
      .at(3)
      .trigger('click');

    expect(wrapper.emitted('change')).toBeDefined();
    expect(wrapper.emitted('change')[0]).toEqual([4]);
  });

  it('emits `change` event on prev button click', () => {
    const wrapper = renderComponent({ count: 4, current: 3 });

    wrapper
      .findAll('.page-arrow')
      .at(0)
      .trigger('click');

    expect(wrapper.emitted('change')).toBeDefined();
    expect(wrapper.emitted('change')[0]).toEqual([2]);
  });

  it('emits `change` event on next button click', () => {
    const wrapper = renderComponent({ count: 4, current: 2 });

    wrapper
      .findAll('.page-arrow')
      .at(1)
      .trigger('click');

    expect(wrapper.emitted('change')).toBeDefined();
    expect(wrapper.emitted('change')[0]).toEqual([3]);
  });

  describe('placeholders', () => {
    it('does not render placeholders with up to 7 pages', () => {
      expect(placeholderCount(renderComponent())).toBe(0);
    });

    context('with 10 buttons', () => {
      it('renders correct buttons with current 1-4', () => {
        const expected = [1, 2, 3, 4, 5, '...', 10];

        for (let i = 1; i < 5; ++i) {
          expect(placeholders(renderComponent({ current: i, count: 10 }))).toMatchObject(expected);
        }
      });

      it('renders correct buttons with current 5', () => {
        const expected = [1, '...', 4, 5, 6, '...', 10];

        expect(placeholders(renderComponent({ current: 5, count: 10 }))).toMatchObject(expected);
      });

      it('renders correct buttons with current 6', () => {
        const expected = [1, '...', 5, 6, 7, '...', 10];

        expect(placeholders(renderComponent({ current: 6, count: 10 }))).toMatchObject(expected);
      });

      it('renders correct buttons with current 7-10', () => {
        const expected = [1, '...', 6, 7, 8, 9, 10];

        for (let i = 7; i < 11; ++i) {
          expect(placeholders(renderComponent({ current: i, count: 10 }))).toMatchObject(expected);
        }
      });
    });
  });
});

function placeholderCount(wrapper: Wrapper<Pagination>): number {
  return wrapper
    .findAll('.page-list > .page-button')
    .wrappers.filter((wrapper) => wrapper.text() === '...').length;
}

function placeholders(wrapper: Wrapper<Pagination>): Array<string | number> {
  return wrapper
    .findAll('.page-list > .page-button')
    .wrappers.map((wrapper) => Number(wrapper.text()))
    .map((index) => (isNaN(index) ? '...' : index));
}

function renderComponent(props?: PartialKeys<Pagination.Props, 'count'>, slotContent?: Slots): Wrapper<Pagination> {
  return shallowMount(Pagination, {
    propsData: {
      count: 7,
      ...(props || {})
    },
    slots: slotContent ? { default: slotContent } : {}
  });
}
