var version = "0.0.1";
var baseflow = {
	type: "Thread",
	name: "并行分支",
	icon: "",
	desc: "并行分支：放置于[并行执行]中，多个并行分支同时执行"
};
var executor = {
	node: "@baseflow-executors/thread@0.0.1"
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
  type: Baseflow.NodeType.Thread,
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
