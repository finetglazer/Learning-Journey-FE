import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import SliceName from "./slice.name";
import {
  Account,
  BusinessBranch,
  BusinessDepartment,
  BusinessUnit,
  Position,
} from "models/Profile";
import { Organization } from "models/Organization";

const initialState: ProfileState = {
  isLoading: false,
  account: {} as Account,
  businessDepartment: {} as BusinessDepartment,
  position: {} as Position,
  businessBranch: {} as BusinessBranch,
  organization: {} as Organization,
  businessUnit: {} as BusinessUnit,
};
type ProfileState = {
  isLoading: boolean;
  account: Account;
  businessDepartment: BusinessDepartment;
  businessUnit: BusinessUnit;
  position: Position;
  businessBranch: BusinessBranch;
  organization: Organization;
};

const profileSlice = createSlice({
  name: SliceName.Profile,
  initialState: initialState,
  reducers: {
    setFirstInitApp: (state, action: PayloadAction<Account>) => {
      state.account = action.payload;
    },
    cleanAccount: (state) => {
      state.account = {} as Account;
    },
    businessDepartment: (state, action: PayloadAction<BusinessDepartment>) => {
      state.businessDepartment = action.payload;
    },
    updateAccount: (state, action: PayloadAction<Account>) => {
      state.account = action.payload;
    },
    updatePosition: (state, action: PayloadAction<Position>) => {
      state.position = action.payload;
    },
    updateBusinessBranch: (state, action: PayloadAction<BusinessBranch>) => {
      state.businessBranch = action.payload;
    },
    updateOrganization: (state, action: PayloadAction<Organization>) => {
      state.organization = action.payload;
    },
    updateBusinessUnit: (state, action: PayloadAction<BusinessUnit>) => {
      state.businessUnit = action.payload;
    },
  },
});

export default profileSlice;
