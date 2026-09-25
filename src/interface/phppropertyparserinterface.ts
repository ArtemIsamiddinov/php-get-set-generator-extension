import { TextDocument } from "vscode";
import { PhpPropertyInterface } from "./phppropertyinterface";
import { PhpClassInterface } from "./phpclassinterface";

export interface PhpPropertyParserInterface
{
    getDocument(): TextDocument;

    parse(phpclass: PhpClassInterface): PhpPropertyParserInterface;

    all(): Map<string, PhpPropertyInterface>;
}