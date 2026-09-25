import { PhpClassType } from "../enums/phpclasstype";
import { Position } from "vscode";
import { PhpMethodInterface } from "./phpmethodinterface";
import { PhpPropertyInterface } from "./phppropertyinterface";

export interface PhpClassInterface
{
    setName(name: string): PhpClassInterface;

    setAbstract(isAbstract: boolean): PhpClassInterface;

    setFinal(isFinal: boolean): PhpClassInterface;

    setReadonly(isReadonly: boolean): PhpClassInterface;

    setType(type: PhpClassType): PhpClassInterface;

    setPositionFrom(position: Position): PhpClassInterface;

    setPositionTo(position: Position): PhpClassInterface;

    getName(): string;

    isAbstract(): boolean;

    isFinal(): boolean;

    isReadonly(): boolean;

    getType(): PhpClassType;

    getPositionFrom(): Position;

    getPositionTo(): Position;

    getMethods(): Map<string, PhpMethodInterface>;

    setMethods(methods: Map<string, PhpMethodInterface>): PhpClassInterface;

    getProperties(): Map<string, PhpPropertyInterface>;

    setProperties(properties: Map<string, PhpPropertyInterface>): PhpClassInterface;
}