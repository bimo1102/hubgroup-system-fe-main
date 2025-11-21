import { environment } from "./environments/environment";

window.SSOModuleUrl = environment.SSOModuleUrl;
window.FileManagerModuleUrl = environment.FileManagerModuleUrl;

import("./boostrap")
