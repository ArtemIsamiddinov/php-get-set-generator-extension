import { PhpMethodInterface } from "../interface/phpmethodinterface";
import { Visibility } from "../enums/visibility";
import { Position } from "vscode";
import { NullPosition } from "../nullobject/nullposition";

export class PhpMethod implements PhpMethodInterface {
    #name: string;
    #visibility: Visibility = Visibility.public;
    #abstract: boolean = false;
    #final: boolean = false;
    #static: boolean = false;
    #positionFrom: Position;
    #positionTo: Position;

    constructor(name: string) {
        this.#name = name;
        this.#positionFrom = new NullPosition;
        this.#positionTo = new NullPosition;
    }

    getName(): string {
        return this.#name;
    }

    setName(name: string): PhpMethodInterface {
        this.#name = name;
        return this;
    }

    getVisibility(): Visibility {
        return this.#visibility;
    }

    setVisibility(visibility: Visibility): PhpMethodInterface {
        this.#visibility = visibility;
        return this;
    }

    isAbstract(): boolean {
        return this.#abstract;
    }

    setAbstract(isAbstract: boolean): PhpMethodInterface {
        this.#abstract = isAbstract;
        return this;
    }

    isFinal(): boolean {
        return this.#final;
    }

    setFinal(isFinal: boolean): PhpMethodInterface {
        this.#final = isFinal;
        return this;
    }

    isStatic(): boolean {
        return this.#static;
    }

    setStatic(isStatic: boolean): PhpMethodInterface {
        this.#static = isStatic;
        return this;
    }

    getPositionFrom(): Position {
        return this.#positionFrom;
    }

    setPositionFrom(position: Position): PhpMethodInterface {
        this.#positionFrom = position;
        return this;
    }

    getPositionTo(): Position {
        return this.#positionTo;
    }

    setPositionTo(position: Position): PhpMethodInterface {
        this.#positionTo = position;
        return this;
    }
}