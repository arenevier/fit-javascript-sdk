/////////////////////////////////////////////////////////////////////////////////////////////
// Copyright 2023 Garmin International, Inc.
// Licensed under the Flexible and Interoperable Data Transfer (FIT) Protocol License; you
// may not use this file except in compliance with the Flexible and Interoperable Data
// Transfer (FIT) Protocol License.
/////////////////////////////////////////////////////////////////////////////////////////////
// ****WARNING****  This file is auto-generated!  Do NOT edit this file.
// Profile Version = 21.126.0Release
// Tag = production/release/21.126.0-0-g0576dfe
/////////////////////////////////////////////////////////////////////////////////////////////


import FIT from "./fit.js";

class BitStream {
    #array = null;
    #currentArrayPosition = 0;
    #bitPerPosition = 0;
    #currentByte = 0;
    #currentBit = 0;
    #bitsAvailable = 0;

    constructor(data, baseType = FIT.BaseType.UINT8) {
        this.#array = Array.isArray(data) ? data : [data];
        const baseTypeSize = FIT.BaseTypeDefinitions[baseType].size;
        this.#bitPerPosition = baseTypeSize * 8;
        this.reset();
    }

    get bitsAvailable() {
        return this.#bitsAvailable;
    }

    get hasBitsAvailable() {
        return this.#bitsAvailable > 0;
    }

    reset() {
        this.#currentArrayPosition = 0;
        this.#bitsAvailable = this.#bitPerPosition * this.#array.length;
        this.#nextByte();
    }

    readBit() {
        if (!this.hasBitsAvailable) {
            this.#throwError();
        }

        if (this.#currentBit >= this.#bitPerPosition) {
            this.#nextByte();
        }

        const bit = this.#currentByte & 0x01;
        this.#currentByte = this.#currentByte >> 1;
        this.#currentBit++;
        this.#bitsAvailable--;

        return bit;
    }

    readBits(nBitsToRead) {
        let value = 0n;

        for (let i = 0n; i < nBitsToRead; i++) {
            value |= BigInt(this.readBit()) << i;
        }

        return Number(value);
    }

    #nextByte() {
        if (this.#currentArrayPosition >= this.#array.length) {
            this.#throwError();
        }

        this.#currentByte = this.#array[this.#currentArrayPosition++];
        this.#currentBit = 0;
    }

    #throwError(error = "") {
        throw Error("FIT Runtime Error no bits available.");
    }
}

export default BitStream;
