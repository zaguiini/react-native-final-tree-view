import get from 'lodash.get'
import PropTypes from 'prop-types'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

function noop() {}

class TreeView extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    renderNode: PropTypes.func.isRequired,
    initialExpanded: PropTypes.bool,
    getCollapsedNodeHeight: PropTypes.func,
    idKey: PropTypes.string,
    activeOpacityNode: PropTypes.number,
    childrenKey: PropTypes.string,
    onNodePress: PropTypes.func,
    onNodeLongPress: PropTypes.func,
    isNodeExpanded: PropTypes.func,
    shouldDisableTouchOnLeaf: PropTypes.func
  }

  static defaultProps = {
    initialExpanded: false,
    getCollapsedNodeHeight: () => 20,
    idKey: 'id',
    childrenKey: 'children',
    activeOpacityNode: .1,
    onNodePress: noop,
    onNodeLongPress: noop,
    isNodeExpanded: noop,
    shouldDisableTouchOnLeaf: () => false
  }

  constructor(props) {
    super(props)

    this.state = this.getInitialState()
  }

  getInitialState = () => ({
    expandedNodeKeys: {},
  })

  componentDidUpdate(prevProps) {
    const hasDataUpdated = prevProps.data !== this.props.data
    const hasIdKeyUpdated = prevProps.idKey !== this.props.idKey
    const childrenKeyUpdated = prevProps.childrenKey !== this.props.childrenKey

    if (hasDataUpdated || hasIdKeyUpdated || childrenKeyUpdated) {
      this.setState(this.getInitialState())
    }
  }

  hasChildrenNodes = (node) =>
    get(node, `${this.props.childrenKey}.length`, 0) > 0

  isExpanded = (id) => {
    if (this.props.isNodeExpanded !== noop) {
      return this.props.isNodeExpanded(id)
    } else {
      return get(this.state.expandedNodeKeys, id, this.props.initialExpanded)
    }
  }

  updateNodeKeyById = (id, expanded) => ({ expandedNodeKeys }) => ({
    expandedNodeKeys: Object.assign({}, expandedNodeKeys, {
      [id]: expanded,
    }),
  })

  collapseNode = (id) => this.setState(this.updateNodeKeyById(id, false))

  expandNode = (id) => this.setState(this.updateNodeKeyById(id, true))

  toggleCollapse = (id) => {
    const method = this.isExpanded(id) ? 'collapseNode' : 'expandNode'

    this[method](id)
  }

  handleNodePressed = async ({ node, level }) => {
    const nodePressResult = await this.props.onNodePress({ node, level })

    if (nodePressResult !== false && this.hasChildrenNodes(node)) {
      this.toggleCollapse(node[this.props.idKey])
    }
  }

  Node = ({ nodes, level }) => {
    const NodeComponent = this.Node

    return nodes.map((node) => {
      const isExpanded = this.isExpanded(node[this.props.idKey])
      const hasChildrenNodes = this.hasChildrenNodes(node)
      const shouldRenderLevel = hasChildrenNodes && isExpanded

      return (
        <View
          key={node[this.props.idKey]}
          style={{
            height: isExpanded
              ? 'auto'
              : this.props.getCollapsedNodeHeight({
                  [this.props.idKey]: node[this.props.idKey],
                  level,
                }),
            zIndex: 1,
            overflow: 'hidden',
          }}
        >
          <TouchableOpacity
            activeOpacity={this.props.activeOpacityNode}
            disabled={this.props.shouldDisableTouchOnLeaf({ node, level })}
            onPress={() => this.handleNodePressed({ node, level })}
            onLongPress={() => this.props.onNodeLongPress({ node, level })}
          >
            {React.createElement(this.props.renderNode, {
              node,
              level,
              isExpanded,
              hasChildrenNodes,
            })}
          </TouchableOpacity>
          {shouldRenderLevel && (
            <NodeComponent
              nodes={node[this.props.childrenKey]}
              level={level + 1}
            />
          )}
        </View>
      )
    })
  }

  render() {
    return <this.Node nodes={this.props.data} level={0} />
  }
}

export default TreeView
