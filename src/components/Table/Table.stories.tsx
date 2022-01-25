import { action } from '@storybook/addon-actions';
import { array, boolean, number, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { selectKnob } from '../../utils/storybookUtils';
import { Button } from '../Button/Button';
import { Icon } from '../icon/Icon';
import { OverflowableText } from '../OverflowableText/OverflowableText';
import { StargateTarget } from '../Stargate/StargateTarget';
import { TextInput } from '../TextInput/TextInput';
import AsteroidsDataset from './AsteroidsDataset.json';
import { ColumnsEditor } from './ColumnsEditor/ColumnsEditor';
import { Table } from './Table';

interface Dessert {
  name: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  iron: string;
}

const desserts = [
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

const wrapperStyle = {
  paddingRight: '10px'
};

@Component({ name: 'SimpleTableStory' })
class HighlightableTableStory extends Vue {
  private columns: Array<Table.ColumnDescriptor<Dessert>> = [
    { label: 'Desserts', key: 'name', width: 'minmax(300px, auto)' },
    { label: 'Calories', key: 'calories' },
    { label: 'Fat (g)', key: 'fat' },
    { label: 'Carbs (g)', key: 'carbs' },
    { label: 'Protein (g)', key: 'protein' },
    { label: 'Iron (%)', key: 'iron' }
  ];

  private desserts = [...desserts];
  private highlightedItemKey: string = this.desserts[0].name;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          columnDescriptors={this.columns}
          highlightedItemKey={this.highlightedItemKey}
          horizontallyScrollable={true}
          onRowClick={this.onClick}
        />
      </div>
    );
  }

  private onClick(item: Dessert): void {
    this.highlightedItemKey = item.name;
    action('click')(item);
  }
}

@Component({ name: 'SimpleTableStory' })
class SimpleTableStory extends Vue {
  private columns: Array<Table.ColumnDescriptor<Dessert>> = [
    { label: 'Desserts', key: 'name', width: 'auto' },
    { label: 'Calories', key: 'calories' },
    { label: 'Fat (g)', key: 'fat' },
    { label: 'Carbs (g)', key: 'carbs' },
    { label: 'Protein (g)', key: 'protein' },
    { label: 'Iron (%)', key: 'iron' }
  ];

  private desserts = [...desserts];

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          columnDescriptors={this.columns}
          onRowClick={action('click')}
        />
      </div>
    );
  }
}

@Component({ name: 'StrippedTableStory' })
class StrippedTableStory extends Vue {
  private columns: Array<Table.ColumnDescriptor<Dessert>> = [
    { label: 'Desserts', key: 'name', width: 'auto' },
    { label: 'Calories', key: 'calories' },
    { label: 'Fat (g)', key: 'fat' },
    { label: 'Carbs (g)', key: 'carbs' },
    { label: 'Protein (g)', key: 'protein' },
    { label: 'Iron (%)', key: 'iron' }
  ];

  private desserts = [...desserts];

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Table
          itemKeyGetter={itemKeyGetter}
          rowStyle={Table.RowStyle.STRIPED}
          items={this.desserts}
          columnDescriptors={this.columns}
          onRowClick={action('click')}
        />
      </div>
    );
  }
}

@Component({ name: 'ScrollableTableStory' })
class ScrollableTableStory extends Vue {
  private get columns(): Array<Table.ColumnDescriptor<typeof AsteroidsDataset[0]>> {
    return [
      { label: 'Name', itemRenderer: this.renderFirstColumn, width: `auto` },
      { key: 'id', label: 'id', width: '80px' },
      { key: 'nametype', label: 'nametype', width: '80px' },
      { key: 'recclass', label: 'recclass', width: '80px' },
      { key: 'mass', label: 'mass', width: '80px' },
      { key: 'fall', label: 'fall', width: '80px' },
      { key: 'year', label: 'year', width: '180px' },
      { key: 'reclat', label: 'reclat', width: '80px' },
      { key: 'reclong', label: 'reclong', width: '80px' }
    ];
  }

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Table
          itemKeyGetter={itemKeyGetter}
          itemsPerPage={20}
          items={AsteroidsDataset}
          columnDescriptors={this.columns}
          horizontallyScrollable={true}
          style={{ height: '800px' }}
          onRowClick={action('click')}
        />
      </div>
    );
  }

  renderFirstColumn(item: typeof AsteroidsDataset[0]): VNode {
    return <OverflowableText text={`${item.name} ${item.geolocation.coordinates}`} />;
  }
}

@Component({ name: 'SelectableScrollableTableStory' })
class SelectableScrollableTableStory extends Vue {
  private get columns(): Array<Table.ColumnDescriptor<typeof AsteroidsDataset[0]>> {
    return [
      { label: 'Name', itemRenderer: this.renderFirstColumn, width: `minmax(200px, auto)` },
      { key: 'id', label: 'id', width: '80px' },
      { key: 'nametype', label: 'nametype', width: '80px' },
      { key: 'recclass', label: 'recclass', width: '80px' },
      { key: 'mass', label: 'mass', width: '80px' },
      { key: 'fall', label: 'fall', width: '80px' },
      { key: 'year', label: 'year', width: '180px' },
      { key: 'reclat', label: 'reclat', width: '80px' },
      { key: 'reclong', label: 'reclong', width: '80px' }
    ];
  }

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Table
          itemKeyGetter={itemKeyGetter}
          selectable={true}
          itemsPerPage={20}
          items={AsteroidsDataset}
          columnDescriptors={this.columns}
          horizontallyScrollable={true}
          style={{ height: '800px' }}
          onRowClick={action('click')}
        />
      </div>
    );
  }

  renderFirstColumn(item: typeof AsteroidsDataset[0]): VNode {
    return <OverflowableText text={`${item.name} ${item.geolocation.coordinates}`} />;
  }
}

@Component({ name: 'TableLoadingStory' })
class TableLoadingStory extends Vue {
  private columns: Array<Table.ColumnDescriptor<Dessert>> = [
    { label: 'Desserts', key: 'name', width: 'auto' },
    { label: 'Calories', key: 'calories' },
    { label: 'Fat (g)', key: 'fat' },
    { label: 'Carbs (g)', key: 'carbs' },
    { label: 'Protein (g)', key: 'protein' },
    { label: 'Iron (%)', key: 'iron' }
  ];

  private desserts = [...desserts];
  private loading = true;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Button
          text="Toggle Loading"
          onClick={() => {
            this.loading = !this.loading;
          }}
        />
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          columnDescriptors={this.columns}
          loading={this.loading}
          onRowClick={action('click')}
        />
      </div>
    );
  }
}

@Component({ name: 'TableLoadingColumnStory' })
class TableLoadingColumnStory extends Vue {
  private get columns(): Array<Table.ColumnDescriptor<Dessert>> {
    return [
      { label: 'Desserts', key: 'name', width: 'auto' },
      { label: 'Calories', key: 'calories', loading: this.loading },
      { label: 'Fat (g)', key: 'fat', loading: this.loading },
      { label: 'Carbs (g)', key: 'carbs', loading: this.loading },
      { label: 'Protein (g)', key: 'protein', loading: this.loading },
      { label: 'Iron (%)', key: 'iron', loading: this.loading }
    ];
  }

  private desserts = [...desserts];
  private loading = true;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Button
          text="Toggle Loading"
          onClick={() => {
            this.loading = !this.loading;
          }}
        />
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          columnDescriptors={this.columns}
          onRowClick={action('click')}
        />
      </div>
    );
  }
}

@Component({ name: 'TableWithSelectStory' })
class TableWithSelectStory extends Vue {
  private columns: Array<Table.ColumnDescriptor<Dessert>> = [
    { label: 'Name', key: 'name', width: 'auto' },
    { label: 'Calories', key: 'calories' },
    { label: 'Fat (g)', key: 'fat' },
    { label: 'Carbs (g)', key: 'carbs' },
    { label: 'Protein (g)', key: 'protein' },
    { label: 'Iron (%)', key: 'iron' }
  ];

  private desserts = [...desserts];
  private selected: Array<Dessert> = [];
  private loading = false;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Button
          text="Toggle Loading"
          onClick={() => {
            this.loading = !this.loading;
          }}
        />
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          selected={this.selected}
          columnDescriptors={this.columns}
          loading={this.loading}
          selectable={true}
          itemsPerPage={4}
          onSelectionChange={this.onSelectionChange}
          onRowClick={action('click')}
        />
      </div>
    );
  }

  private onSelectionChange(newSelection: Array<Dessert>): void {
    this.selected = newSelection;
  }
}

@Component({ name: 'TableWithPaginationStory' })
class TableWithPaginationStory extends Vue {
  private columns: Array<Table.ColumnDescriptor<Dessert>> = [
    { label: 'Desserts', key: 'name', width: 'auto' },
    { label: 'Calories', key: 'calories' },
    { label: 'Fat (g)', key: 'fat' },
    { label: 'Carbs (g)', key: 'carbs' },
    { label: 'Protein (g)', key: 'protein' },
    { label: 'Iron (%)', key: 'iron' }
  ];

  private desserts = Array(40)
    .fill(null)
    .flatMap((x, i) => desserts.map((x) => ({ ...x, name: `${x.name} ${i + 1}` })));

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Table itemKeyGetter={itemKeyGetter} items={this.desserts} columnDescriptors={this.columns} itemsPerPage={10} />
      </div>
    );
  }
}

@Component({ name: 'DefaultFilteringStory' })
class DefaultFilteringStory extends Vue {
  private columns: Array<Table.ColumnDescriptor<Dessert>> = [
    { label: 'Desserts', key: 'name', width: 'auto', filterable: true },
    { label: 'Calories', key: 'calories', filterable: true },
    { label: 'Fat (g)', key: 'fat', filterable: true },
    { label: 'Carbs (g)', key: 'carbs', filterable: true },
    { label: 'Protein (g)', key: 'protein', filterable: true },
    { label: 'Iron (%)', key: 'iron', filterable: true }
  ];

  private desserts = [...desserts];
  private search = '';

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <TextInput v-model={this.search} placeholder="Filter all columns" />
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          columnDescriptors={this.columns}
          filter={this.search}
          onRowClick={action('click')}
        />
      </div>
    );
  }
}

@Component({ name: 'CustomFilteringStory' })
class CustomFilteringStory extends Vue {
  private columns: Array<Table.ColumnDescriptor<Dessert, { hasCaloriesBelow: number }>> = [
    { label: 'Desserts', key: 'name', width: 'auto' },
    {
      label: 'Calories',
      key: 'calories',
      filterable: true,
      filter: (item, { hasCaloriesBelow }) => item.calories < hasCaloriesBelow
    },
    { label: 'Fat (g)', key: 'fat' },
    { label: 'Carbs (g)', key: 'carbs' },
    { label: 'Protein (g)', key: 'protein' },
    { label: 'Iron (%)', key: 'iron' }
  ];

  private desserts = [...desserts];
  private filter = { hasCaloriesBelow: 250 };

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <div>Has calories below</div>
        <TextInput
          value={String(this.filter.hasCaloriesBelow)}
          onInput={(value: string) => (this.filter.hasCaloriesBelow = Number(value))}
        />
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          columnDescriptors={this.columns}
          filter={this.filter}
          onRowClick={action('click')}
        />
      </div>
    );
  }
}

@Component({ name: 'DefaultSortingStory' })
class DefaultSortingStory extends Vue {
  private columns: Array<Table.ColumnDescriptor<Dessert>> = [
    {
      label: 'Desserts',
      key: 'name',
      width: 'auto',
      sortable: true
    },
    {
      label: 'Calories',
      key: 'calories',
      sortable: true
    },
    {
      label: 'Fat (g)',
      key: 'fat',
      sortable: true
    },
    {
      label: 'Carbs (g)',
      key: 'carbs',
      sortable: true,
      align: Table.CellAlignment.CENTER
    },
    {
      label: 'Protein (g)',
      key: 'protein',
      sortable: true,
      align: Table.CellAlignment.END
    },
    {
      label: 'Iron (%)',
      key: 'iron',
      sortable: true,
      align: Table.CellAlignment.END
    }
  ];

  private desserts = [...desserts];

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          columnDescriptors={this.columns}
          onRowClick={action('click')}
        />
      </div>
    );
  }
}

@Component({ name: 'CustomSortingStory' })
class CustomSortingStory extends Vue {
  private columns: Array<Table.ColumnDescriptor<Dessert>> = [
    { label: 'Desserts', key: 'name', width: 'auto' },
    {
      label: 'Calories',
      key: 'calories',
      sortable: true,
      comparator: ({ calories: a }, { calories: b }) => ((a - b) % 2 === 0 ? a - b : a % 2 || -1)
    },
    { label: 'Fat (g)', key: 'fat' },
    { label: 'Carbs (g)', key: 'carbs' },
    { label: 'Protein (g)', key: 'protein' },
    { label: 'Iron (%)', key: 'iron' }
  ];

  private desserts = [...desserts];

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        Sorted by calories ascending, even first
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          columnDescriptors={this.columns}
          onRowClick={action('click')}
        />
      </div>
    );
  }
}

@Component({ name: 'ItemSlotTableStory' })
class ItemRendererSlotTableStory extends Vue {
  // Item slot renderers need to be a class method because of vue jsx babel plugin
  private columns: Array<Table.ColumnDescriptor<Dessert>> = [
    { label: 'Desserts', key: 'name', width: 'auto', itemRenderer: this.renderName },
    // You can omit key if you provide a renderer
    { label: 'Calories', itemRenderer: this.renderCalories },
    { label: 'Fat (g)', key: 'fat' },
    { label: 'Carbs (g)', key: 'carbs' },
    { label: 'Protein (g)', key: 'protein' },
    { label: 'Iron (%)', key: 'iron' }
  ];

  private desserts = [...desserts];

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          columnDescriptors={this.columns}
          onRowClick={action('click')}
        />
      </div>
    );
  }

  renderName(item: Dessert): VNode {
    return <TextInput value={item.name} />;
  }

  renderCalories(item: Dessert): VNode {
    return <h5>{item.calories}</h5>;
  }
}

@Component({ name: 'HeaderRendererTableStory' })
class HeaderRendererSlotTableStory extends Vue {
  private columns: Array<Table.ColumnDescriptor<Dessert> & { icon?: string }> = [
    // You can omit label if you provide headerRenderer
    { headerRenderer: this.renderNameHeader, key: 'name', width: 'auto', icon: Icon.Type.DEVICE_APPLE },
    { label: 'Calories', key: 'calories' },
    { label: 'Fat (g)', key: 'fat' },
    { label: 'Carbs (g)', key: 'carbs' },
    { label: 'Protein (g)', key: 'protein' },
    { label: 'Iron (%)', key: 'iron' }
  ];

  private desserts = [...desserts];

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          columnDescriptors={this.columns}
          onRowClick={action('click')}
        />
      </div>
    );
  }

  renderNameHeader(column: Table.ColumnDescriptor<Dessert> & { icon: string }): VNode {
    return <Icon type={column.icon} size={30} />;
  }
}

@Component({ name: 'ItemMenuSlot' })
class ItemMenuSlot extends Vue {
  private columns: Array<Table.ColumnDescriptor<Dessert>> = [
    { label: 'Desserts', key: 'name', width: 'auto' },
    { label: 'Calories', key: 'calories' },
    { label: 'Fat (g)', key: 'fat' },
    { label: 'Carbs (g)', key: 'carbs' },
    { label: 'Protein (g)', key: 'protein' },
    { label: 'Iron (%)', key: 'iron', align: Table.CellAlignment.END }
  ];

  private desserts = [...desserts];

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        Hover over rows to see menu
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          columnDescriptors={this.columns}
          onRowClick={action('click')}
          scopedSlots={{
            itemMenu: (item: Dessert) => <Button color="danger" text={`Delete ${item.name}`} />
          }}
        />
      </div>
    );
  }
}

@Component({ name: 'HeaderSlotTableStory' })
class HeaderSlotTableStory extends Vue {
  private columns: Array<Table.ColumnDescriptor<Dessert>> = [
    { label: 'Desserts', key: 'name', width: 'auto' },
    { label: 'Calories', key: 'calories' },
    { label: 'Fat (g)', key: 'fat' },
    { label: 'Carbs (g)', key: 'carbs' },
    { label: 'Protein (g)', key: 'protein' },
    { label: 'Iron (%)', key: 'iron' }
  ];

  private desserts = [...desserts];

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          columnDescriptors={this.columns}
          onRowClick={action('click')}
        >
          <div slot={Table.SLOT_ACTIONS} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p>Desserts table</p>
            <Button text="Action" />
          </div>
        </Table>
      </div>
    );
  }
}

@Component({ name: 'EmptyStateSlotTableStory' })
class EmptyStateSlotTableStory extends Vue {
  private columns: Array<Table.ColumnDescriptor<Dessert>> = [
    { label: 'Desserts', key: 'name', width: 'auto' },
    { label: 'Calories', key: 'calories' },
    { label: 'Fat (g)', key: 'fat' },
    { label: 'Carbs (g)', key: 'carbs' },
    { label: 'Protein (g)', key: 'protein' },
    { label: 'Iron (%)', key: 'iron' }
  ];

  private desserts: Array<Dessert> = [];

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          columnDescriptors={this.columns}
          onRowClick={action('click')}
        >
          <div slot="emptyState" style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0' }}>
            You don't have any deserts <Button text="Create one" />
          </div>
        </Table>
      </div>
    );
  }
}

@Component({ name: 'NoResultSlotTableStory' })
class NoSearchResultsSlotTableStory extends Vue {
  private columns: Array<Table.ColumnDescriptor<Dessert>> = [
    { label: 'Desserts', key: 'name', width: 'auto', filterable: true },
    { label: 'Calories', key: 'calories' },
    { label: 'Fat (g)', key: 'fat' },
    { label: 'Carbs (g)', key: 'carbs' },
    { label: 'Protein (g)', key: 'protein' },
    { label: 'Iron (%)', key: 'iron' }
  ];

  private desserts = [...desserts];

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Table
          itemKeyGetter={itemKeyGetter}
          filter="android sucks"
          items={this.desserts}
          columnDescriptors={this.columns}
          onRowClick={action('click')}
        >
          <div slot="noSearchResults">Oops, no results found for "good desert"</div>
        </Table>
      </div>
    );
  }
}

@Component({ name: 'EditColumnTableStory' })
class EditColumnTableStory extends Vue {
  static readonly DEFAULT_COLUMN_ORDER_DESCRIPTORS: Array<ColumnsEditor.ColumnOrderDescriptor> = [
    { label: 'Desserts', locked: true },
    { label: 'Calories' },
    { label: 'Fat (g)' },
    { label: 'Carbs (g)' },
    { label: 'Protein (g)' },
    { label: 'Iron (%)' }
  ];

  private columns: Array<Table.ColumnDescriptor<Dessert> & { label: string }> = [
    { label: 'Desserts', key: 'name', width: 'auto' },
    { label: 'Calories', key: 'calories' },
    { label: 'Fat (g)', key: 'fat' },
    { label: 'Carbs (g)', key: 'carbs' },
    { label: 'Protein (g)', key: 'protein' },
    { label: 'Iron (%)', key: 'iron' }
  ];

  private desserts = [...desserts];
  private columnOrderDescriptors: Array<ColumnsEditor.ColumnOrderDescriptor> =
    EditColumnTableStory.DEFAULT_COLUMN_ORDER_DESCRIPTORS;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          columnDescriptors={ColumnsEditor.orderColumns(this.columnOrderDescriptors, this.columns)}
          onRowClick={action('click')}
        >
          <ColumnsEditor
            slot="actions"
            storageKey="edit-column-story-columns-order"
            columnOrderDescriptors={this.columnOrderDescriptors}
            defaultColumnOrderDescriptors={EditColumnTableStory.DEFAULT_COLUMN_ORDER_DESCRIPTORS}
            onChange={this.onColumnOrdersChange}
          />
        </Table>
        <StargateTarget />
      </div>
    );
  }

  private onColumnOrdersChange(value: Array<ColumnsEditor.ColumnOrderDescriptor>): void {
    this.columnOrderDescriptors = value;
  }
}

@Component({ name: 'KnobTableStory' })
class KnobTableStory extends Vue {
  @Prop({ default: () => boolean('embedded', false) })
  readonly embedded: boolean;

  @Prop({
    default: () => selectKnob('align (can be applied per column)', Table.CellAlignment, Table.CellAlignment.START)
  })
  readonly align: Table.CellAlignment;

  @Prop({ default: () => boolean('loading', false) })
  readonly loading: boolean;

  @Prop({ default: () => boolean('selectable', true) })
  readonly selectable: boolean;

  @Prop({ default: () => number('items per page', 10) })
  readonly itemsPerPage: number;

  @Prop({ default: () => number('amount of items', 400) })
  readonly itemAmount: number;

  @Prop({
    default: () => number('server side items (if > 0 turns off client side state pagination, filter & sort)', -1)
  })
  readonly totalItems: number;

  @Prop({
    default: () =>
      array('names of visible columns', ['Desserts', 'Calories', 'Fat (g)', 'Carbs (g)', 'Protein (g)', 'Iron (%)'])
  })
  readonly visible: Array<string>;

  @Prop({ default: () => text('filter term', '') })
  readonly filter: string;

  @Prop({ default: () => text('max height that applies scrolling', null) })
  readonly scrollMaxHeight: string;

  @Prop({ default: () => selectKnob('row style', Table.RowStyle, Table.RowStyle.BORDERED) })
  readonly rowStyle: string;

  private get columns(): Array<Table.ColumnDescriptor<Dessert>> {
    const columns: Array<Table.ColumnDescriptor<Dessert>> = [
      { filterable: true, align: this.align, label: 'Desserts', key: 'name', width: 'auto' },
      { filterable: true, align: this.align, label: 'Calories', key: 'calories' },
      { filterable: true, align: this.align, label: 'Fat (g)', key: 'fat' },
      { filterable: true, align: this.align, label: 'Carbs (g)', key: 'carbs' },
      { filterable: true, align: this.align, label: 'Protein (g)', key: 'protein' },
      { filterable: true, align: this.align, label: 'Iron (%)', key: 'iron' }
    ];

    return columns.filter((x) => this.visible.find((y) => 'label' in x && x.label === y));
  }

  private get desserts(): Array<Dessert> {
    return Array(Math.ceil(this.itemAmount / 10))
      .fill(null)
      .flatMap((x, i) => desserts.map((x) => ({ ...x, name: `${x.name} ${i + 1}` })))
      .slice(0, this.itemAmount);
  }

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={wrapperStyle}>
        <Table
          itemKeyGetter={itemKeyGetter}
          items={this.desserts}
          scrollMaxHeight={this.scrollMaxHeight}
          rowStyle={this.rowStyle}
          columnDescriptors={this.columns}
          embedded={this.embedded}
          loading={this.loading}
          selectable={this.selectable}
          itemsPerPage={this.itemsPerPage}
          totalItems={this.totalItems}
          filter={this.filter}
          onRowClick={action('click')}
          onSelectionChange={action('selectionChange')}
        />
      </div>
    );
  }
}

function itemKeyGetter(item: Dessert): string {
  return item.name;
}

storiesOf('Table', module)
  .add('Simple', () => SimpleTableStory)
  .add('Stripped Table Story', () => StrippedTableStory)
  .add('Scrollable Table Story', () => ScrollableTableStory)
  .add('Selectable Scrollable Table Story', () => SelectableScrollableTableStory)
  .add('Highlightable Table story', () => HighlightableTableStory)
  .add('Loading', () => TableLoadingStory)
  .add('Table Loading Column Story', () => TableLoadingColumnStory)
  .add('Select', () => TableWithSelectStory)
  .add('Pagination', () => TableWithPaginationStory)
  .add('Default Filtering', () => DefaultFilteringStory)
  .add('Custom Filtering', () => CustomFilteringStory)
  .add('Default Sorting', () => DefaultSortingStory)
  .add('Custom Sorting', () => CustomSortingStory)
  .add('Item Slot', () => ItemRendererSlotTableStory)
  .add('Header Slots', () => HeaderRendererSlotTableStory)
  .add('ItemMenu Slot', () => ItemMenuSlot)
  .add('Header Slot', () => HeaderSlotTableStory)
  .add('Empty State Slot', () => EmptyStateSlotTableStory)
  .add('No Results Slot', () => NoSearchResultsSlotTableStory)
  .add('Edit Columns Table Story', () => EditColumnTableStory)
  .addDecorator(withKnobs)
  .add('Knob Story', () => KnobTableStory);
