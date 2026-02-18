var version = "0.0.1";
var baseflow = {
	type: "Flow",
	name: "流程",
	icon: "",
	desc: "流程：定义一个独立的流程"
};
var executor = {
	node: "@baseflow-executors/flow@0.0.1"
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
  type: Baseflow.NodeType.Flow,
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
