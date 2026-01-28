你是一名资深的软件架构师，现在要设计一款基于类似SaaS网盘系统而打造的流程编排文件管理系统，技术栈打算选用NodeJS+Typescript+PostgreSQL，系统分析如下：

- 本系统类似于一个简化的网盘管理系统，使用文件和文件夹来管理流程编排数据文件，文件系统上只有三种文件实体：目录、工作流、节点。
- 本系统只负责流程编排数据文件的存储，不涉及具体流程编排相关的逻辑。
  
## 关键业务实体：

### 文件系统基类，用Typescript类型定义接口如下：

```typescript
interface BaseEntity{
type: "directory" | "workflow" | "node"; //在本系统中，文件类型只有：目录｜工作流｜节点
name: string; //名称
parentId: string; //父级目录ID
}
```

### 目录Directory，用来组织文件，用Typescript类型定义接口如下：

```typescript
interface IDirectory extends BaseEntry {
    type: "directory";
    children: IEntity[];
}
```

### 工作流workflow，工作流由节点编排生成，在本系统中可以简单当作一个xml文本文件，用Typescript类型定义接口如下：

```typescript
interface IWorkflow extends BaseEntry {
    type: "workflow";
    content: string; //数据内容
}
```

### 节点node，组成工作流的基本单位，在本系统中可以简单当作一个xml文本文件，用Typescript类型定义接口如下：

```typescript
  interface INode extends BaseEntry {
    type: "node";
    content: string; //数据内容
}
```

### 用户User，用Typescript类型定义接口如下：

```typescript
  interface IUser {
    id: string;
    username: string;
}
```

### 项目Project，项目可以由多个用户共同管理和维护，用Typescript类型定义接口如下：

```typescript
  interface IProject {
    id: string;
    name: string;
}
```

## 业务需求：

- 目录可以嵌套子目录，类似我们的物理文件系统。
- 每注册一个用户将在文件系统上创建一个私有文件夹，该文件夹只能用户自己和系统管理员访问。
- 用户个人空间中有一个固定名字public的文件夹，该文件夹对所有用户公开访问。
- 每建立一个项目将在文件系统上创建一个项目专属的文件夹，该文件夹只能被项目成员访问。
- 项目专属的文件夹中有一个固定名字public的文件夹，该文件夹对所有用户公开访问。
- 除了个人所属文件夹，项目所属文件夹外，系统中还存在一个公开的platform文件夹，该文件夹能被所有成员访问。
- 除了以上固定权限的文件外，用户还可以选中多个文件或文件生成一个临时的分享码URL，对外临时分享。
- 用户可以将其它非自己的文件或文件夹转存到自己的个人空间。
- 支持指定目录下递归搜索（搜索子孙目录）。

## 接口定义：

```typescript
  //返回指定目录下的文件列表
  getList(
    dir: string, //指定目录
    keyword?: string, //可选，搜索关键字
    filter?: "workflow" | "node" //可选，指定文件类型
): {
    list: Array<IDirectory | IWorkflow | INode>;
    summary: {
        namePath: string; //指定目录的名称路径，如:/admin/2025/
        idPath: string;  //指定目录的id路径，如:/3242324/876876546/
        scopeType: "personal" | "project" | "platform"; // personal表示所属个人文件夹，project表示所属项目文件夹，platform表示所属平台文件夹
        scopeId: string; //如果是所属个人文件夹，返回用户ID，如果是所属项目文件夹，返回项目ID
    }
  }
```

## 总结：

- 以上为接口和类型定义为初步设计，你作为一名资深的软件架构师，可以给出修正和完善。
- 由于是SaaS服务，所以要考虑会产生大量的用户个人空间和项目空间，所以需要考虑大数据量。

## 疑难问题：

1. 如果使用一个数据表来存储文件和文件夹，那么文件ID使用数据库自增ID还是程序生成ID？
2. 如果使用程序生成ID，那么是不是可以直接将用户名（用户名不允许修改）或者项目ID作为其专属文件夹的ID？
3. 如果使用数据库自增ID，那么是不是必须使用一个字段来记录用户名或者项目ID？
4. 如何记录和维护文件的path路径，包括名称路径和id路径，如/admin/2025/shanghai/xxx，是否将这个path作为一个字段存在每一行？但是这样是不是会造成数据冗余？
5. 如果修改一个文件夹名称，如何高效的维护其子孙后代文件的path路径？
6. 当搜索查询一个指定的文件夹时，文件夹参数dir是用该文件夹的id好？还是该文件夹的路径好？