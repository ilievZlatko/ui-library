import { mount, RouterLinkStub, Wrapper } from '@vue/test-utils';
import values from 'lodash/values';
import zipWith from 'lodash/zipWith';
import Vue, { VNode } from 'vue';
import { Checkbox } from '../Checkbox/Checkbox';
import { Icon } from '../icon/Icon';
import { Pagination } from '../Pagination/Pagination';
import { ItemRow } from './ItemRow';
import { Table } from './Table';

const itemsPerPage: TestTableProps['itemsPerPage'] = 10;

const itemKeyGetter: TestTableProps['itemKeyGetter'] = (item: Dessert): string => item.name;

const columnDescriptors: Array<TestColumnDescriptor> = [
  { label: 'Desserts', key: 'name', width: '40%', filterable: true, sortable: true },
  { label: 'Calories', key: 'calories', sortable: true },
  { label: 'Fat (g)', key: 'fat', sortable: true },
  { label: 'Carbs (g)', key: 'carbs', sortable: true },
  { label: 'Protein (g)', key: 'protein', sortable: true },
  { label: 'Iron (%)', key: 'iron', sortable: true }
];

const items: TestTableProps['items'] = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    iron: '1%'
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    iron: '7%'
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: '8%'
  },
  {
    name: 'Gingerbread',
    calories: 392,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    iron: '16%'
  },
  {
    name: 'Jelly bean',
    calories: 392,
    fat: 3.0,
    carbs: 94,
    protein: 0.001,
    iron: '0%'
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    iron: '2%'
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    iron: '45%'
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    iron: '6%'
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    iron: '22%'
  }
];

const moreItems = Array(10)
  .fill(0)
  .flatMap((x, i) => items.map((x) => ({ ...x, name: `${x.name} ${i + 1}` })));

describe(Table, () => {
  let wrapper: Wrapper<Table<Dessert, string>>;

  const itemMenu = mockSlot('itemMenu');
  const bulkSelectMenu = mockSlot('bulkSelectMenu');

  beforeEach(() => {
    itemMenu.mockClear();
    bulkSelectMenu.mockClear();
    wrapper = render();
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe('default layout', () => {
    it('renders header', () => {
      expect(wrapper.contains('.lp-table-header')).toBe(true);

      zipWith(headerCells(), columnDescriptors, (headerCell, column) => {
        expect(headerCell.text()).toContain(column.label);
      });
    });

    it('renders item', () => {
      expect(wrapper.contains('.lp-table-body')).toBe(true);

      expect(itemRows()).toHaveLength(items.length);

      zipWith(itemRows(), items, (row, dessert) => {
        const itemCells = row.findAll('.lp-table-cell').wrappers;

        expect(itemCells).toHaveLength(columnDescriptors.length);

        zipWith(Object.values(dessert), itemCells, (value, itemCell) => {
          expect(itemCell.text()).toEqual(String(value));
        });
      });
    });

    it('renders loading placeholders', () => {
      wrapper.setProps({ loading: true });

      itemRows().forEach((row) => {
        const itemCells = row.findAll('.lp-table-cell').wrappers;

        expect(itemCells).toHaveLength(columnDescriptors.length);

        itemCells.forEach((cell) => {
          expect(cell.contains(`.lp-table-loading-placeholder`)).toBe(true);
        });
      });
    });

    it('renders loadingPlaceholdersCount amount of placeholders', () => {
      const loadingPlaceholdersCount = 4;
      wrapper.setProps({ loading: true, loadingPlaceholdersCount });

      expect(itemRows()).toHaveLength(loadingPlaceholdersCount);
    });
  });

  describe('select', () => {
    beforeEach(() => wrapper.setProps({ selectable: true }));

    it('renders Checkboxes', () => {
      expect(checkboxCells()).toHaveLength(items.length + 1);
    });

    it(`emits ${Table.EVENT_SELECTION_CHANGE} when on Checkbox ${Checkbox.EVENT_CHANGE}`, () => {
      const [headerCheckbox, firstCellCheckbox] = checkboxCells();

      headerCheckbox.trigger('click');
      firstCellCheckbox.trigger('click');

      expect(wrapper.emitted()[Table.EVENT_SELECTION_CHANGE]).toMatchObject([[items], [items.slice(1)]]);
    });

    it('takes into account initially selected items', () => {
      wrapper.setProps({ selected: items.slice(-1) });

      checkboxCells()[1].trigger('click');

      expect(wrapper.emitted()[Table.EVENT_SELECTION_CHANGE]).toMatchObject([[[...items.slice(-1), items[0]]]]);
    });

    it('passes checked: false, indeterminate: true when some items are selected', () => {
      checkboxCells()[1].trigger('click');

      expect(wrapper.find<Checkbox>(Checkbox).vm.indeterminate).toBe(true);
      expect(wrapper.find<Checkbox>(Checkbox).vm.checked).toBe(false);
    });

    it('passes checked: true, indeterminate: false when all items on page are selected', () => {
      checkboxCells()[0].trigger('click');

      expect(wrapper.find<Checkbox>(Checkbox).vm.indeterminate).toBe(false);
      expect(wrapper.find<Checkbox>(Checkbox).vm.checked).toBe(true);
    });

    it('renders selection summary', () => {
      checkboxCells()[1].trigger('click');

      expect(wrapper.find('.lp-table-footer-selection-info').text()).toContain('1');
      expect(wrapper.find('.lp-table-footer-selection-info').text()).toContain('selected');
    });

    it('renders select all action when all items on page are selected', () => {
      wrapper.setProps({ items: moreItems });

      checkboxCells()[0].trigger('click');

      const selectAll = wrapper.find('.lp-table-footer-bulk-select-action');
      expect(selectAll.exists()).toBe(true);
      expect(selectAll.text()).toBe('Select All 100');

      selectAll.trigger('click');

      expect(wrapper.emitted(Table.EVENT_SELECTION_CHANGE)).toMatchObject([[moreItems.slice(0, 10)], [moreItems]]);
    });

    it('selects all filtered items when there is a filter applied', () => {
      const filter = 'e';
      wrapper.setProps({ items: moreItems, filter });

      checkboxCells()[0].trigger('click');

      const bulkActions = wrapper.findAll('.lp-table-footer-bulk-select-action').wrappers;
      expect(bulkActions).toHaveLength(2);

      const [selectAll] = bulkActions;

      selectAll.trigger('click');

      const filteredItems = moreItems.filter((x) => x.name.toLowerCase().includes(filter));

      expect(wrapper.emitted(Table.EVENT_SELECTION_CHANGE)).toMatchObject([
        [filteredItems.slice(0, 10)],
        [filteredItems]
      ]);
    });

    it('appends all filtered items to the selected set', () => {
      const filter = 'e';
      const lollipop = moreItems.find((x) => x.name === 'Lollipop 1')!;
      // preselecting an item that does not match the filter
      wrapper.setProps({ items: moreItems, filter, selected: [lollipop] });

      checkboxCells()[0].trigger('click');

      const [selectAll] = wrapper.findAll('.lp-table-footer-bulk-select-action').wrappers;
      selectAll.trigger('click');

      const filteredItems = moreItems.filter((x) => x.name.toLowerCase().includes(filter));

      expect(wrapper.emitted(Table.EVENT_SELECTION_CHANGE)).toMatchObject([
        [[lollipop, ...filteredItems.slice(0, 10)]],
        [[lollipop, ...filteredItems]]
      ]);
    });

    it('renders unselect all action when some item is selected', () => {
      wrapper.setProps({ items: moreItems });

      checkboxCells()[1].trigger('click');

      const unselectAll = wrapper.find('.lp-table-footer-bulk-select-action');
      expect(unselectAll.exists()).toBe(true);
      expect(unselectAll.text()).toBe('Clear Selection');
      unselectAll.trigger('click');

      expect(wrapper.emitted(Table.EVENT_SELECTION_CHANGE)).toMatchObject([[[moreItems[0]]], [[]]]);
    });

    it('unselects removed items', () => {
      checkboxCells()[0].trigger('click');
      expect(wrapper.find('.lp-table-footer-selection-info').text()).toContain('10');

      wrapper.setProps({ items: items.slice(5) });
      expect(wrapper.find('.lp-table-footer-selection-info').text()).toContain('5');
    });

    it(`emits ${Table.EVENT_SELECTION_CHANGE} if some of the selected items have been removed`, () => {
      checkboxCells()[0].trigger('click');
      wrapper.setProps({ items: items.slice(5) });
      expect(wrapper.emitted(Table.EVENT_SELECTION_CHANGE)).toMatchObject([[items], [items.slice(5)]]);
    });

    it('disables multi select checkbox when a disableBulkSelect is provided', () => {
      wrapper.setProps({ bulkSelectDisabled: true });
      const [headerCheckbox] = checkboxCells();
      expect(headerCheckbox.find<Checkbox>(Checkbox).vm.disabled).toBe(true);
    });

    it('does not render select all action when all page items are selected & disableBulkSelect is provided', () => {
      wrapper.setProps({ bulkSelectDisabled: true, selected: moreItems.slice(0, 20), items: moreItems });

      const bulkSelectActions = wrapper.findAll('.lp-table-footer-bulk-select-action').wrappers;
      expect(bulkSelectActions).toHaveLength(1);

      const [unselectAll] = bulkSelectActions;
      expect(unselectAll.text()).toBe('Clear Selection');
    });
  });

  describe('sort', () => {
    it('sorts string columns', () => {
      wrapper.setProps({
        sortBy: [{ columnId: columnDescriptors[0].label, direction: Table.SortDirection.ASCENDING }]
      });

      expect(pageItems()).toMatchObject(items.slice().sort((a, b) => a.name.localeCompare(b.name)));
    });

    it('sorts string columns with reverse order', () => {
      wrapper.setProps({
        sortBy: [{ columnId: columnDescriptors[0].label, direction: Table.SortDirection.DESCENDING }]
      });

      expect(pageItems()).toMatchObject(items.slice().sort((a, b) => b.name.localeCompare(a.name)));
    });

    it('sorts number columns', () => {
      wrapper.setProps({
        sortBy: [{ columnId: columnDescriptors[1].label, direction: Table.SortDirection.ASCENDING }]
      });

      expect(pageItems()).toMatchObject(items.slice().sort((a, b) => a.calories - b.calories));
    });

    it('sorts number columns with reverse order', () => {
      wrapper.setProps({
        sortBy: [{ columnId: columnDescriptors[1].label, direction: Table.SortDirection.DESCENDING }]
      });

      expect(pageItems()).toMatchObject(items.slice().sort((a, b) => b.calories - a.calories));
    });

    it('sorts by multiple columns', () => {
      wrapper.setProps({
        sortBy: [
          { columnId: columnDescriptors[0].label, direction: Table.SortDirection.ASCENDING },
          { columnId: columnDescriptors[1].label, direction: Table.SortDirection.DESCENDING }
        ]
      });

      expect(pageItems()).toMatchObject(
        items.slice().sort((a, b) => a.name.localeCompare(b.name) || b.calories - a.calories)
      );
    });

    it('supports sorting by column comparator', () => {
      const [firstColumn, secondColumn, ...rest] = columnDescriptors;

      wrapper.setProps({
        columnDescriptors: [
          firstColumn,
          {
            ...secondColumn,
            comparator: (a: Dessert, b: Dessert) => numberCompareEvenFirst(a.calories, b.calories)
          },
          ...rest
        ],
        sortBy: [{ columnId: columnDescriptors[1].label, direction: Table.SortDirection.ASCENDING }]
      });

      expect(pageItems()).toMatchObject(items.slice().sort((a, b) => numberCompareEvenFirst(a.calories, b.calories)));
    });

    it('supports combined column comparator and default sorting', () => {
      const [firstColumn, secondColumn, ...rest] = columnDescriptors;

      wrapper.setProps({
        columnDescriptors: [
          firstColumn,
          {
            ...secondColumn,
            comparator: (a: Dessert, b: Dessert) => numberCompareEvenFirst(a.calories, b.calories)
          },
          ...rest
        ],
        sortBy: [
          { columnId: columnDescriptors[0].label, direction: Table.SortDirection.DESCENDING },
          { columnId: columnDescriptors[1].label, direction: Table.SortDirection.ASCENDING }
        ]
      });

      expect(pageItems()).toMatchObject(
        items.slice().sort((a, b) => b.name.localeCompare(a.name) || numberCompareEvenFirst(a.calories, b.calories))
      );
    });

    it('renders sort icon for each sortable column', () => {
      headerCells().forEach((cell) => expect(cell.contains('.lp-table-sort-icon')).toBe(true));
    });

    it('applies sorted class to sort icon when sorted by', () => {
      wrapper.setProps({
        sortBy: [{ columnId: columnDescriptors[0].label, direction: Table.SortDirection.ASCENDING }]
      });

      expect(headerCells()[0].classes()).toContain('sorted');
    });

    it('applies inverted class to sort icon when sorted by & sort direction is desc', () => {
      wrapper.setProps({
        sortBy: [{ columnId: columnDescriptors[0].label, direction: Table.SortDirection.DESCENDING }]
      });

      expect(
        headerCells()[0]
          .find<Icon>(Icon)
          .classes()
      ).toContain('inverted');
    });

    it('clears sort if sorted by column is removed', () => {
      wrapper.setProps({
        sortBy: [{ columnId: columnDescriptors[0].label, direction: Table.SortDirection.ASCENDING }]
      });
      expect(pageItems()).toMatchObject(items.slice().sort((a, b) => a.name.localeCompare(b.name)));

      wrapper.setProps({ columnDescriptors: [] });
      expect(pageItems()).toMatchObject(items);
    });

    function numberCompareEvenFirst(a: number, b: number): number {
      return (a - b) % 2 === 0 ? a - b : a % 2 || -1;
    }
  });

  describe('filter', () => {
    it('applies default filter predicate with string filter', () => {
      wrapper.setProps({ filter: 'Eclair' });
      expect(wrapper.findAll(ItemRow).wrappers).toHaveLength(1);
    });

    it('applies column filter predicate', () => {
      const [firstColumn, ...rest] = columnDescriptors;
      const predicate = (item: Dessert) => item.calories > 200;

      wrapper.setProps({
        columnDescriptors: [{ ...firstColumn, filter: predicate }, ...rest]
      });

      expect(pageItems()).toMatchObject(items.filter(predicate));
    });
  });

  describe('pagination (with 100 items)', () => {
    beforeEach(() => wrapper.setProps({ items: moreItems }));

    it('renders Pagination', () => {
      expect(wrapper.contains(Pagination)).toBe(true);
    });

    it('passes correct props to Pagination', () => {
      expect(wrapper.find<Pagination>(Pagination).vm.count).toBe(10);
      expect(wrapper.find<Pagination>(Pagination).vm.current).toBe(1);
    });

    it(`updates Pagination prop when it emits ${Pagination.EVENT_CHANGE}`, () => {
      wrapper.find(Pagination).vm.$emit(Pagination.EVENT_CHANGE, 5);

      expect(wrapper.find<Pagination>(Pagination).vm.current).toBe(5);
    });

    it('renders pagination info', () => {
      wrapper.setProps({ items: moreItems.slice(0, 15), itemName: 'dessert' });

      expect(wrapper.find('.lp-table-footer-pagination-info').text()).toBe('1 - 10 of 15 desserts');

      wrapper.find(Pagination).vm.$emit(Pagination.EVENT_CHANGE, 2);

      expect(wrapper.find('.lp-table-footer-pagination-info').text()).toBe('11 - 15 of 15 desserts');
    });

    it('syncs with pageIndex prop', () => {
      wrapper.setProps({ pageIndex: 3 });
      expect(wrapper.find<Pagination>(Pagination).vm.current).toBe(3);
    });

    it(`emits ${Table.EVENT_PAGE_INDEX_CHANGE} on page change`, () => {
      wrapper.find(Pagination).vm.$emit(Pagination.EVENT_CHANGE, 5);
      expect(wrapper.emitted(Table.EVENT_PAGE_INDEX_CHANGE)).toMatchObject(expect.arrayContaining([[5]]));
    });

    it('resets page index to 1 when filter changes', () => {
      wrapper.setProps({ pageIndex: 2 });

      expect(wrapper.find<Pagination>(Pagination).vm.current).toBe(2);
      expect(wrapper.find<Pagination>(Pagination).vm.count).toBe(10);

      wrapper.setProps({ filter: '1' });
      // 2 pages left after filter is applied
      expect(wrapper.find<Pagination>(Pagination).vm.count).toBe(2);
      expect(wrapper.find<Pagination>(Pagination).vm.current).toBe(1);
    });

    it('assigns minimum pageIndex of 1', () => {
      wrapper.setProps({ pageIndex: 0 });
      expect(wrapper.find<Pagination>(Pagination).vm.current).toBe(1);
    });

    it('assigns maximum pageIndex of the value of pageCount', () => {
      wrapper.setProps({ pageIndex: 20 });
      expect(wrapper.find<Pagination>(Pagination).vm.current).toBe(10);
    });
  });

  describe('misc events', () => {
    it(`emits ${Table.EVENT_ROW_CLICK} when a row is clicked`, () => {
      wrapper.find('.lp-table-body > .lp-table-row').trigger('click');

      expect(wrapper.emitted()[Table.EVENT_ROW_CLICK]).toHaveLength(1);
      expect(wrapper.emitted()[Table.EVENT_ROW_CLICK][0][0]).toMatchObject(items[0]);
    });

    it(`propagates ${Table.EVENT_CURRENT_ITEMS_CHANGE} when visible items are changed`, () => {
      wrapper.setProps({ filter: 'Eclair' });

      expect(wrapper.emitted()[Table.EVENT_CURRENT_ITEMS_CHANGE]).toMatchObject([
        [items.filter((x) => x.name === 'Eclair')]
      ]);
    });
  });

  describe('slots', () => {
    it('renders actions slot', () => {
      expect(wrapper.contains('#actions')).toBe(true);
    });

    it('renders noSearchResults slot when filtering out all items', () => {
      expect(wrapper.contains('#noSearchResults')).toBe(false);

      const [firstColumn, ...rest] = columnDescriptors;
      wrapper.setProps({ columnDescriptors: [{ ...firstColumn, filterable: true }, ...rest], filter: 'NO-MATCH' });

      expect(wrapper.contains('#noSearchResults')).toBe(true);
    });

    it('renders emptyState slot when items are empty', () => {
      expect(wrapper.contains('#emptyState')).toBe(false);

      wrapper.setProps({ items: [] });

      expect(wrapper.contains('#emptyState')).toBe(true);
    });

    it('renders itemMenu scopedSlot on row hover', () => {
      wrapper.find('.lp-table-row').trigger('mouseenter');

      expect(wrapper.contains('#itemMenu')).toBe(true);
      expect(itemMenu).toHaveBeenCalledWith(items[0]);
    });

    it('renders bulkSelectMenu when at least 1 item is selected', () => {
      wrapper.setProps({ selectable: true });

      checkboxCells()[1].trigger('click');

      expect(wrapper.contains('#bulkSelectMenu')).toBe(true);
      expect(bulkSelectMenu).toHaveBeenCalledWith([items[0]]);
    });

    it('calls header renderer', () => {
      const [firstColumn, ...rest] = columnDescriptors;
      const headerRenderer = mockSlot('headerRenderer');
      const firstColumnWithHeaderRenderer = { ...firstColumn, headerRenderer };

      wrapper.setProps({
        columnDescriptors: [firstColumnWithHeaderRenderer, ...rest]
      });

      expect(wrapper.contains('#headerRenderer')).toBe(true);
      expect(headerRenderer).toHaveBeenCalledWith(firstColumnWithHeaderRenderer);
    });

    it('calls item renderer', () => {
      const [firstColumn, ...rest] = columnDescriptors;
      const itemRenderer = mockSlot('itemRenderer');
      const firstColumnWithItemRenderer = { ...firstColumn, itemRenderer };
      const isHovered = false;

      wrapper.setProps({
        columnDescriptors: [firstColumnWithItemRenderer, ...rest]
      });

      expect(wrapper.findAll('#itemRenderer').wrappers).toHaveLength(items.length);

      items.forEach((item, i) => {
        expect(itemRenderer).toHaveBeenNthCalledWith(i + 1, item, firstColumnWithItemRenderer, isHovered);
      });
    });
  });

  describe('styles', () => {
    it('applies highlighted class to column header', () => {
      const [firstColumn, ...rest] = columnDescriptors;

      wrapper.setProps({ columnDescriptors: [{ ...firstColumn, highlight: true }, ...rest] });

      headerCells().forEach((header, i) => {
        expect(header.classes().includes('highlighted')).toBe(i % columnDescriptors.length === 0);
      });
    });

    it('renders loading placeholders in column cells of loading column', () => {
      const [firstColumn, ...rest] = columnDescriptors;

      wrapper.setProps({ columnDescriptors: [{ ...firstColumn, loading: true }, ...rest] });
      wrapper
        .findAll('.lp-table-body .lp-table-cell')
        .wrappers.slice(columnDescriptors.length)
        .forEach((cell, i) => {
          expect(cell.contains(`.lp-table-loading-placeholder`)).toBe(
            /* first column body cells */ i % columnDescriptors.length === 0
          );
        });
    });

    it('passes appropriate align styles', () => {
      const alignments = values(Table.CellAlignment);
      const firstFourColumns = columnDescriptors.slice(0, alignments.length);

      wrapper.setProps({
        columnDescriptors: zipWith(firstFourColumns, alignments, (column, align) => ({ ...column, align }))
      });

      const firstFourCells = wrapper.findAll(`.lp-table-cell`).wrappers.slice(0, alignments.length);

      zipWith(firstFourCells, alignments, (cell, alignment) => {
        expect(cell.classes()).toContain(alignment);
      });
    });

    it('appends correct class when / when not embedded', () => {
      expect(wrapper.classes()).not.toContain('embedded');

      wrapper.setProps({ embedded: true });

      expect(wrapper.classes()).toContain('embedded');
    });

    it('appends rowStyle class to item rows', () => {
      wrapper.setProps({ rowStyle: Table.RowStyle.STRIPED });

      itemRows().forEach((row) => {
        expect(row.classes()).toContain(Table.RowStyle.STRIPED);
      });
    });

    it('applies highlightable class to body when highlightedItemKey is provided', () => {
      wrapper.setProps({ highlightedItemKey: null });

      expect(wrapper.find('.lp-table-body').classes()).toContain('highlightable');
    });

    it('applies highlighted class to matching highlightedItemKey row', () => {
      wrapper.setProps({ highlightedItemKey: items[3].name });

      expect(itemRows()[3].classes()).toContain('highlighted');
    });

    context('horizontally scrollable', () => {
      beforeEach(() => wrapper.setProps({ horizontallyScrollable: true }));

      it('appends x-scrollable class', () => {
        expect(wrapper.find('.lp-table-body').classes()).toContain('x-scrollable');
      });
    });
  });

  describe('column.valueGetter', () => {
    beforeEach(() => {
      const [firstColumn, ...rest] = columnDescriptors;

      wrapper.setProps({
        columnDescriptors: [
          { ...firstColumn, valueGetter: (i: Dessert) => `${i.name} mapped`, sortable: true },
          ...rest
        ]
      });
    });

    it('renders mapped value', () => {
      expect(wrapper.html()).toContain(`${items[0].name} mapped`);
    });

    it('uses mapped value to sort', () => {
      wrapper.setProps({
        sortBy: [{ columnId: columnDescriptors[0].label, direction: Table.SortDirection.DESCENDING }]
      });

      expect(pageItems()).toMatchObject(items.slice().sort((a, b) => b.name.localeCompare(a.name)));
    });

    it('uses mapped value to filter', () => {
      const filter = items[0].name;
      wrapper.setProps({ filter });

      expect(pageItems()).toMatchObject(items.filter((x) => x.name.toLowerCase().includes(filter.toLowerCase())));
    });
  });

  it('renders link rows with computed location when itemLocationGetter is provided', () => {
    const itemLocationGetter: Table.ItemLocationGetter<Dessert> = (dessert) => ({ name: dessert.name });

    wrapper.setProps({ itemLocationGetter });

    expect(wrapper.findAll(RouterLinkStub).wrappers).toHaveLength(items.length);
    wrapper
      .findAll(RouterLinkStub)
      .wrappers.forEach((x, i) => expect(x.props().to).toMatchObject(itemLocationGetter(items[i])));
  });

  function headerCells(): Array<Wrapper<Vue>> {
    return wrapper.findAll('.lp-table-header > .lp-table-cell').wrappers;
  }

  function itemRows(): Array<Wrapper<Vue>> {
    return wrapper.findAll('.lp-table-body > .lp-table-row').wrappers;
  }

  function checkboxCells(): Array<Wrapper<Vue>> {
    return wrapper.findAll('.lp-table-select-cell').wrappers;
  }

  function pageItems(): Array<Dessert> {
    return wrapper.findAll<ItemRow<Dessert>>(ItemRow).wrappers.map((x) => x.vm.item);
  }

  function render(): Wrapper<Table<Dessert, string>> {
    return mount<Table<Dessert, string>>(Table, {
      propsData: {
        items,
        itemKeyGetter,
        itemsPerPage,
        columnDescriptors
      },
      slots: {
        actions: "<div id='actions' />",
        noSearchResults: "<div id='noSearchResults' />",
        emptyState: "<div id='emptyState' />"
      },
      scopedSlots: {
        itemMenu,
        bulkSelectMenu
      },
      stubs: {
        'router-link': RouterLinkStub
      }
    });
  }

  function mockSlot(id: string): jest.Mock<VNode> {
    return jest.fn(() => new Vue().$createElement('div', { attrs: { id } }));
  }
});

type TestTableProps = Table.Props<Dessert, string>;

type TestColumnDescriptor = Table.ColumnDescriptor<Dessert>;

interface Dessert {
  name: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  iron: string;
}
