const defaultInput = {
  name: "input",
  type: Baseflow.DataType.Object,
  children: []
};
const defaultReturn = {
  name: "return",
  type: Baseflow.DataType.Object,
  children: []
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
  const inputSchema = graph.getInputSchema();
  const returnSchema = graph.getReturnSchema();
  const [inputSchemaChanged, setInputSchemaChanged] = React.useState(false);
  const [returnSchemaChanged, setReturnSchemaChanged] = React.useState(false);
  const onInputSchemaChange = Baseflow.useEvent(inputSchema_0 => {
    setInputSchemaChanged(true);
    graph.setInputSchema(inputSchema_0);
    node.updateMeta({
      summary: [inputSchema_0 && "[✓入参]", returnSchema && "[✓返回]"].filter(Boolean).join(", ")
    });
  });
  const onReturnSchemaChange = Baseflow.useEvent(returnSchema_0 => {
    setReturnSchemaChanged(true);
    graph.setReturnSchema(returnSchema_0);
    node.updateMeta({
      summary: [inputSchema && "[✓入参]", returnSchema_0 && "[✓返回]"].filter(Boolean).join(", ")
    });
  });
  return /*#__PURE__*/React.createElement("div", null, inputSchemaChanged && /*#__PURE__*/React.createElement(antd.Alert, {
    style: {
      marginBottom: "20px"
    },
    title: Baseflow.BaseLang.inputSchemaChanged,
    type: "warning",
    showIcon: true
  }), returnSchemaChanged && /*#__PURE__*/React.createElement(antd.Alert, {
    style: {
      marginBottom: "20px"
    },
    title: Baseflow.BaseLang.returnSchemaChanged,
    type: "warning",
    showIcon: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "nd-form-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label-item"
  }, "\u6D41\u7A0B\u5165\u53C2"), /*#__PURE__*/React.createElement("div", {
    className: "input-item nd-schema-filled"
  }, /*#__PURE__*/React.createElement(Baseflow.SchemaModelForm, {
    variant: "filled",
    defaultValue: defaultInput,
    value: inputSchema,
    onChange: onInputSchemaChange
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label-item"
  }, "\u6D41\u7A0B\u8FD4\u56DE"), /*#__PURE__*/React.createElement("div", {
    className: "input-item nd-schema-filled"
  }, /*#__PURE__*/React.createElement(Baseflow.SchemaModelForm, {
    variant: "filled",
    defaultValue: defaultReturn,
    value: returnSchema,
    onChange: onReturnSchemaChange
  })))));
};
var NodeInputPanel = /*#__PURE__*/React.memo(Component);

var version = "0.0.1";
var baseflow = {
	type: "Start",
	icon: "",
	name: "Workflow Start",
	desc: "Workflow Start：Marks the start of the execution. Use this to define input parameters and the output data structure.",
	"zh-CN_name": "流程开始",
	"zh-CN_desc": "流程开始：表示流程开始执行，可以定义流程入参返回数据结构.",
	"zh-TW_name": "流程開始",
	"zh-TW_desc": "流程開始：表示流程開始執行，可以定義流程輸入參數與回傳資料結構.",
	"ja-JP_name": "プロセス開始",
	"ja-JP_desc": "プロセス開始：実行の開始点です。入力パラメータと出力データ構造を設定します."
};
var executor = {
	node: "@baseflow-executors/start@0.0.1"
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
  type: Baseflow.NodeType.Start,
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
  validate() {}
};

export { config as default };
