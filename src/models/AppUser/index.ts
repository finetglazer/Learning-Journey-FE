// import { Organization } from "models/Organization";
// import { Status } from "models/Status";
// import { ObjectField, ObjectList } from "react-3layer-decorators";
// import nameof from "ts-nameof.macro";
// import { AppUser } from "./AppUser";
// import { Gender } from "models/Gender";
// import { SubSystem } from "models/SubSystem";

// ObjectField(Organization)(
//   AppUser.prototype,
//   nameof(AppUser.prototype.organization)
// );
// ObjectField(Gender)(AppUser.prototype, nameof(AppUser.prototype.gender));
// ObjectField(Status)(AppUser.prototype, nameof(AppUser.prototype.status));
// ObjectList(SubSystem)(AppUser.prototype, nameof(AppUser.prototype.subSystems));

export * from "./AppUser";
export * from "./AppUserFilter";
