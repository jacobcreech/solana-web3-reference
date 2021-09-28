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
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeMetadata = exports.getMetadataAccount = exports.MetadataKey = exports.METADATA_PREFIX = exports.METADATA_PROGRAM_ID = void 0;
var borsh_1 = require("borsh");
var web3_js_1 = require("@solana/web3.js");
var bs58_1 = __importDefault(require("bs58"));
exports.METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
exports.METADATA_PREFIX = "metadata";
var PubKeysInternedMap = new Map();
// Borsh extension for pubkey stuff
borsh_1.BinaryReader.prototype.readPubkey = function () {
    var reader = this;
    var array = reader.readFixedArray(32);
    return new web3_js_1.PublicKey(array);
};
borsh_1.BinaryWriter.prototype.writePubkey = function (value) {
    var writer = this;
    writer.writeFixedArray(value.toBuffer());
};
borsh_1.BinaryReader.prototype.readPubkeyAsString = function () {
    var reader = this;
    var array = reader.readFixedArray(32);
    return bs58_1.default.encode(array);
};
borsh_1.BinaryWriter.prototype.writePubkeyAsString = function (value) {
    var writer = this;
    writer.writeFixedArray(bs58_1.default.decode(value));
};
var toPublicKey = function (key) {
    if (typeof key !== "string") {
        return key;
    }
    var result = PubKeysInternedMap.get(key);
    if (!result) {
        result = new web3_js_1.PublicKey(key);
        PubKeysInternedMap.set(key, result);
    }
    return result;
};
var findProgramAddress = function (seeds, programId) { return __awaiter(void 0, void 0, void 0, function () {
    var key, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = "pda-" +
                    seeds.reduce(function (agg, item) { return agg + item.toString("hex"); }, "") +
                    programId.toString();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress(seeds, programId)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, [result[0].toBase58(), result[1]]];
        }
    });
}); };
var MetadataKey;
(function (MetadataKey) {
    MetadataKey[MetadataKey["Uninitialized"] = 0] = "Uninitialized";
    MetadataKey[MetadataKey["MetadataV1"] = 4] = "MetadataV1";
    MetadataKey[MetadataKey["EditionV1"] = 1] = "EditionV1";
    MetadataKey[MetadataKey["MasterEditionV1"] = 2] = "MasterEditionV1";
    MetadataKey[MetadataKey["MasterEditionV2"] = 6] = "MasterEditionV2";
    MetadataKey[MetadataKey["EditionMarker"] = 7] = "EditionMarker";
})(MetadataKey = exports.MetadataKey || (exports.MetadataKey = {}));
var Creator = /** @class */ (function () {
    function Creator(args) {
        this.address = args.address;
        this.verified = args.verified;
        this.share = args.share;
    }
    return Creator;
}());
var Data = /** @class */ (function () {
    function Data(args) {
        this.name = args.name;
        this.symbol = args.symbol;
        this.uri = args.uri;
        this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
        this.creators = args.creators;
    }
    return Data;
}());
var Metadata = /** @class */ (function () {
    function Metadata(args) {
        this.key = MetadataKey.MetadataV1;
        this.updateAuthority = args.updateAuthority;
        this.mint = args.mint;
        this.data = args.data;
        this.primarySaleHappened = args.primarySaleHappened;
        this.isMutable = args.isMutable;
        this.editionNonce = args.editionNonce;
    }
    return Metadata;
}());
var METADATA_SCHEMA = new Map([
    [
        Data,
        {
            kind: "struct",
            fields: [
                ["name", "string"],
                ["symbol", "string"],
                ["uri", "string"],
                ["sellerFeeBasisPoints", "u16"],
                ["creators", { kind: "option", type: [Creator] }],
            ],
        },
    ],
    [
        Creator,
        {
            kind: "struct",
            fields: [
                ["address", "pubkeyAsString"],
                ["verified", "u8"],
                ["share", "u8"],
            ],
        },
    ],
    [
        Metadata,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["updateAuthority", "pubkeyAsString"],
                ["mint", "pubkeyAsString"],
                ["data", Data],
                ["primarySaleHappened", "u8"],
                ["isMutable", "u8"], // bool
            ],
        },
    ],
]);
function getMetadataAccount(tokenMint) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findProgramAddress([
                        Buffer.from(exports.METADATA_PREFIX),
                        toPublicKey(exports.METADATA_PROGRAM_ID).toBuffer(),
                        toPublicKey(tokenMint).toBuffer(),
                    ], toPublicKey(exports.METADATA_PROGRAM_ID))];
                case 1: return [2 /*return*/, (_a.sent())[0]];
            }
        });
    });
}
exports.getMetadataAccount = getMetadataAccount;
var METADATA_REPLACE = new RegExp("\u0000", "g");
var decodeMetadata = function (buffer) {
    try {
        var metadata = (0, borsh_1.deserializeUnchecked)(METADATA_SCHEMA, Metadata, buffer);
        metadata.data.name = metadata.data.name.replace(METADATA_REPLACE, "");
        metadata.data.uri = metadata.data.uri.replace(METADATA_REPLACE, "");
        metadata.data.symbol = metadata.data.symbol.replace(METADATA_REPLACE, "");
        return metadata;
    }
    catch (e) {
        console.log(e);
    }
};
exports.decodeMetadata = decodeMetadata;
