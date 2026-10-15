import { Visibility } from "../enums/visibility";
import { Position } from "vscode";
import { Positionable } from "./positionable";

export interface PhpPropertyInterface extends Positionable
{
    getName(): string;

    setName(name: string): PhpPropertyInterface;

    isAbstract(): boolean;

    setAbstract(isAbstract: boolean): PhpPropertyInterface;

    isStatic(): boolean;

    setStatic(isStatic: boolean): PhpPropertyInterface;

    isReadonly(): boolean;

    setReadonly(isReadonly: boolean): PhpPropertyInterface;

    isFinal(): boolean;

    setFinal(isFinal: boolean): PhpPropertyInterface;

    getVisibility(): Visibility;

    setVisibility(visibility: Visibility): PhpPropertyInterface;

    setPositionFrom(position: Position): PhpPropertyInterface;

    setPositionTo(position: Position): PhpPropertyInterface;

    getTypes(): string[];

    setTypes(types: string[]): PhpPropertyInterface;
}
