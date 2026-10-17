import { test, expect, describe } from "@frida/injest/agent";
import { Buffer } from "buffer";

import crypto from "../index.js";

const helloWorldSha =
    "309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f"
    + "989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f";
const helloWorldShaBase64 =
    "MJ7MSJwS1utMxA9QyQLytNDtd+5RGnx6m808qG1M2G+YndNbxf9JlnDaNCVbRbDP2DDoH2Bdz33FVC6TrpzXbw==";

const helloBytes = [0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64];

function digestOfBytes(bytes: ArrayBufferView) {
    return crypto.createHash("sha512").update(bytes).digest("hex");
}

function helloSha512() {
    const hash = crypto.createHash("sha512");
    hash.update("hello world");
    return hash;
}

describe("createHash", () => {
    test("digest as hex", () => {
        expect(helloSha512().digest("hex")).toBe(helloWorldSha);
    });

    test("digest as base64", () => {
        expect(helloSha512().digest("base64")).toBe(helloWorldShaBase64);
    });

    test("digest defaults to a Buffer", () => {
        expect(helloSha512().digest() instanceof Buffer).toBeTruthy();
    });

    test("update changes the digest", () => {
        const hash = helloSha512();
        hash.update("hello world");
        expect(hash.digest("hex")).not.toBe(helloWorldSha);
    });

    test("update after digest throws", () => {
        const hash = helloSha512();
        hash.digest("hex");
        expect(() => hash.update("hello world")).toThrow();
    });

    test("update with a Buffer", () => {
        expect(digestOfBytes(Buffer.from(helloBytes))).toBe(helloWorldSha);
    });

    test("update with a Uint8Array", () => {
        expect(digestOfBytes(new Uint8Array(helloBytes))).toBe(helloWorldSha);
    });

    test("update with a DataView", () => {
        const view = new DataView(new Uint8Array(helloBytes).buffer);
        expect(digestOfBytes(view)).toBe(helloWorldSha);
    });

    test("update with a view into a larger buffer", () => {
        const backing = new Uint8Array([0xff, ...helloBytes, 0xff]);
        const view = new Uint8Array(backing.buffer, 1, helloBytes.length);
        expect(digestOfBytes(view)).toBe(helloWorldSha);
    });

    test("update with an input encoding", () => {
        const hash = crypto.createHash("sha512");
        hash.update("68656c6c6f20776f726c64", "hex");
        expect(hash.digest("hex")).toBe(helloWorldSha);
    });
});
