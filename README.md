# react-native-tree-view
A React Native Tree View component!

## Installation
`yarn add react-native-final-tree-view`
or
`npm install react-native-final-tree-view --save`

## Usage
Firstly, you have to define your data. Example:
```js
const family = [
  {
    id: 'Grandparent',
    name: 'Grandpa',
    age: 78,
    children: [
      {
        id: 'Me',
        name: 'Me',
        age: 30,
        children: [
          {
            id: 'Erick',
            name: 'Erick',
            age: 10,
          },
          {
            id: 'Rose',
            name: 'Rose',
            age: 12,
          },
        ],
      },
    ],
  },
]
```

It is required that each node on the tree have its own `id` key. Obviously, it should be **unique**.
The tree nodes are defined in the `children` key. They are an array of objects, following the same structure as the parent.

After defining your data, mount the component:
```js
import React from 'react'
import { Text, View } from 'react-native'

import TreeView from '@zaguini/react-native-tree-view'

class App extends React.PureComponent {
  state = {
    data: [
      {
        id: 'Grandparent',
        name: 'Grandpa',
        age: 78,
        children: [
          {
            id: 'Me',
            name: 'Me',
            age: 30,
            children: [
              {
                id: 'Erick',
                name: 'Erick',
                age: 10,
              },
              {
                id: 'Rose',
                name: 'Rose',
                age: 12,
              },
            ],
          },
        ],
      },
    ],
  }

  componentDidMount() {
    console.log(this.treeView.getRawData())
  }

  render() {
    return (
      <TreeView
        ref={ref => this.treeView = ref}
        data={this.state.data}
        deleteOnLongPress
        renderItem={(item, level) => (
          <View>
            <Text
              style={{
                marginLeft: 25 * level,
              }}
            >
              {
                item.collapsed !== null ?
                <Text>{item.collapsed ? ' > ' : ' \\/ '}</Text> :
                <Text> - </Text>
              }
              {item.name}
            </Text>
          </View>
        )}
      />
    )
  }
}

export default App
```

This should display:

![First render](https://i.imgur.com/LWDr9Ba.png)

And, after a few touches:

![All expanded](https://i.imgur.com/lEWGnIW.png)

## Props

### `data`
Required. The tree data to render;

### `collapsedItemHeight`
Optional. The collapsed item height. Defaults to `20`;

### `idKey`
Optional. The `id` key to refer to. Defaults to `id`;

### `childrenKey`
Optional. The `children` key to look for. Defaults to `children`;

### `onItemPress`
Optional. A callback fired when a node is pressed. The pressed node is sent as the only argument;

### `onItemLongPress`
Optional. A callback fired when a node is long pressed. The pressed node is sent as the only argument;

### `deleteOnLongPress`
Optional. Deletes the pressed node when long pressed;

### `renderItem`
**Required**. A function that must return the JSX to render the item. The arguments passed are the `child` and
the current `level` in the tree, starting from `0`.
You get, for free, a `collapsed` key, which could have the possible values:
- `null` when there are no children for this node;
- `true` when the node is collapsed;
- `false` when the node is expanded.

Example:

```js
renderItem={(item, level) => (
  <View>
    <Text
      style={{
        marginLeft: 25 * level,
      }}
    >
      {
        item.collapsed !== null ?
        <Text>{item.collapsed ? ' > ' : ' \\/ '}</Text> :
        <Text> - </Text>
      }
      {item.name}
    </Text>
  </View>
)}
```

## Methods

### `getRawData`
Gets the raw, updated, tree data.

## FAQ

### If I modify the `data` prop, do the tree reflects the changes?

Yes, it does. Feel free to modify that awesome state and see the modifications :)

------

License: MIT
