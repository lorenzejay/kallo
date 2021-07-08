"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const authorization_1 = __importDefault(require("./authorization"));
const hasProjectAccess = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { project_id } = request.params;
        authorization_1.default(request, response, next);
        // next();
        const user_id = request.user;
        if (!project_id)
            return response.status(404).json("No Project");
        //check if the user is the owner
        if (user_id) {
            const verifyQuery = yield db_1.default.query("SELECT project_owner FROM projects WHERE project_id = $1", [project_id]);
            const { project_owner } = verifyQuery.rows[0];
            //check if the user is the owner of the project
            //   console.log(project_owner);
            if (project_owner === user_id) {
                return (request.isProjectOwner = true);
            }
            //if you are not the owner then we have to check if you are shared to the project
            const sharedToMeChecker = yield db_1.default.query("SELECT shared_user FROM shared_users WHERE shared_project = $1", [project_id]);
            const isSharedToUserAlreadyChecker = sharedToMeChecker.rows.find((x) => x.shared_user === user_id);
            if (isSharedToUserAlreadyChecker) {
                return (request.isProjectOwner = true);
            }
            request.isProjectOwner = false;
        }
    }
    catch (error) {
        console.log(error);
    }
    next();
});
exports.default = hasProjectAccess;
