import { Model } from "react-3layer-common";

export class ResetPasswordModel extends Model {
    public token?: string;
    public newPassword?: string;
    public confirmPassword?: string;
};