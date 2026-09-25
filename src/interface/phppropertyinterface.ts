import { PhpType } from "../enums/phptype";
import { Visibility } from "../enums/visibility";
import { Position } from "vscode";

export interface PhpPropertyInterface
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

    getPositionFrom(): Position;

    setPositionFrom(position: Position): PhpPropertyInterface;

    getPositionTo(): Position;

    setPositionTo(position: Position): PhpPropertyInterface;

    getTypes(): string[];

    setTypes(types: string[]): PhpPropertyInterface;
}
