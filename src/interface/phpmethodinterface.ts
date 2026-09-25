import { Visibility } from "../enums/visibility";
import { Position } from "vscode";

export interface PhpMethodInterface
{
    getName(): string;

    setName(name: string): PhpMethodInterface;

    getVisibility(): Visibility;

    setVisibility(visibility: Visibility): PhpMethodInterface;

    isAbstract(): boolean;

    setAbstract(isAbstract: boolean): PhpMethodInterface;

    isFinal(): boolean;

    setFinal(isFinal: boolean): PhpMethodInterface;

    isStatic(): boolean;

    setStatic(isStatic: boolean): PhpMethodInterface;

    getPositionFrom(): Position;

    setPositionFrom(position: Position): PhpMethodInterface;

    getPositionTo(): Position;

    setPositionTo(position: Position): PhpMethodInterface;
}
