import { shallowMount, Wrapper } from '@vue/test-utils';
import { OverflowableText } from 'leanplum-lib-ui';
import { Button } from '../../Button/Button';
import { MegaMenu } from '../MegaMenu';
import { ItemGroup } from './ItemGroup';

describe(ItemGroup, () => {
  let wrapper: Wrapper<ItemGroup<string>>;

  const actionFn = jest.fn();

  const group: MegaMenu.Group = {
    title: 'Device',
    subtitle: 'Test',
    columns: 5,
    items: [
      {
        value: 'appVersion',
        label: 'App version'
      },
      {
        value: 'userAttribute',
        label: 'User attribute'
      }
    ],
    action: {
      label: 'test',
      onClick: actionFn
    }
  };

  beforeEach(() => {
    wrapper = shallowMount<ItemGroup<string>>(ItemGroup, { propsData: { group } });
  });

  it('renders', () => {
    expect(wrapper.contains(ItemGroup)).toBe(true);
  });

  it('renders title if it exists', () => {
    expect(wrapper.html()).toMatch(/Device/);
  });

  it('renders subtitle if it exists', () => {
    expect(wrapper.html()).toMatch(/Test/);
  });

  it('renders action button if it exists', () => {
    expect(wrapper.find<Button>(Button).vm.text).toBe('test');
  });

  it('calls action onClick on clicking action button', () => {
    wrapper.find(Button).vm.$emit('click');
    expect(actionFn).toHaveBeenCalled();
  });

  it('renders the items', () => {
    expect(wrapper.html()).toMatch(/App version/);
    expect(wrapper.html()).toMatch(/User attribute/);
  });

  it("renders the item's label in OverflowableText", () => {
    expect(wrapper.findAll<OverflowableText>(OverflowableText).wrappers.map((x) => x.vm.text)).toMatchObject([
      'App version',
      'User attribute'
    ]);
  });

  it('passes appropriate width to items to fit the right amount of columns', () => {
    expect(wrapper.findAll('li').wrappers.every((x) => x.element.style.width === '20%')).toBe(true);
  });

  it('emits when an item is selected', () => {
    wrapper.find('.menu-item').trigger('click');

    expect(wrapper.emitted().select[0][0]).toBe('appVersion');
  });

  context('with disabled items', () => {
    beforeEach(() => {
      const groupWithDisabled: MegaMenu.Group = {
        items: [
          {
            value: 'appVersion',
            label: 'App version',
            disabled: true
          }
        ]
      };

      wrapper.setProps({ group: groupWithDisabled });
    });

    it('renders properly', () => {
      expect(wrapper.find('li').classes()).toContain('disabled');
    });

    it("doesn't emit", () => {
      wrapper.find('.menu-item-link').trigger('click');

      expect(wrapper.emitted().select).toBeUndefined();
    });
  });

  it("doesn't render hidden items", () => {
    const groupWithHidden: MegaMenu.Group = {
      items: [
        {
          value: 'appVersion',
          label: 'App version',
          hidden: true
        },
        {
          value: 'deviceVersion',
          label: 'Device version'
        }
      ]
    };

    wrapper.setProps({ group: groupWithHidden });
    expect(wrapper.findAll('.menu-item').length).toBe(1);
  });

  it("doesn't render anything if there are no visible items", () => {
    const groupWithHidden: MegaMenu.Group = {
      items: [
        {
          value: 'appVersion',
          label: 'App version',
          hidden: true
        }
      ]
    };

    wrapper.setProps({ group: groupWithHidden });
    expect(wrapper.html()).toBeUndefined();
  });

  it("doesn't render anything if the group is hidden", () => {
    const groupWithHidden: MegaMenu.Group = {
      items: [
        {
          value: 'appVersion',
          label: 'App version'
        }
      ],
      hidden: true
    };

    wrapper.setProps({ group: groupWithHidden });
    expect(wrapper.html()).toBeUndefined();
  });
});
