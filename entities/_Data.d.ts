declare namespace _Data {
  interface IData extends _Entity.BaseEntity {
    type: "data";
  }

  interface IDataDetail {
    id: string;
    content: string;
  }

  type UpdateResult = _Resource.IUpdateResult;
}
