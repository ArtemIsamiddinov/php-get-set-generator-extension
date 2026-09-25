import { Visibility } from "../enums/visibility";
import { PhpPropertyInterface } from "../interface/phppropertyinterface";
import { Position } from "vscode";
import { NullPosition } from "../nullobject/nullposition";
import { PhpType } from "../enums/phptype";

export class PhpProperty implements PhpPropertyInterface {
    #name: string;
    #abstract: boolean = false;
    #static: boolean = false;
    #readonly: boolean = false;
    #final: boolean = false;
    #visibility: Visibility = Visibility.public;
    #positionFrom: Position;
    #positionTo: Position = new NullPosition;
    #types: string[] = [];

    constructor(name: string, positionFrom: Position) {
        this.#name = name;
        this.#positionFrom = positionFrom;
    }

    getName(): string {
        return this.#name;
    }

    setName(name: string): PhpPropertyInterface {
        this.#name = name;
        return this;
    }

    isAbstract(): boolean {
        return this.#abstract;
    }

    setAbstract(isAbstract: boolean): PhpPropertyInterface {
        this.#abstract = isAbstract;
        return this;
    }

    isStatic(): boolean {
        return this.#static;
    }

    setStatic(isStatic: boolean): PhpPropertyInterface {
        this.#static = isStatic;
        return this;
    }

    isReadonly(): boolean {
        return this.#readonly;
    }

    setReadonly(isReadonly: boolean): PhpPropertyInterface {
        this.#readonly = isReadonly;
        return this;
    }

    isFinal(): boolean {
        return this.#final;
    }

    setFinal(isFinal: boolean): PhpPropertyInterface {
        this.#final = isFinal;
        return this;
    }

    getVisibility(): Visibility {
        return this.#visibility;
    }

    setVisibility(visibility: Visibility): PhpPropertyInterface {
        this.#visibility = visibility;
        return this;
    }

    getPositionFrom(): Position {
        return this.#positionFrom;
    }

    setPositionFrom(position: Position): PhpPropertyInterface {
        this.#positionFrom = position;
        return this;
    }

    getPositionTo(): Position {
        return this.#positionTo;
    }

    setPositionTo(position: Position): PhpPropertyInterface {
        this.#positionTo= position;
        return this;
    }

    getTypes(): string[] {
        return this.#types;
    }

    setTypes(types: string[]): PhpPropertyInterface {
        this.#types = types;
        return this;
    }
}