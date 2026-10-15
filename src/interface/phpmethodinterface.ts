import { Visibility } from "../enums/visibility";
import { Position } from "vscode";
import { Positionable } from "./positionable";

export interface PhpMethodInterface extends Positionable
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

    setPositionFrom(position: Position): PhpMethodInterface;

    setPositionTo(position: Position): PhpMethodInterface;
}
