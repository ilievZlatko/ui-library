import { shallowMount, Wrapper } from '@vue/test-utils';
import { Breadcrumbs } from './Breadcrumbs';

describe(Breadcrumbs, () => {
  let wrapper: Wrapper<Breadcrumbs<string>>;

  const items: Array<Breadcrumbs.Item<string>> = [
    {
      label: 'First',
      location: { name: 'test' }
    },
    {
      label: 'Second',
      value: 'second'
    },
    {
      label: 'Third',
      value: 'third'
    }
  ];

  beforeEach(() => {
    wrapper = shallowMount<Breadcrumbs<string>>(Breadcrumbs, {
      propsData: {
        items
      },
      stubs: ['router-link']
    });
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findAll('.item').length).toBe(2);
    expect(wrapper.findAll('.item-last').length).toBe(1);
  });

  it(`emits select on click`, () => {
    wrapper
      .findAll('.item')
      .at(1)
      .trigger('click');
    expect(wrapper.emitted('select')).toMatchObject([[items[1]]]);
  });

  it(`doesn't emit select on last item`, () => {
    wrapper
      .find('.item-last')
      .trigger('click');
    expect(wrapper.emitted('select')).toBeUndefined();
  });

});
