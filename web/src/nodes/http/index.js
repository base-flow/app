const inputSchema = {
  name: "request",
  label: "Request",
  type: "ͼOBJECTͼ",
  children: [{
    name: "url",
    type: "ͼSTRINGͼ"
  }, {
    name: "method",
    type: "ͼSTRINGͼ"
  }, {
    name: "https",
    type: Baseflow.DataType.Bool
  }, {
    name: "data",
    type: Baseflow.DataType.Date
  }]
};
const Component = ({
  nodeData
}) => {
  const {
    node
  } = Baseflow.useNode(nodeData.id);
  const onInputChange = Baseflow.useEvent(input => {
    node.updateProps({
      input
    });
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Baseflow.SchemaValueForm, {
    schema: inputSchema,
    value: nodeData.props.input,
    onChange: onInputChange
  }));
};
var NodeInputPanel = /*#__PURE__*/React.memo(Component);

var version = "0.0.1";
var baseflow = {
	type: "Task",
	name: "HTTP请求",
	icon: "",
	desc: "HTTP请求：通过置请求参数发送HTTP请求，并输出响应数据"
};
var executor = {
	node: "@baseflow-executors/http@0.0.1"
};
var PKG = {
	version: version,
	baseflow: baseflow,
	executor: executor};

var UserManual = `M|abc
- 发送HTTP请求目前仅支持Get Post
- 参数请使用JSON格式
`;

const META = PKG.baseflow;
const NodeSize = Baseflow.getNodeDefaultSize();
const locale = Baseflow.getLocale();
const config = {
  version: PKG.version,
  type: Baseflow.NodeType.Task,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
  NodeInputPanel,
  NodeOutputPanel: {
    editable: true,
    toolsFilter: (item, parent) => {
      if (!parent) {
        return {
          addNext: false,
          addChild: false,
          edit: false,
          delete: false
        };
      }
      if (parent.name === "response") {
        return {
          addNext: false,
          addChild: true,
          edit: false,
          delete: false
        };
      }
    }
  },
  NodeHelperPanel: UserManual,
  executor: PKG.executor,
  defaultData() {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"] || META.name,
        ...NodeSize,
        outputSchema: {
          name: "output",
          type: "ͼOBJECTͼ",
          children: [{
            name: "header",
            type: "ͼOBJECTͼ"
          }, {
            name: "body",
            type: "ͼOBJECTͼ"
          }]
        }
      },
      props: {}
    };
  },
  validate({
    nodeData
  }) {
    if (!nodeData.props.input) {
      return "Http input is required!";
    }
  }
};

export { config as default };
