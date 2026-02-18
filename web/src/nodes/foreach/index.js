const inputSchema = {
  name: "source",
  label: "迭代源",
  type: Baseflow.DataType.Array
};
const inputPropsRender = item => {
  if (item.name === "source") {
    return {
      sourceType: "mapping"
    };
  }
};
const Component = ({
  nodeData
}) => {
  const {
    node
  } = Baseflow.useNode(nodeData.id);
  const onInputChange = Baseflow.useEvent(source => {
    if (source) {
      // children and arrayType that allows to recognize it as a mapping mode
      source = {
        ...source,
        children: []
      };
    }
    node.updateProps({
      source
    });
    const sourceVar = source?.value.text;
    if (sourceVar) {
      if (/\D/.test(sourceVar) && !sourceVar.startsWith("_number(")) {
        node.updateOutputSchema({
          name: "output",
          type: Baseflow.DataType.Object,
          children: [{
            name: "_item_",
            type: Baseflow.DataType.Any,
            direct: sourceVar
          }, {
            name: "_key_",
            type: Baseflow.DataType.Any,
            direct: sourceVar
          }, {
            name: "_length_",
            type: Baseflow.DataType.Number
          }]
        });
      } else {
        node.updateOutputSchema({
          name: "output",
          type: Baseflow.DataType.Object,
          children: [{
            name: "_item_",
            type: Baseflow.DataType.Number
          }, {
            name: "_key_",
            type: Baseflow.DataType.Number
          }, {
            name: "_length_",
            type: Baseflow.DataType.Number
          }]
        });
      }
    } else {
      node.updateOutputSchema(undefined);
    }
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Baseflow.SchemaValueForm, {
    inputPropsRender: inputPropsRender,
    schema: inputSchema,
    value: nodeData.props.source,
    onChange: onInputChange
  }));
};
var NodeInputPanel = /*#__PURE__*/React.memo(Component);

var version = "0.0.1";
var baseflow = {
	type: "Loop",
	name: "Foreach循环",
	icon: "",
	desc: "Foreach循环：通过指定一个迭代源来循环执行子节点"
};
var executor = {
	node: "@baseflow-executors/foreach@0.0.1"
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
  type: Baseflow.NodeType.Loop,
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
    if (!nodeData.props.source) {
      return "Foreach source is required!";
    }
  },
  propsRender: {
    out(props) {
      const source = props.source?.value.text;
      return {
        source
      };
    },
    in(dsl) {
      const {
        source
      } = dsl;
      if (source) {
        const sourceType = /\D/.test(source) ? Baseflow.ValueSource.Variable : Baseflow.ValueSource.Template;
        return {
          source: {
            name: "source",
            value: {
              type: Baseflow.DataType.Array,
              source: sourceType,
              text: source
            },
            children: []
          }
        };
      } else {
        return {
          source: undefined
        };
      }
    }
  }
};

export { config as default };
