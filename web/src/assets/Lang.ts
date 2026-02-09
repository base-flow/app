/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: <> */
export default {
  entityDirName: {
    "workflow.server": "流程-服务器运行",
    "workflow.browser": "流程-浏览器运行",
    "node.server": "节点-服务器运行",
    "node.browser": "节点-浏览器运行",
  } as { [key: string]: string },
  spaceType: {
    personal: "个人",
    project: "项目",
    platform: "公共",
  },
  letMultipleFiles: "将${count}个文件",
  letSingleFiles: "将文件“${name}”",
  copyConfirm: "${file}：${action} “${path}” 吗？",
  projectRolesTips:
    "项目下不同角色将拥有不同权限：\n【Owner】拥有该项目的所有最高权限...\n【Admin】拥有除[删除项目]、[分配管理员]之外的所有权限...\n【Developer】可修改和运行该项目下的所有流程...\n【Tester】可查看流程配置和运行流程，但不能修改...\n【Guest】仅能查看流程概貌...",
};
export function formatLang(tpl: string, args: { [key: string]: string } = {}): string {
  return tpl.replace(/\$\{([^}]*)\}/g, (_, key) => args[key]);
}
