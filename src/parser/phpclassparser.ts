import { TextDocument, Range, Position } from "vscode";
import { PhpClassParserInterface } from "../interface/phpclassparserinterface";
import { PhpClassInterface } from "../interface/phpclassinterface";
import { PhpEnum } from "../entity/phpenum";
import { PhpEnumType } from "../enums/phpenumtype";
import { PhpClass } from "../entity/phpclass";
import { PhpClassType } from "../enums/phpclasstype";

export class PhpClassParser implements PhpClassParserInterface {
    #document: TextDocument;
    #phpClasses: Map<string, PhpClassInterface> = new Map;

    constructor(document: TextDocument) {
        this.#document = document;
    }

    getDocument(): TextDocument {
        return this.#document;
    }

    parse(): PhpClassParserInterface {
        let text = this.#document.getText();

        this.#findEnums(text);
        this.#findTraits(text);
        this.#findInterfaces(text);
        this.#findClasses(text);

        this.#findPositionTo();
        return this;
    }

    all(): Map<string, PhpClassInterface> {
        return this.#phpClasses;
    }

    #getSortedByPosition(): Array<PhpClassInterface> {
        let classes = [...this.#phpClasses.values()];

        classes.sort(
            function (a: PhpClassInterface, b: PhpClassInterface): number {
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

        return classes;
    }

    #findPositionTo(): void {
        let phpClasses = this.#getSortedByPosition();
        const lastLine = this.#document.lineAt(this.#document.lineCount - 1);
        const finalPosition = new Position(lastLine.text.length, lastLine.text.length);

        for (let i = 0; i < phpClasses.length; i++) {
            let current = phpClasses[i];
            let next = null;
            let positionTo = finalPosition.with();
            if ((i + 1) < phpClasses.length) {
                next = phpClasses[i + 1];
                positionTo = next.getPositionFrom();
            }

            const text = this.#document.getText(new Range(current.getPositionFrom(), positionTo));
            const closeBracketIndex = text.lastIndexOf('}');
            current.setPositionTo(
                this.#document.positionAt(
                    this.#document.offsetAt(current.getPositionFrom()) + closeBracketIndex
                )
            );
        }

        this.#phpClasses = new Map(
            phpClasses.map(
                (phpClass: PhpClassInterface): [string, PhpClassInterface] => [phpClass.getName(), phpClass]
            )
        );
    }

    #findEnums(text: string): void {
        let match;
        const regex: RegExp = /(?<beginning>enum)\s(?<name>[a-zA-Z0-9_]+)(?:\s?\:\s?(?<type>string|int))?\s?\{/gd;
        while ((match = regex.exec(text)) !== null) {
            const beginningIndices = match?.indices?.groups ? match.indices.groups['beginning'] : null;

            if (!beginningIndices) {
                continue;
            }

            const name = match?.groups?.['name'];
            if (!name) {
                continue;
            }

            let phpenum = new PhpEnum(name);
            phpenum.setPositionFrom(this.#document.positionAt(beginningIndices[0]));

            const type = match?.groups?.['type'];
            if (type) {
                const phpEnumType: PhpEnumType = type as PhpEnumType;
                phpenum.setEnumType(phpEnumType);
            }

            this.#phpClasses.set(phpenum.getName(), phpenum);

        }
    }

    #findTraits(text: string): void {
        const regex: RegExp = /(?<beginning>trait)\s(?<name>[a-zA-Z0-9_]+)\s?\{/gd;
        let match;
        while ((match = regex.exec(text)) !== null) {
            const beginningIndices = match?.indices?.groups ? match.indices.groups['beginning'] : null;

            if (!beginningIndices) {
                continue;
            }

            const name = match?.groups?.['name'];
            if (!name) {
                continue;
            }

            const phpTrait = new PhpClass(name);

            phpTrait.setType(PhpClassType.trait).setPositionFrom(this.#document.positionAt(beginningIndices[0]));

            this.#phpClasses.set(phpTrait.getName(), phpTrait);
        }
    }

    #findInterfaces(text: string): void {
        const regex: RegExp = /(?<beginning>interface)\s(?<name>[a-zA-Z0-9_]+)[\s\S]*?\{/gd;
        let match;
        while ((match = regex.exec(text)) !== null) {
            const beginningIndices = match?.indices?.groups ? match.indices.groups['beginning'] : null;

            if (!beginningIndices) {
                continue;
            }

            const name = match?.groups?.['name'];
            if (!name) {
                continue;
            }

            const phpInterface = new PhpClass(name);
            phpInterface
                .setType(PhpClassType.interface)
                .setPositionFrom(this.#document.positionAt(beginningIndices[0]));

            this.#phpClasses.set(phpInterface.getName(), phpInterface);
        }
    }

    #findClasses(text: string): void {
        const regex: RegExp = new RegExp(
            '(?:(?<beginning>readonly|final|abstract)\\s?)?' +
            '(?:(?<secondBeginning>readonly|final|abstract)\\s?)?' +
            '(?<classBeginning>class)\\s(?<name>[a-zA-Z0-9_]+)[\\s\\S]*?\\{',
            'gd'
        );
        let match;
        while ((match = regex.exec(text)) !== null) {
            const beginningIndices = match?.indices?.groups ? match.indices.groups['beginning'] : null;
            const secondBeginning = match?.indices?.groups ? match.indices.groups['secondBeginning'] : null;
            const classBeginningIndices = match?.indices?.groups ? match.indices.groups['classBeginning'] : null;

            let position = null;

            if (beginningIndices) {
                position = this.#document.positionAt(beginningIndices[0]);
            } else if (secondBeginning) {
                position = this.#document.positionAt(secondBeginning[0]);
            } else if (classBeginningIndices) {
                position = this.#document.positionAt(classBeginningIndices[0]);
            } else {
                continue;
            }

            const name = match?.groups?.['name'];
            if (!name) {
                continue;
            }

            let matchLower = match[0].toLowerCase();

            const phpClass = new PhpClass(name);
            phpClass
                .setPositionFrom(position)
                .setAbstract(matchLower.includes('abstract'))
                .setFinal(matchLower.includes('final'))
                .setReadonly(matchLower.includes('readonly'));

            this.#phpClasses.set(phpClass.getName(), phpClass);
        }
    }
}