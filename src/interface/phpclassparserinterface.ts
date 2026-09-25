import { TextDocument } from "vscode";
import { PhpClassInterface } from "./phpclassinterface";

export interface PhpClassParserInterface
{
    getDocument(): TextDocument;

    parse(): PhpClassParserInterface;

    all(): Map<string, PhpClassInterface>;
}