import { PhpClassType } from "../enums/phpclasstype";
import { PhpClassInterface } from "../interface/phpclassinterface";
import { Position } from "vscode";
import { NullPosition } from "../nullobject/nullposition";
import { PhpMethodInterface } from "../interface/phpmethodinterface";
import { PhpPropertyInterface } from "../interface/phppropertyinterface";

export class PhpClass implements PhpClassInterface {
    #name: string;
    #abstract: boolean = false;
    #final: boolean = false;
    #readonly: boolean = false;
    #type: PhpClassType = PhpClassType.class;
    #positionFrom: Position;
    #positionTo: Position;
    #methods: Map<string, PhpMethodInterface> = new Map();
    #properties: Map<string, PhpPropertyInterface> = new Map();

    constructor(name: string)
    {
        this.#name = name;
        this.#positionFrom = new NullPosition;
        this.#positionTo = new NullPosition;
    }

    setName(name: string): PhpClassInterface
    {
        this.#name = name;
        return this;
    }

    setAbstract(isAbstract: boolean): PhpClassInterface
    {
        this.#abstract = isAbstract;
        return this;
    }

    setFinal(isFinal: boolean): PhpClassInterface
    {
        this.#final = isFinal;
        return this;
    }

    setReadonly(isReadonly: boolean): PhpClassInterface
    {
        this.#readonly = isReadonly;
        return this;
    }

    setType(type: PhpClassType): PhpClassInterface
    {
        this.#type = type;
        return this;
    }

    setPositionFrom(position: Position): PhpClassInterface
    {
        this.#positionFrom = position;
        return this;
    }

    setPositionTo(position: Position): PhpClassInterface
    {
        this.#positionTo = position;
        return this;
    }

    getName(): string
    {
        return this.#name;
    }

    isAbstract(): boolean
    {
        return this.#abstract;
    }

    isFinal(): boolean
    {
        return this.#final;
    }

    isReadonly(): boolean
    {
        return this.#readonly;
    }

    getType(): PhpClassType
    {
        return this.#type;
    }

    getPositionFrom(): Position
    {
        return this.#positionFrom;
    }

    getPositionTo(): Position
    {
        return this.#positionTo;
    }

    getMethods(): Map<string, PhpMethodInterface>
    {
        return this.#methods;
    }

    setMethods(methods: Map<string, PhpMethodInterface>): PhpClassInterface
    {
        this.#methods = methods;
        return this;
    }

    getProperties(): Map<string, PhpPropertyInterface> {
        return this.#properties;
    }

    setProperties(properties: Map<string, PhpPropertyInterface>): PhpClassInterface {
        this.#properties = properties;
        return this;
    }
}