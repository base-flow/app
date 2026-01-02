function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;
  if (typeof document === 'undefined') {
    return;
  }
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".index-module_variable__5m0b5>.initial-assignment{margin:0 15px 0 55px;padding:15px 0;text-align:right}";
var styles = {"variable":"index-module_variable__5m0b5"};
styleInject(css_248z);

const toolsFilter = (item, parent) => {
  if (!parent) {
    return {
      addNext: false,
      edit: false,
      delete: false
    };
  }
};
const schemaLabelRender = (item, parent) => {
  if (!parent) {
    return {
      name: "变量定义",
      label: ""
    };
  }
};
const valueLabelRender = (item, parent) => {
  if (!parent) {
    return {
      name: "变量初始化",
      label: ""
    };
  }
};
const Component = ({
  nodeData
}) => {
  const {
    node
  } = Baseflow.useNode(nodeData.id);
  const nodeProps = nodeData.props;
  const outputSchema = nodeData.meta.outputSchema;
  const initialValue = nodeProps.initialValue;
  const showAssignment = !!initialValue;
  const onShowAssignmentChange = React.useCallback(show => {
    if (!show) {
      node.updateProps({
        initialValue: undefined
      });
    } else {
      const {
        name,
        type,
        optional,
        children
      } = outputSchema;
      const newValue = {
        name,
        value: {
          type,
          optional,
          source: Baseflow.ValueSource.Template,
          text: "*"
        },
        children: children?.map(({
          name: name_0,
          type: type_0,
          optional: optional_0
        }) => ({
          name: name_0,
          value: {
            type: type_0,
            optional: optional_0,
            source: Baseflow.ValueSource.Variable,
            text: ""
          }
        }))
      };
      node.updateProps({
        initialValue: newValue
      });
    }
  }, [node, outputSchema]);
  const onSchemaChange = React.useCallback(schema => {
    node.updateOutputSchema(schema);
    const names = (schema?.children || []).map(item => item.name);
    const show_0 = names.slice(0, 3);
    if (show_0.length < names.length) {
      show_0.push("...");
    }
    node.updateMeta({
      summary: show_0.join(", ")
    });
  }, [node]);
  const onValueChange = React.useCallback(initialValue_0 => {
    node.updateProps({
      initialValue: initialValue_0
    });
  }, [node]);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.variable
  }, /*#__PURE__*/React.createElement(Baseflow.SchemaModelForm, {
    variant: "borderless",
    labelRender: schemaLabelRender,
    toolsFilter: toolsFilter,
    value: outputSchema,
    onChange: onSchemaChange
  }), /*#__PURE__*/React.createElement("div", {
    className: "initial-assignment"
  }, /*#__PURE__*/React.createElement(antd.Switch, {
    value: showAssignment,
    checkedChildren: "\u521D\u59CB\u8D4B\u503C",
    unCheckedChildren: "\u521D\u59CB\u8D4B\u503C",
    onChange: onShowAssignmentChange
  })), initialValue && /*#__PURE__*/React.createElement(Baseflow.SchemaValueForm, {
    variant: "filled",
    showRootTools: true,
    labelRender: valueLabelRender,
    schema: outputSchema,
    value: initialValue,
    onChange: onValueChange
  }));
};
var NodeInputPanel = /*#__PURE__*/React.memo(Component);

var version = "0.0.1";
var baseflow = {
	type: "Variable",
	name: "变量定义",
	icon: "",
	desc: "变量定义：通过本节点可以定义多个流程变量"
};
var executor = {
	node: "@baseflow-executors/variable@0.0.1"
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
  type: Baseflow.NodeType.Variable,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
  NodeInputPanel,
  executor: PKG.executor,
  defaultData() {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"] || META.name,
        ...NodeSize,
        outputSchema: {
          name: "output",
          type: Baseflow.DataType.Object,
          children: [{
            name: "newVariable",
            type: Baseflow.DataType.String
          }]
        }
      },
      props: {}
    };
  },
  validate() {}
};

export { config as default };
