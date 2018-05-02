import * as functions from "firebase-functions";
import { UserRecord } from "firebase-functions/lib/providers/auth";
import * as users from "./index";

export const tanamScaffoldNewUserProfile: functions.CloudFunction<UserRecord> = functions.auth.user().onCreate(users.scaffoldNewUserProfile);
export const tanamDeleteUserProfile: functions.CloudFunction<UserRecord> = functions.auth.user().onDelete(users.cleanUpDeletedUser);

