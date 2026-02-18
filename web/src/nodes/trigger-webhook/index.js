/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = string => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = string => string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
const toPascalCase = string => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = props => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};

/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const Icon = /*#__PURE__*/React.forwardRef(({
  color = "currentColor",
  size = 24,
  strokeWidth = 2,
  absoluteStrokeWidth,
  className = "",
  children,
  iconNode,
  ...rest
}, ref) => /*#__PURE__*/React.createElement("svg", {
  ref,
  ...defaultAttributes,
  width: size,
  height: size,
  stroke: color,
  strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
  className: mergeClasses("lucide", className),
  ...(!children && !hasA11yProp(rest) && {
    "aria-hidden": "true"
  }),
  ...rest
}, [...iconNode.map(([tag, attrs]) => /*#__PURE__*/React.createElement(tag, attrs)), ...(Array.isArray(children) ? children : [children])]));

/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const createLucideIcon = (iconName, iconNode) => {
  const Component = /*#__PURE__*/React.forwardRef(({
    className,
    ...props
  }, ref) => /*#__PURE__*/React.createElement(Icon, {
    ref,
    iconNode,
    className: mergeClasses(`lucide-${toKebabCase(toPascalCase(iconName))}`, `lucide-${iconName}`, className),
    ...props
  }));
  Component.displayName = toPascalCase(iconName);
  return Component;
};

/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const __iconNode = [["rect", {
  width: "8",
  height: "4",
  x: "8",
  y: "2",
  rx: "1",
  ry: "1",
  key: "tgr4d6"
}], ["path", {
  d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
  key: "4jdomd"
}], ["path", {
  d: "M16 4h2a2 2 0 0 1 2 2v4",
  key: "3hqy98"
}], ["path", {
  d: "M21 14H11",
  key: "1bme5i"
}], ["path", {
  d: "m15 10-4 4 4 4",
  key: "5dvupr"
}]];
const ClipboardCopy = createLucideIcon("clipboard-copy", __iconNode);

const MethodOptions = [{
  label: "get",
  value: "get"
}, {
  label: "post",
  value: "post"
}, {
  label: "put",
  value: "put"
}, {
  label: "delete",
  value: "delete"
}];
const ContentTypeOptions = [{
  label: "json",
  value: "json"
}, {
  label: "xml",
  value: "xml"
}, {
  label: "form-data",
  value: "form-data"
}, {
  label: "form-urlencoded",
  value: "form-urlencoded"
}];
const DefaultHeaders = [{
  name: "url",
  type: Baseflow.DataType.String
}, {
  name: "protocol",
  type: Baseflow.DataType.String
}, {
  name: "hostname",
  type: Baseflow.DataType.String
}, {
  name: "port",
  type: Baseflow.DataType.Number
}, {
  name: "path",
  type: Baseflow.DataType.String
}, {
  name: "method",
  type: Baseflow.DataType.String
}, {
  name: "queryString",
  type: Baseflow.DataType.String
}, {
  name: "cookieString",
  type: Baseflow.DataType.String
}, {
  name: "authorization",
  type: Baseflow.DataType.String
}];

const DefaultContentSchema = {
  name: "body",
  type: Baseflow.DataType.Object
};
function buildKeyValueSchema(keyValues) {
  if (keyValues) {
    const duplicates = {};
    const arr = keyValues.filter(item => {
      if (item.value && !duplicates[item.value]) {
        duplicates[item.value] = true;
        return true;
      }
      return false;
    }).map(item => ({
      name: item.value,
      type: Baseflow.DataType.String
    }));
    if (arr.length) {
      return arr;
    }
  }
}
function buildPathSchema(path) {
  if (path) {
    const {
      keys
    } = BaseflowWidgets.PathToRegexp.pathToRegexp(path);
    const arr = keys.filter(item => item.type === "param").map(item => ({
      name: item.name,
      type: Baseflow.DataType.String
    }));
    if (arr.length) {
      return arr;
    }
  }
}
function mergeSchema(outputSchema, data) {
  const children = outputSchema.children;
  return {
    ...outputSchema,
    children: [data.headers ? {
      ...children[0],
      children: DefaultHeaders.concat(data.headers)
    } : children[0], data.params ? {
      ...children[1],
      children: data.params
    } : children[1], data.queries ? {
      ...children[2],
      children: data.queries
    } : children[2], data.cookies ? {
      ...children[3],
      children: data.cookies
    } : children[3], data.body ? {
      ...children[4],
      children: data.body
    } : children[4]]
  };
}
const Component = ({
  nodeData,
  rebuildKey
}) => {
  const {
    node
  } = Baseflow.useNode(nodeData.id);
  const nodeProps = nodeData.props;
  const formRef = React.useRef(null);
  const inited = React.useRef(false);
  const onFormChange = Baseflow.useEvent(updates => {
    node.updateProps(updates);
    const outputSchema = nodeData.meta.outputSchema;
    if (Object.prototype.hasOwnProperty.call(updates, "path")) {
      node.updateOutputSchema(mergeSchema(outputSchema, {
        params: buildPathSchema(updates.path)
      }));
    }
    if (Object.prototype.hasOwnProperty.call(updates, "headers")) {
      node.updateOutputSchema(mergeSchema(outputSchema, {
        headers: buildKeyValueSchema(updates.headers)
      }));
    }
    if (Object.prototype.hasOwnProperty.call(updates, "queries")) {
      node.updateOutputSchema(mergeSchema(outputSchema, {
        queries: buildKeyValueSchema(updates.queries)
      }));
    }
    if (Object.prototype.hasOwnProperty.call(updates, "cookies")) {
      node.updateOutputSchema(mergeSchema(outputSchema, {
        cookies: buildKeyValueSchema(updates.cookies)
      }));
    }
    if (Object.prototype.hasOwnProperty.call(updates, "contentSchema")) {
      node.updateOutputSchema(mergeSchema(outputSchema, {
        body: updates.contentSchema?.children
      }));
    }
  });
  React.useEffect(() => {
    formRef.current?.validateFields();
  }, []);
  React.useEffect(() => {
    inited.current = true;
  }, []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(antd.Form, {
    ref: formRef,
    key: rebuildKey,
    className: "nd-form",
    layout: "vertical",
    initialValues: nodeProps,
    autoComplete: "off",
    onValuesChange: onFormChange
  }, /*#__PURE__*/React.createElement(antd.Form.Item, {
    label: "\u76D1\u542C\u5730\u5740",
    tooltip: "path",
    name: "path",
    rules: Baseflow.RequiredRule
  }, /*#__PURE__*/React.createElement(BaseflowWidgets.BlurInput, {
    allowClear: true,
    prefix: "BaseUrl / ",
    addonAfter: /*#__PURE__*/React.createElement(ClipboardCopy, {
      size: "16px"
    }),
    placeholder: "\u8F93\u5165\u89C4\u5212\u7684url\u8DEF\u5F84"
  })), /*#__PURE__*/React.createElement(antd.Form.Item, {
    label: "\u76D1\u542C\u65B9\u6CD5",
    tooltip: "method",
    name: "methods",
    rules: Baseflow.RequiredRule
  }, /*#__PURE__*/React.createElement(BaseflowWidgets.StringSelect, {
    block: true,
    multiple: true,
    options: MethodOptions
  })), /*#__PURE__*/React.createElement(antd.Form.Item, {
    label: "\u81EA\u5B9A\u4E49\u8BF7\u6C42\u5934",
    tooltip: "header",
    name: "headers"
  }, /*#__PURE__*/React.createElement(Baseflow.KeyValues, {
    variant: "filled",
    hideLabel: true,
    valuePlaceholder: "key"
  })), /*#__PURE__*/React.createElement(antd.Form.Item, {
    label: "Url\u67E5\u8BE2\u53C2\u6570",
    tooltip: "query",
    name: "queries"
  }, /*#__PURE__*/React.createElement(Baseflow.KeyValues, {
    variant: "filled",
    hideLabel: true,
    valuePlaceholder: "key"
  })), /*#__PURE__*/React.createElement(antd.Form.Item, {
    label: "Cookies",
    tooltip: "cookies",
    name: "cookies"
  }, /*#__PURE__*/React.createElement(Baseflow.KeyValues, {
    variant: "filled",
    hideLabel: true,
    valuePlaceholder: "key"
  })), /*#__PURE__*/React.createElement(antd.Form.Item, {
    label: "\u8BF7\u6C42\u4F53\u7C7B\u578B",
    tooltip: "content-type",
    name: "contentType"
  }, /*#__PURE__*/React.createElement(BaseflowWidgets.StringSelect, {
    variant: "filled",
    block: true,
    options: ContentTypeOptions
  })), /*#__PURE__*/React.createElement(antd.Form.Item, {
    label: "\u8BF7\u6C42\u4F53\u7ED3\u6784",
    tooltip: "content-schema",
    name: "contentSchema"
  }, /*#__PURE__*/React.createElement(Baseflow.SchemaModelForm, {
    variant: "filled",
    defaultValue: DefaultContentSchema
  }))));
};
var NodeInputPanel = /*#__PURE__*/React.memo(Component);

var version = "0.0.1";
var baseflow = {
	type: "Trigger",
	name: "webhook触发器",
	icon: "",
	desc: "webhook触发器：让流程能被指定的Http请求触发"
};
var executor = {
	node: "@baseflow-executors/trigger-webhook@0.0.1"
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
  type: Baseflow.NodeType.Trigger,
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
            name: "headers",
            type: Baseflow.DataType.Object,
            children: DefaultHeaders
          }, {
            name: "params",
            type: Baseflow.DataType.Object
          }, {
            name: "queries",
            type: Baseflow.DataType.Object
          }, {
            name: "cookies",
            type: Baseflow.DataType.Object
          }, {
            name: "body",
            type: Baseflow.DataType.Object
          }]
        },
        valueReference: {
          path: "start"
        }
      },
      props: {
        methods: ["post"],
        contentType: "json"
      }
    };
  },
  validate({
    nodeData,
    graph
  }) {
    // inputSchemaChanged错误必须由用户确认来清除
    if (nodeData.meta.configurationErrors === Baseflow.FlowErrors.inputSchemaChanged) {
      return Baseflow.FlowErrors.inputSchemaChanged;
    }
    const props = nodeData.props;
    if (!props.path) {
      return "监听地址不能为空";
    }
    if (!props.methods?.length) {
      return "监听方法不能为空";
    }
    if (props.headers) {
      for (const item of props.headers) {
        if (!item.value) {
          return "key不能为空";
        }
      }
    }
    if (props.queries) {
      for (const item of props.queries) {
        if (!item.value) {
          return "key不能为空";
        }
      }
    }
  },
  propsRender: {
    out(props) {
      const {
        headers,
        queries,
        cookies,
        ...others
      } = props;
      return {
        headers: headers?.map(item => item.value),
        queries: queries?.map(item => item.value),
        cookies: cookies?.map(item => item.value),
        ...others
      };
    },
    in(dsl) {
      const {
        headers,
        queries,
        cookies,
        ...others
      } = dsl;
      return {
        headers: headers?.map(item => ({
          value: item
        })),
        queries: queries?.map(item => ({
          value: item
        })),
        cookies: cookies?.map(item => ({
          value: item
        })),
        ...others
      };
    }
  }
};

export { config as default };
