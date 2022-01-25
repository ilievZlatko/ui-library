import { VNode } from 'vue';

export type Filterable = string | number | boolean;

export type Comparable = Filterable | null | undefined;

export type Renderable = Comparable | VNode | Array<Renderable>;

export type ItemPredicate<Item> = (item: Item) => boolean;

export type ItemComparator<Item> = (a: Item, b: Item) => number;

export type ItemValueGetter<Item> = (a: Item) => Comparable;
