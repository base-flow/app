declare namespace _Shared {
  interface Query {
    spaceId: string;
    spaceType: "personal" | "project";
  }
  interface IShared extends _Resource.IItem {
    name: string;
    expiration: string;
    password: string;
    urlWithPassword: boolean;
    expiresAt: number;
    viewed: number;
    spaceId: string;
    spaceType: "personal" | "project";
    spaceDir: string;
    spaceName: string;
    spaceLogo: string;
    spaceRemark?: string;
    ids?: string[];
  }

  interface IGotShared extends IShared {
    sharedId: string;
  }

  type CreateResult = _Resource.ICreateResult;
  type UpdateResult = _Resource.IUpdateResult;
}
