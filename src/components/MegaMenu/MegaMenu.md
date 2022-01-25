# Mega Menu

Renders a Mega Menu inline.

## How it works

A Mega Menu is composed of multiple columns. Each column can have multiple groups of items.
Each group can have a title, and a number of items.

An item is described by the following interface:

```typescript
interface Item {
  key: string;
  label: string;
  tooltip?: string;
  hidden?: boolean;
  disabled?: boolean;
}
```

### Search

Searching is done simultaneously in all columns and groups. If a group has no items, it's not rendered. If a column has
no groups, it's not rendered either.

## Usage

```jsx
 <MegaMenu
  config={this.config}
  showSearch={this.showSearch}
  searchPlaceholder={this.searchPlaceholder}
  onSelect={this.onSelect}
/>
```

Requires a valid `config` object. Everything else is optional.

### Width and height

The Mega Menu itself has dynamic width and height - it resizes based on the number of items inside it. This can be
a problem when searching and reactively changing the number of items - the menu will resize itself.

**The parent is expected to set `width` and `height` for each specific implementation of a Mega Menu.**

### Guidelines

The Mega Menu is supposed to be included in a Modal or some other Popper-like component. Feel free to use inline if
the design requires it.
