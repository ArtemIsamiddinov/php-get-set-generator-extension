import { TextDocument, Range } from "vscode";
import { PhpMethodParserInterface } from "../interface/phpmethodparserinterface";
import { PhpClassInterface } from "../interface/phpclassinterface";
import { PhpMethodInterface } from "../interface/phpmethodinterface";
import { PhpMethod } from "../entity/phpmethod";
import { PhpClassType } from "../enums/phpclasstype";

export class PhpMethodParser implements PhpMethodParserInterface {
    #document: TextDocument;
    #phpMethods: Map<string, PhpMethodInterface> = new Map;

    constructor(document: TextDocument) {
        this.#document = document;
    }

    getDocument(): TextDocument {
        return this.#document;
    }

    parse(phpClass: PhpClassInterface): PhpMethodParserInterface {
        this.#phpMethods = new Map;

        const positionTo = phpClass.getPositionTo().translate(0, 1);
        const text = this.#document.getText(new Range(phpClass.getPositionFrom(), positionTo));

        let phpMethods = this.#find(text, phpClass);
        this.#phpMethods = this.#findPositionsTo(phpMethods, phpClass);

        return this;
    }

    #findPositionsTo(methods: Array<PhpMethodInterface>, phpClass: PhpClassInterface): Map<string, PhpMethodInterface> {
        let phpMethods = this.#sortByPositionFrom(methods);
        let result = new Map();
        const length = phpMethods.length;

        for (let i = 0; i < length; i++) {
            const current = phpMethods[i];
            let positionTo = phpClass.getPositionTo().with();
            let next = null;
            if ((i + 1) < length) {
                next = phpMethods[i + 1];
                positionTo = next.getPositionFrom().with();
            }

            const text = this.#document.getText(new Range(current.getPositionFrom(), positionTo));
            let end = -1;
            if (phpClass.getType() === PhpClassType.interface) {
                end = text.lastIndexOf(';');
            }
            else {
                if (current.isAbstract()) {
                    end = text.lastIndexOf(';');
                }
                else {
                    end = text.lastIndexOf('}');
                }
            }

            if (end === -1) {
                let offset = this.#document.offsetAt(phpClass.getPositionTo()) - 1;
                if (next !== null) {
                    offset = this.#document.offsetAt(next.getPositionFrom()) - 1;
                }

                current.setPositionTo(this.#document.positionAt(offset));
            }
            else {
                current.setPositionTo(
                    this.#document.positionAt(this.#document.offsetAt(current.getPositionFrom()) + end)
                );
            }
            result.set(current.getName(), current);
        }

        return result;
    }

    #sortByPositionFrom(methods: Array<PhpMethodInterface>): Array<PhpMethodInterface> {

        methods.sort(
            function (a: PhpMethodInterface, b: PhpMethodInterface): number {
                const lineA = a.getPositionFrom().line;
                const lineB = b.getPositionFrom().line;
                if (lineA === lineB) {
                    const charA = a.getPositionFrom().character;
                    const charB = b.getPositionFrom().character;
                    if (charA === charB) {
                        return 0;
                    }
                    return charA > charB ? 1 : -1;
                }
                return lineA > lineB ? 1 : -1;
            }
        );

        return methods;
    }

    #find(text: string, phpClass: PhpClassInterface): Array<PhpMethodInterface> {
        let phpMethods = [];
        const regex = new RegExp(
            "(?:(?<beginning>abstract|public|private|protected|final|static)\\s)?" +
            "(?:(?<secondBeginning>abstract|public|private|protected|final|static)\\s)?" +
            "(?<methodBeginning>function)\\s(?:(?<name>[a-zA-Z0-9_]+)\\s?)(\\(|\\;)",
            'gd'
        );

        const positionFrom = phpClass.getPositionFrom().with();
        let match;
        while ((match = regex.exec(text)) !== null) {
            const beginningIndices = match?.indices?.groups ? match.indices.groups['beginning'] : null;
            const secondBeginningIndices = match?.indices?.groups ? match.indices.groups['secondBeginning'] : null;
            const methodBeginningIndices = match?.indices?.groups ? match.indices.groups['methodBeginning'] : null;

            let position = null;

            if (beginningIndices) {
                position = this.#document.positionAt(beginningIndices[0]);
            } else if (secondBeginningIndices) {
                position = this.#document.positionAt(secondBeginningIndices[0]);
            } else if (methodBeginningIndices) {
                position = this.#document.positionAt(methodBeginningIndices[0]);
            } else {
                continue;
            }

            const name = match?.groups?.['name'];
            if (!name) {
                continue;
            }

            let matchLower = match[0].replace(`${name}`, '').toLowerCase();

            const globalIndex = this.#document.offsetAt(positionFrom) + match.index;
            const methodPosition = this.#document.positionAt(globalIndex);

            const phpMethod = new PhpMethod(name);
            phpMethod
                .setPositionFrom(methodPosition)
                .setAbstract(matchLower.includes('abstract'))
                .setFinal(matchLower.includes('final'))
                .setStatic(matchLower.includes('static'));

            phpMethods.push(phpMethod);
        }

        return phpMethods;
    }

    all(): Map<string, PhpMethodInterface> {
        return this.#phpMethods;
    }
}
