import { TextDocument } from "vscode";
import { PhpMethodInterface } from "./phpmethodinterface";
import { PhpClassInterface } from "./phpclassinterface";

export interface PhpMethodParserInterface
{
    getDocument(): TextDocument;

    parse(phpclass: PhpClassInterface): PhpMethodParserInterface;

    all(): Map<string, PhpMethodInterface>;
}