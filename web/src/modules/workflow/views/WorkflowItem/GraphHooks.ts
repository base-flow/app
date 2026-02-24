import type { EnvStatus, FlowLogs, FlowLogsListItem, GraphData, INodeConfig, INodeData, RunState, SchemaValue } from "@baseflow/react";
import { DefalutGraphHooks, DslTools } from "@baseflow/react";
import { onImportNode, sleep } from "@/utils/tools";

export class GraphHooks extends DefalutGraphHooks {
  public doc: _Workflow.IWorkflowDetail;
  constructor(doc: _Workflow.IWorkflowDetail) {
    super();
    this.doc = doc;
  }

  async onSave(data: GraphData): Promise<void> {
    // const xml = DslTools.graphToXml(data);
    const dsl = DslTools.graphToJson(data);
    localStorage.setItem("baseflow-dsl", JSON.stringify(dsl));
  }

  async onImportNode(source: string): Promise<INodeConfig> {
    return onImportNode(source);
  }

  async onUploadNodeData(node: INodeData): Promise<void> {
    return Promise.resolve();
  }

  async onDownloadNodeData(source: string): Promise<INodeData> {
    return Promise.resolve({} as any);
  }

  async onFetchLogsList(): Promise<{ commitId: string; list: FlowLogsListItem[] }> {
    const list: FlowLogsListItem[] = [
      { id: "ersdfewrewsdfs1", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
      { id: "ersdfewrewsdfs2", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
      { id: "ersdfewrewsdfs3", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
      { id: "ersdfewrewsdfs4", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
      { id: "ersdfewrewsdfs5", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
      { id: "ersdfewrewsdfs6", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
      { id: "ersdfewrewsdfs7", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
      { id: "ersdfewrewsdfs8", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
      { id: "ersdfewrewsdfs9", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
      { id: "ersdfewrewsdfs11", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
      { id: "ersdfewrewsdfs12", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
      { id: "ersdfewrewsdfs13", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
      { id: "ersdfewrewsdfs14", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
      { id: "ersdfewrewsdfs15", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
      { id: "ersdfewrewsdfs16", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
      { id: "ersdfewrewsdfs17", label: "v0.0.1 - (试运行)", time: "2025/10/12 09:34:02", status: "success" },
    ];
    return { commitId: this.doc.commitId, list };
  }

  async onFetchLogsItem(id: string): Promise<FlowLogs> {
    await sleep(500);
    return {
      info: {
        commitId: this.doc.commitId,
        label: `v${this.doc.version}${this.doc.released ? "" : "-dev"}（试运行）`,
        datetime: "2025/10/12 09:34:02",
      },
      result: {
        status: "success",
        totalTime: 219,
        totalNodes: 12,
      },
      nodes: {
        start: {
          id: "start",
          status: "success",
          time: 0.012,
          datetime: "2025/10/12 09:34:02",
          console: "aaaaabbbbb",
        },
        choice1: {
          id: "choice1",
          time: 0.012,
          datetime: "2025/10/12 09:34:02",
          status: "success",
        },
        branch1: {
          id: "branch1",
          time: 0.012,
          datetime: "2025/10/12 09:34:02",
          status: "success",
        },
        http1: {
          id: "http1",
          status: "success",
          datetime: "2025/10/12 09:34:02",
          time: 0.012,
          console: "ccccccdddddd",
          output: "success",
        },
        http2: {
          id: "http2",
          status: "error",
          time: 0.012,
          datetime: "2025/10/12 09:34:02",
          console: "eeeeee",
          output: "error",
        },
        variable1: {
          id: "variable1",
          status: "skipped",
          datetime: "2025/10/12 09:34:02",
        },
        end: {
          id: "end",
          time: 0.012,
          datetime: "2025/10/12 09:34:02",
          status: "success",
        },
      },
    };
  }

  async onTestRun(watch: (evt: FlowLogs) => void, env: EnvStatus, input?: SchemaValue): Promise<RunState> {
    const timer: number[] = [];
    timer.push(
      setTimeout(
        () =>
          watch({
            result: {
              status: "running",
              totalTime: 100,
              totalNodes: 1,
            },
            nodes: {
              start: { id: "start", status: "running", console: "aaaaa" },
            },
          }),
        2000,
      ),
    );
    timer.push(
      setTimeout(
        () =>
          watch({
            result: {
              status: "running",
              totalTime: 120,
              totalNodes: 5,
            },
            nodes: {
              start: { id: "start", status: "success", time: 0.001, console: "bbbbb" },
              choice1: { id: "choice1", status: "success", time: 0.001 },
              branch1: { id: "branch1", status: "success", time: 0.001 },
              http1: { id: "http1", status: "running", console: "cccccc" },
            },
          }),
        3000,
      ),
    );
    timer.push(
      setTimeout(
        () =>
          watch({
            result: {
              status: "running",
              totalTime: 170,
              totalNodes: 8,
            },
            nodes: {
              http1: { id: "http1", status: "running", console: "dddddd" },
              http2: { id: "http2", status: "running", console: "eeeeee" },
            },
          }),
        4000,
      ),
    );
    timer.push(
      setTimeout(
        () =>
          watch({
            result: {
              status: "running",
              totalTime: 160,
              totalNodes: 10,
            },
            nodes: {
              http1: { id: "http1", status: "success", time: 0.001, output: "success" },
              http2: { id: "http2", status: "error", output: "error" },
              variable1: { id: "variable1", status: "skipped" },
            },
          }),
        6000,
      ),
    );
    timer.push(
      setTimeout(
        () =>
          watch({
            result: {
              status: "success",
              totalTime: 219,
              totalNodes: 12,
            },
            nodes: {
              end: { id: "end", status: "success", time: 0.001 },
            },
          }),
        9000,
      ),
    );
    return Promise.resolve({
      running: {
        abort: () => {
          timer.forEach((val) => {
            clearTimeout(val);
          });
          return Promise.resolve();
        },
        retry: () => Promise.resolve(),
      },
      logs: {
        info: {
          commitId: this.doc.commitId,
          label: `v${this.doc.version}${this.doc.released ? "" : "-dev"}（试运行）`,
          datetime: "2025/10/12 09:34:02",
        },
        result: { status: "running", totalTime: 0, totalNodes: 0 },
        nodes: {},
      },
    });
  }
}
