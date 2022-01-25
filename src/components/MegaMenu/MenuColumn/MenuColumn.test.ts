import { shallowMount, Wrapper } from '@vue/test-utils';
import { ItemGroup } from '../ItemGroup/ItemGroup';
import { MegaMenu } from '../MegaMenu';
import { MenuColumn } from './MenuColumn';

describe(MenuColumn, () => {
  let wrapper: Wrapper<MenuColumn<string>>;

  const column: MegaMenu.Column = {
    groups: [
      {
        title: 'Device',
        items: [
          {
            value: 'deviceModel',
            label: 'Device model'
          }
        ]
      },
      {
        title: 'User',
        items: [
          {
            value: 'userAttribute',
            label: 'User attribute'
          }
        ]
      }
    ]
  };

  beforeEach(() => {
    wrapper = shallowMount<MenuColumn<string>>(MenuColumn, { propsData: { column } });
  });

  it('renders', () => {
    expect(wrapper.contains(MenuColumn)).toBe(true);
  });

  it('renders Item Groups for each item', () => {
    expect(wrapper.findAll(ItemGroup).length).toBe(2);
  });

  it('bubbles up the select event from an Item Group', () => {
    wrapper.find(ItemGroup).vm.$emit(ItemGroup.EVENT_SELECT, 'attribute');

    expect(wrapper.emitted().select[0][0]).toEqual('attribute');
  });

  it('does not render anything if all groups are empty or hidden', () => {
    wrapper.setProps({
      column: {
        groups: [
          { title: '1', items: [] },
          {
            title: '2',
            items: [
              {
                value: 'deviceModel',
                label: 'Device model'
              }
            ],
            hidden: true
          }
        ]
      }
    });

    expect(wrapper.html()).toBeUndefined();
  });
});
