declare namespace _Shared {
  interface Query {
    spaceId: string;
    spaceType: "personal" | "project";
  }
  interface IShared extends _Resource.IItem {
    name: string;
    expiresAt: number;
    viewed: number;
    spaceId: string;
    spaceType: "personal" | "project";
    spaceName: string;
    spaceLogo: string;
    spaceRemark?: string;
  }

  interface IGotShared extends IShared {
    sharedId: string;
  }
}
