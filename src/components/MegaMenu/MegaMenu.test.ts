import { shallowMount, Wrapper } from '@vue/test-utils';
import { MegaMenu } from './MegaMenu';
import { MenuColumn } from './MenuColumn/MenuColumn';

describe(MegaMenu, () => {
  let wrapper: Wrapper<MegaMenu<string>>;

  const config: Array<MegaMenu.Column<string>> = [
    {
      groups: [
        {
          title: 'User',
          items: [
            {
              value: 'userAttribute',
              label: 'User attribute'
            },
            {
              value: 'userBucket',
              label: 'User bucket'
            },
            {
              value: 'userId',
              label: 'User ID'
            },

            {
              value: 'city',
              label: 'City',
              hidden: true
            }
          ]
        },
        {
          title: 'Session',
          items: [
            {
              value: 'sessionStart',
              label: 'Session start'
            },
            {
              value: 'sessionStartUserTmz',
              label: "Session start time in user's timezone"
            }
          ]
        }
      ]
    },
    {
      groups: [
        {
          title: 'Device',
          items: [
            {
              value: 'deviceModel',
              label: 'Device model'
            },
            {
              value: 'appVersion',
              label: 'App version'
            }
          ]
        }
      ]
    }
  ];

  beforeEach(() => {
    wrapper = shallowMount<MegaMenu<string>>(MegaMenu, { propsData: { config } });
  });

  it('renders', () => {
    expect(wrapper.contains(MegaMenu)).toBe(true);
  });

  it('renders columns', () => {
    expect(wrapper.findAll(MenuColumn).length).toBe(2);
  });

  it('bubbles up a select event', () => {
    wrapper.find(MenuColumn).vm.$emit(MenuColumn.EVENT_SELECT, 'appVersion');
    expect(wrapper.emitted().select[0][0]).toEqual('appVersion');
  });

  it('filters rules when searched', () => {
    wrapper.setProps({ filterTerm: 'session' });

    expect(wrapper.findAll(MenuColumn).length).toBe(1);
    expect(wrapper.find<MenuColumn<string>>(MenuColumn).vm.column.groups).toMatchObject([
      {
        title: 'Session',
        items: [
          {
            value: 'sessionStart',
            label: 'Session start'
          },
          {
            value: 'sessionStartUserTmz',
            label: "Session start time in user's timezone"
          }
        ]
      }
    ]);
  });

  describe('flattenColumnsToItems', () => {
    it('flattens tree structure to an array of items', () => {
      expect(MegaMenu.flattenColumnsToItems(config)).toMatchObject([
        { value: 'userAttribute', label: 'User attribute' },
        { value: 'userBucket', label: 'User bucket' },
        { value: 'userId', label: 'User ID' },
        { value: 'city', label: 'City', hidden: true },
        { value: 'sessionStart', label: 'Session start' },
        { value: 'sessionStartUserTmz', label: "Session start time in user's timezone" },
        { value: 'deviceModel', label: 'Device model' },
        { value: 'appVersion', label: 'App version' }
      ]);
    });
  });

  describe('filterGroup', () => {
    it('filters group items so they all include the search term (case-insensitive)', () => {
      expect(MegaMenu.filterGroup(config[0].groups[0], 'b')).toMatchObject({
        title: 'User',
        items: [
          {
            value: 'userAttribute',
            label: 'User attribute'
          },
          {
            value: 'userBucket',
            label: 'User bucket'
          }
        ]
      });
    });

    it('filters hidden items', () => {
      expect(MegaMenu.filterColumns(config, 'city')).toMatchObject({});
    });
  });

  describe('filterColumns', () => {
    it("filters column's group's items so they all include the search term (case-insensitive)", () => {
      expect(MegaMenu.filterColumns(config, 'b')).toMatchObject([
        {
          groups: [
            {
              title: 'User',
              items: [
                {
                  value: 'userAttribute',
                  label: 'User attribute'
                },
                {
                  value: 'userBucket',
                  label: 'User bucket'
                }
              ]
            }
          ]
        }
      ]);
    });

    it('filters hidden items', () => {
      expect(MegaMenu.filterColumns(config, 'city')).toMatchObject([]);
    });
  });

  describe('filterItems', () => {
    it('filters items so they all include the search term (case-insensitive)', () => {
      expect(MegaMenu.filterItems(MegaMenu.flattenColumnsToItems(config), 'b')).toMatchObject([
        {
          value: 'userAttribute',
          label: 'User attribute'
        },
        {
          value: 'userBucket',
          label: 'User bucket'
        }
      ]);
    });

    it('filters hidden items', () => {
      expect(MegaMenu.filterItems(MegaMenu.flattenColumnsToItems(config), 'city')).toMatchObject([]);
    });
  });

  describe('sumItemsCount', () => {
    it('returns count of all items', () => {
      expect(MegaMenu.sumItemsCount(config)).toBe(8);
    });
  });
});
