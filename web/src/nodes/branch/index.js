const Component = ({
  nodeData
}) => {
  const nodeProps = nodeData.props;
  const {
    node
  } = Baseflow.useNode(nodeData.id);
  const onConditionsChange = Baseflow.useEvent(conditions => {
    node.updateProps({
      conditions
    });
  });
  return /*#__PURE__*/React.createElement("div", null, nodeProps.default ? /*#__PURE__*/React.createElement(antd.Typography.Text, {
    type: "secondary"
  }, "\u5176\u5B83\u6761\u4EF6\u9ED8\u8BA4\u5206\u652F") : /*#__PURE__*/React.createElement(Baseflow.ConditionSelector, {
    value: nodeProps.conditions,
    onChange: onConditionsChange
  }));
};
var NodeInputPanel = /*#__PURE__*/React.memo(Component);

var version = "0.0.2";
var baseflow = {
	type: "Branch",
	icon: "",
	name: "条件分支",
	desc: "条件分支：放置于[条件选择]中，通过设置执行条件来决定是否执行"
};
var executor = {
	node: "@baseflow-executors/branch@0.0.1"
};
var PKG = {
	version: version,
	baseflow: baseflow,
	executor: executor};

const META = PKG.baseflow;
const NodeSize = Baseflow.getNodeDefaultSize();
const locale = Baseflow.getLocale();
const config = {
  version: PKG.version,
  type: Baseflow.NodeType.Branch,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
  executor: PKG.executor,
  NodeInputPanel,
  defaultData({
    props
  }) {
    return {
      meta: {
        name: (META[locale ? `${locale}_name` : "name"] || META.name) + (props?.default ? " (Else)" : ""),
        ...NodeSize
      },
      props: {}
    };
  },
  validate({
    nodeData
  }) {
    const props = nodeData.props;
    if (props.default) {
      return;
    }
    if (!props.conditions) {
      return "条件不能为空";
    }
    if (typeof props.conditions !== "string") {
      for (const groups of props.conditions.groups) {
        for (const item of groups.items) {
          if (!item.source.text || !item.target.text || !item.operator) {
            return "请输入";
          }
        }
      }
    }
  }
};

export { config as default };
