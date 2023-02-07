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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var micromatch_1 = __importDefault(require("micromatch"));
var fast_glob_1 = __importDefault(require("fast-glob"));
/** Checks if the provided `id` refers to a node module. */
function isNodeModule(id) {
    // Relative and absolute paths will almost always be
    // resolvable using the file system, so require.resolve
    // is not a reliable method for those types of import.
    if (id.startsWith('.') || path_1["default"].isAbsolute(id)) {
        return id.includes('/node_modules/');
    }
    try {
        // If the `id` is neither relative nor absolute, AND is
        // resolvable by Node, then it has to be a node module.
        require.resolve(id);
        return true;
    }
    catch (_) {
        // Failing to resolve here could mean the `id` is
        // meant to be resolved by a different plugin.
        return false;
    }
}
function plugin(config) {
    var _a, _b;
    var preserveModulesRoot = (_a = config === null || config === void 0 ? void 0 : config.root) !== null && _a !== void 0 ? _a : 'src';
    var entryFileNames = (_b = config === null || config === void 0 ? void 0 : config.fileNames) !== null && _b !== void 0 ? _b : '[name].js';
    // Store the resolved absolute root path
    var root;
    // Create a matcher function from provided internal config (if any)
    var isInternal = function (file) {
        return (config === null || config === void 0 ? void 0 : config.internal) ? micromatch_1["default"].isMatch(file, config.internal) : false;
    };
    // Create a matcher function from provided copy config (if any)
    var isCopyTarget = function (file) {
        return (config === null || config === void 0 ? void 0 : config.copy) ? micromatch_1["default"].isMatch(file, config.copy) : false;
    };
    return {
        name: 'no-bundle',
        enforce: 'pre',
        apply: 'build',
        config: function (userConfig) {
            var _a;
            var entry = (((_a = userConfig.build) === null || _a === void 0 ? void 0 : _a.lib) || {}).entry;
            if (!entry)
                throw new Error('Required field "build.lib.entry" could not be found');
            return {
                build: {
                    lib: {
                        entry: entry,
                        formats: ['es']
                    },
                    rollupOptions: {
                        output: {
                            preserveModules: true,
                            preserveModulesRoot: preserveModulesRoot,
                            entryFileNames: entryFileNames
                        }
                    }
                }
            };
        },
        configResolved: function (resolvedConfig) {
            root = resolvedConfig.root;
        },
        buildStart: function () {
            return __awaiter(this, void 0, void 0, function () {
                var cwd_1, files;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(config === null || config === void 0 ? void 0 : config.copy)) return [3 /*break*/, 2];
                            cwd_1 = preserveModulesRoot ? path_1["default"].join(root, preserveModulesRoot) : root;
                            return [4 /*yield*/, (0, fast_glob_1["default"])(config.copy, { cwd: cwd_1 })];
                        case 1:
                            files = _a.sent();
                            files.forEach(function (file) {
                                _this.emitFile({
                                    type: 'asset',
                                    source: fs_1["default"].readFileSync(path_1["default"].join(cwd_1, file)),
                                    fileName: file
                                });
                            });
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        },
        resolveId: function (source, importer, options) {
            return __awaiter(this, void 0, void 0, function () {
                var id, absolutePath, relativePath;
                return __generator(this, function (_a) {
                    id = source.split('?')[0];
                    if (options.isEntry)
                        return [2 /*return*/, null];
                    if (!importer)
                        return [2 /*return*/, null];
                    if (isInternal(id))
                        return [2 /*return*/, null];
                    if (isNodeModule(id))
                        return [2 /*return*/, { id: id, external: true }];
                    absolutePath = path_1["default"].isAbsolute(id)
                        ? path_1["default"].join(root, id)
                        : path_1["default"].join(path_1["default"].dirname(importer), id);
                    relativePath = path_1["default"].relative(root, absolutePath);
                    // Mark the source as external and with side effects if it matches a glob pattern,
                    // excluding it from the build. The file is then emitted manually in buildStart.
                    if (isCopyTarget(relativePath)) {
                        return [2 /*return*/, {
                                // Enforce relative path to avoid issues with preserveModulesRoot
                                id: path_1["default"].isAbsolute(id) ? path_1["default"].relative(path_1["default"].dirname(importer), absolutePath) : id,
                                external: true,
                                moduleSideEffects: true
                            }];
                    }
                    return [2 /*return*/, null];
                });
            });
        }
    };
}
exports["default"] = plugin;
