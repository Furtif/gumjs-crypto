import { Buffer } from "buffer";

export default {
    createHash,
}

export function createHash(type: ChecksumType): Hash {
    return new Hash(new Checksum(type));
}

export class Hash {
    checksum: Checksum;

    constructor(checksum: Checksum) {
        this.checksum = checksum;
    }

    update(data: string | ArrayBufferView, inputEncoding?: BufferEncoding): Hash {
        this.checksum.update(toChecksumData(data, inputEncoding));
        return this;
    }

    digest(encoding: BinaryToTextEncoding = "binary"): Buffer | string {
        if (encoding === "hex")
            return this.checksum.getString();

        const rawDigest = Buffer.from(this.checksum.getDigest());
        if (encoding === "binary")
            return rawDigest;

        return rawDigest.toString(encoding);
    }

    copy(): Hash {
        throw new Error("copy() not yet supported");
    }
}

function toChecksumData(data: string | ArrayBufferView, inputEncoding?: BufferEncoding): string | ArrayBuffer {
    if (typeof data !== "string")
        return viewToArrayBuffer(data);

    if (inputEncoding === undefined)
        return data;

    return viewToArrayBuffer(Buffer.from(data, inputEncoding));
}

function viewToArrayBuffer(view: ArrayBufferView): ArrayBuffer {
    return view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength) as ArrayBuffer;
}

type BinaryToTextEncoding = "binary" | "base64" | "base64url" | "hex";
