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

var css_248z = ".index-module_variableUpdate__P9Pls .switch-mode{position:absolute;right:0}.index-module_variableUpdate__P9Pls .actions{align-items:center;display:flex;justify-content:space-between;margin-bottom:20px;padding-top:10px}.index-module_variableUpdate__P9Pls .position{align-items:center;display:flex;gap:5px}.index-module_variableUpdate__P9Pls .anticon{color:var(--bf-tx-lesser);cursor:help}.index-module_variableUpdate__P9Pls .ant-input-number{width:50px}.index-module_variableUpdate__P9Pls .remove-targets{background:var(--bf-bg-filled);border-radius:var(--bf-rd-card);padding:20px}.index-module_variableUpdate__P9Pls .remove-targets>.title{padding:0 0 13px 2px}.index-module_variableUpdate__P9Pls .nd-form-layout{padding-top:2px}";
var styles = {"variableUpdate":"index-module_variableUpdate__P9Pls"};
styleInject(css_248z);

const Actions = [{
  label: "覆盖原值",
  value: "assign"
}, {
  label: "插入一段元素",
  value: "insert"
}, {
  label: "移除一段元素",
  value: "remove"
}];
const Component = ({
  nodeData
}) => {
  const {
    graph
  } = Baseflow.useGraph();
  const {
    node
  } = Baseflow.useNode(nodeData.id);
  const nodeProps = nodeData.props;
  const inited = React.useRef(false);
  const onModeChange = Baseflow.useEvent(useScripts => {
    if (useScripts) {
      node.updateProps({
        scripts: {
          type: Baseflow.DataType.Any,
          source: Baseflow.ValueSource.Expression,
          text: ""
        },
        variable: undefined,
        action: undefined,
        at: undefined,
        removeTargets: undefined
      });
      node.updateMeta({
        summary: "scripts"
      });
    } else {
      node.updateProps({
        scripts: undefined
      });
      node.updateMeta({
        summary: undefined
      });
    }
  });
  const onScriptsChange = Baseflow.useEvent(scripts => {
    node.updateProps({
      scripts
    });
  });
  const onVariableChange = Baseflow.useEvent(variable => {
    node.updateProps({
      variable,
      action: undefined,
      at: undefined,
      removeTargets: undefined
    });
    node.updateMeta({
      valueReference: undefined
    });
  });
  const onActionChange = Baseflow.useEvent(e => {
    const action = e.target.value;
    if (action === "remove") {
      node.updateProps({
        action
      });
      node.updateMeta({
        valueReference: undefined
      });
    } else {
      node.updateProps({
        action,
        removeTargets: undefined
      });
    }
  });
  const onAtChange = Baseflow.useEvent(at => {
    node.updateProps({
      at: at || undefined
    });
  });
  const onRemoveKeysChange = Baseflow.useEvent(keys => {
    node.updateProps({
      removeTargets: keys
    });
  });
  const onRemoveLengthChange = Baseflow.useEvent(num => {
    node.updateProps({
      removeTargets: num || undefined
    });
  });
  const onVariableValueChange = Baseflow.useEvent(value => {
    node.updateMeta({
      valueReference: {
        path: nodeProps.variable.text,
        value
      }
    });
  });
  const variableSchema = React.useMemo(() => {
    const text = nodeProps.variable?.text;
    if (text) {
      const schema = graph.getVariableSchema(text);
      if (inited.current && schema) {
        node.updateMeta({
          valueReference: {
            path: text,
            value: {
              name: schema.name,
              value: {
                type: schema.type,
                source: Baseflow.ValueSource.Variable,
                text: "",
                optional: schema.optional
              }
            }
          }
        });
      }
      return schema;
    }
    return undefined;
  }, [node, nodeProps.variable, graph]);
  React.useEffect(() => {
    inited.current = true;
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.variableUpdate
  }, /*#__PURE__*/React.createElement("div", {
    className: "switch-mode"
  }, /*#__PURE__*/React.createElement(antd.Switch, {
    unCheckedChildren: "\u811A\u672C\u6A21\u5F0F",
    checkedChildren: "\u811A\u672C\u6A21\u5F0F",
    value: !!nodeProps.scripts,
    onChange: onModeChange
  })), nodeProps.scripts ? /*#__PURE__*/React.createElement("div", {
    className: "nd-form-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label-item require"
  }, "\u4F7F\u7528(JS)\u4FEE\u6539\u53D8\u91CF\u8282\u70B9\u4E2D\u7684\u53D8\u91CF\u503C"), /*#__PURE__*/React.createElement("div", {
    className: "input-item"
  }, /*#__PURE__*/React.createElement(Baseflow.SuperInput, {
    height: 100,
    hideIcon: true,
    runtime: "script",
    brand: "variable",
    dataType: Baseflow.DataType.Any,
    value: nodeProps.scripts,
    onChange: onScriptsChange
  })))) : /*#__PURE__*/React.createElement("div", {
    className: "nd-form-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label-item require"
  }, "\u9009\u62E9\u8981\u4FEE\u6539\u7684\u53D8\u91CF"), /*#__PURE__*/React.createElement("div", {
    className: "input-item"
  }, /*#__PURE__*/React.createElement(Baseflow.SuperInput, {
    hideIcon: true,
    sourceType: "variable",
    brand: "variable",
    dataType: Baseflow.DataType.Any,
    value: nodeProps.variable,
    onChange: onVariableChange
  }))), variableSchema && /*#__PURE__*/React.createElement("div", {
    className: "form-item"
  }, variableSchema.type === Baseflow.DataType.Array || variableSchema.type === Baseflow.DataType.Map ? /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement(antd.Radio.Group, {
    options: Actions,
    value: nodeProps.action || "assign",
    onChange: onActionChange
  }), variableSchema.type === Baseflow.DataType.Array && (nodeProps.action || "assign") !== "assign" && /*#__PURE__*/React.createElement("div", {
    className: "position"
  }, /*#__PURE__*/React.createElement(antd.Tooltip, {
    title: "\u6B63\u6570\u4ECE\u5934\u90E8\u5F00\u59CB\uFF0C\u8D1F\u6570\u4ECE\u5C3E\u90E8\u5F00\u59CB"
  }, /*#__PURE__*/React.createElement(BaseflowWidgets.Icons.QuestionCircleOutlined, null)), /*#__PURE__*/React.createElement("span", null, "\u4F4D\u7F6E\u4ECE"), /*#__PURE__*/React.createElement(antd.InputNumber, {
    size: "small",
    value: nodeProps.at || 0,
    onChange: onAtChange
  }), /*#__PURE__*/React.createElement("span", null, "\u5F00\u59CB"))) : /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement(antd.Radio.Group, {
    options: Actions.slice(0, 1),
    value: "assign"
  })), /*#__PURE__*/React.createElement("div", {
    className: "input-item"
  }, nodeProps.action !== "remove" ? /*#__PURE__*/React.createElement(Baseflow.SchemaValueForm, {
    variant: "filled",
    schema: variableSchema,
    value: nodeData.meta.valueReference?.value,
    onChange: onVariableValueChange
  })
  // biome-ignore lint/style/noNestedTernary: <>
  : variableSchema.type === Baseflow.DataType.Array ? /*#__PURE__*/React.createElement("div", {
    className: "remove-targets"
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, "\u8F93\u5165\u8981\u79FB\u9664\u5143\u7D20\u7684\u4E2A\u6570\uFF1A"), /*#__PURE__*/React.createElement(antd.InputNumber, {
    style: {
      width: "100%"
    },
    value: nodeProps.removeTargets || 1,
    onChange: onRemoveLengthChange
  })) : /*#__PURE__*/React.createElement("div", {
    className: "remove-targets"
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, "\u6DFB\u52A0\u8981\u79FB\u9664\u5143\u7D20\u7684KEY\uFF1A"), /*#__PURE__*/React.createElement(Baseflow.KeyValues, {
    hideLabel: true,
    valuePlaceholder: "key",
    value: nodeProps.removeTargets,
    onChange: onRemoveKeysChange
  }))))));
};
var NodeInputPanel = /*#__PURE__*/React.memo(Component);

var version = "0.0.1";
var baseflow = {
	type: "VariableUpdate",
	icon: "",
	name: "VariableUpdate",
	desc: "VariableUpdate：Modifies variable values in the [Variable Definition] node.",
	"zh-CN_name": "变量修改",
	"zh-CN_desc": "变量修改：通过本节点可以修改[变量定义]节点中的变量值."
};
var executor = {
	node: "@baseflow-executors/variable-update@0.0.1"
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
  type: Baseflow.NodeType.VariableUpdate,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
  NodeInputPanel,
  executor: PKG.executor,
  defaultData() {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"] || META.name,
        ...NodeSize
      },
      props: {}
    };
  },
  validate({
    nodeData
  }) {
    if (!nodeData.props.scripts && !nodeData.props.variable) {
      return "Required!";
    }
    if (nodeData.props.scripts) {
      if (!nodeData.props.scripts.text) {
        return "Required!";
      }
    } else {
      if (!nodeData.props.variable.text) {
        return "Required!";
      }
    }
  },
  propsRender: {
    out(props) {
      if (props.scripts) {
        const scripts = props.scripts?.text;
        return {
          scripts
        };
      } else {
        const {
          action,
          at
        } = props;
        const variable = props.variable?.text;
        const removeTargets = props.removeTargets && (typeof props.removeTargets === "number" ? props.removeTargets : props.removeTargets.map(item => item.value));
        return {
          variable,
          action,
          at,
          removeTargets
        };
      }
    },
    in(dsl) {
      const {
        scripts,
        variable,
        action,
        at,
        removeTargets
      } = dsl;
      return {
        scripts: scripts ? {
          type: Baseflow.DataType.Any,
          source: Baseflow.ValueSource.Expression,
          text: scripts
        } : undefined,
        variable: variable ? {
          type: Baseflow.DataType.Any,
          source: Baseflow.ValueSource.Variable,
          text: variable
        } : undefined,
        action,
        at,
        removeTargets: removeTargets && (typeof removeTargets === "number" ? removeTargets : removeTargets.map(item => ({
          value: item
        })))
      };
    }
  }
};

export { config as default };
