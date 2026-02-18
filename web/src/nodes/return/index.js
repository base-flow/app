const returnLabelRender = (item, parent) => {
  if (!parent) {
    return {
      name: "Return"
    };
  }
};
const Component = ({
  nodeData
}) => {
  const {
    graph
  } = Baseflow.useGraph();
  const {
    node
  } = Baseflow.useNode(nodeData.id);
  const returnSchema = graph.getReturnSchema();
  const returnValue = nodeData.meta.valueReference?.value;
  const onReturnChange = Baseflow.useEvent(value => {
    node.updateMeta({
      valueReference: {
        path: "flow",
        value
      }
    });
  });
  const onConfirmed = Baseflow.useEvent(() => {
    node.updateErrors(undefined, "configurationErrors");
    if (!returnSchema && returnValue) {
      node.updateMeta({
        valueReference: {
          path: "flow",
          value: undefined
        }
      });
    }
  });
  return /*#__PURE__*/React.createElement("div", null, nodeData.meta.configurationErrors === Baseflow.FlowErrors.returnSchemaChanged && /*#__PURE__*/React.createElement(antd.Alert, {
    title: Baseflow.BaseLang.returnSchemaChanged,
    type: "warning",
    showIcon: true,
    style: {
      marginBottom: "20px"
    },
    action: /*#__PURE__*/React.createElement(antd.Button, {
      size: "small",
      type: "primary",
      onClick: onConfirmed
    }, "\u786E\u8BA4")
  }), (returnSchema || returnValue) && /*#__PURE__*/React.createElement("div", {
    className: "nd-form-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label-item require"
  }, "\u8BBE\u7F6E\u8FD4\u56DE\u53C2\u6570"), /*#__PURE__*/React.createElement("div", {
    className: "input-item"
  }, /*#__PURE__*/React.createElement(Baseflow.SchemaValueForm, {
    variant: "filled",
    labelRender: returnLabelRender,
    schema: returnSchema,
    value: returnValue,
    onChange: onReturnChange
  })))));
};
var NodeInputPanel = /*#__PURE__*/React.memo(Component);

var version = "0.0.1";
var baseflow = {
	type: "Return",
	name: "流程返回",
	icon: "",
	desc: "流程返回：流程提前终止执行并返回，可以设置返回数据"
};
var executor = {
	node: "@baseflow-executors/return@0.0.1"
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
  type: Baseflow.NodeType.Return,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
  NodeInputPanel,
  executor: PKG.executor,
  defaultData() {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"] || META.name,
        ...NodeSize,
        valueReference: {
          path: "flow"
        }
      },
      props: {}
    };
  },
  validate({
    nodeData
  }) {
    if (nodeData.meta.configurationErrors === Baseflow.FlowErrors.returnSchemaChanged) {
      return Baseflow.FlowErrors.returnSchemaChanged;
    }
  }
};

export { config as default };
