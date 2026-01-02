var version = "0.0.1";
var baseflow = {
	type: "Choice",
	name: "条件选择",
	icon: "",
	desc: "条件选择：可添加多个[条件分支]，通过条件判断来控制分支执行"
};
var executor = {
	node: "@baseflow-executors/choice@0.0.1"
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
  type: Baseflow.NodeType.Choice,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
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
