import { PhpPropertyParserInterface } from "../interface/phppropertyparserinterface";
import { PhpClassInterface } from "../interface/phpclassinterface";
import { TextDocument, Range, Position } from "vscode";
import { PhpPropertyInterface } from "../interface/phppropertyinterface";
import { PhpClassType } from "../enums/phpclasstype";
import { PhpMethodInterface } from "../interface/phpmethodinterface";
import { PhpProperty } from "../entity/phpproperty";
import { Visibility } from "../enums/visibility";

export class PhpPropertyParser implements PhpPropertyParserInterface {
    #document: TextDocument;
    #phpProperties: Map<string, PhpPropertyInterface> = new Map;

    constructor(document: TextDocument) {
        this.#document = document;
    }

    getDocument(): TextDocument {
        return this.#document;
    }

    parse(phpClass: PhpClassInterface): PhpPropertyParserInterface {
        this.#phpProperties = new Map;

        const positionTo = phpClass.getPositionTo().translate(0, 1);
        const text = this.#document.getText(new Range(phpClass.getPositionFrom(), positionTo));

        this.#find(text, phpClass).forEach((phpProperty: PhpPropertyInterface) => {
            this.#phpProperties.set(phpProperty.getName(), phpProperty);
        });

        return this;
    }

    all(): Map<string, PhpPropertyInterface> {
        return this.#phpProperties;
    }

    #find(text: string, phpClass: PhpClassInterface): PhpPropertyInterface[] {
        let phpProperties: PhpPropertyInterface[] = [];

        if ([PhpClassType.interface, PhpClassType.enum].includes(phpClass.getType())) {
            return phpProperties;
        }

        const regexp: RegExp = new RegExp(
            '(?<beginning>var|public|protected|private|readonly|static|final)' +
            '[\\s\\S]*?\\$(?<name>[a-zA-Z0-9_\\-]+)[\\s\\S]*?;',
            'gd'
        );
        const phpMethods: Array<PhpMethodInterface> = [...phpClass.getMethods().values()];
        const globalOffset = this.#document.offsetAt(phpClass.getPositionFrom());

        let match;
        while ((match = regexp.exec(text))) {
            const beginningIndices = match?.indices?.groups ? match.indices.groups['beginning'] : null;
            if (!beginningIndices) {
                continue;
            }
            const positionFrom = this.#document.positionAt(beginningIndices[0] + globalOffset);

            if (this.#isInsideMethods(positionFrom, phpMethods)) {
                continue;
            }

            const name = match?.groups?.['name']!;
            const phpProperty = new PhpProperty(name, positionFrom);
            
            const nameIndices = match?.indices?.groups ? match.indices.groups['name'] : null;
            phpProperty.setPositionTo(this.#document.positionAt(nameIndices![0] + globalOffset + name.length));

            let propMatch = match[0].replace(/\$[a-zA-Z-_0-9]+[\S\s]*?;$/, '');

            this.#solveStatic(propMatch, phpProperty);
            this.#solveReadonly(propMatch, phpProperty);
            this.#solveFinal(propMatch, phpProperty);
            this.#solveVisibility(propMatch, phpProperty);
            this.#solveTypes(propMatch, phpProperty);

            phpProperties.push(phpProperty);
        }

        if (phpClass.getMethods().has('__construct')) {
            phpProperties = phpProperties.concat(this.#findInConstructor(phpClass));
        }
        return phpProperties;
    }

    #isInsideMethods(positionFrom: Position, phpMethods: Array<PhpMethodInterface>): boolean {
        return phpMethods.filter(
            (phpMethod: PhpMethodInterface): boolean =>
                phpMethod.getPositionFrom().isBeforeOrEqual(positionFrom) &&
                phpMethod.getPositionTo().isAfterOrEqual(positionFrom)
        ).length > 0;
    }

    #solveStatic(propMatch: string, phpProperty: PhpPropertyInterface) {
        if (/readonly\s/.exec(propMatch)) {
            phpProperty.setReadonly(true);
            propMatch = propMatch.replace(/readonly\s/, '');
        }
    }

    #solveReadonly(propMatch: string, phpProperty: PhpPropertyInterface) {
        if (/static\s/.exec(propMatch)) {
            phpProperty.setStatic(true);
            propMatch = propMatch.replace(/static\s/, '');
        }
    }

    #solveFinal(propMatch: string, phpProperty: PhpPropertyInterface) {
        if (/final\s/.exec(propMatch)) {
            phpProperty.setFinal(true);
            propMatch = propMatch.replace(/final\s/, '');
        }
    }

    #solveVisibility(propMatch: string, phpProperty: PhpPropertyInterface) {
        let visibilityMatch;
        if ((visibilityMatch = /(?<visibility>public|protected|private)\s/.exec(propMatch))) {
            const visibiliy: Visibility = visibilityMatch?.groups?.['visibility']! as Visibility;
            phpProperty.setVisibility(visibiliy);
            propMatch = propMatch.replace(new RegExp(visibiliy + '\\s', 'g'), '');
        }
    }

    #solveTypes(propMatch: string, phpProperty: PhpPropertyInterface) {
        let types: Array<string> = propMatch.trim() !== 'var' ? propMatch.trim().split('|') : [];
        if (types.length > 0) {
            const cleanTypes: string[] = types.reduce((acc: string[], type: string) => {
                if (type.startsWith('?')) {
                    acc.push(type.replace('?', ''), 'null');
                } else {
                    acc.push(type);
                }
                return acc;
            }, []);

            phpProperty.setTypes(cleanTypes);
        }
    }

    #findInConstructor(phpClass: PhpClassInterface): PhpPropertyInterface[] {
        let phpProperties: PhpPropertyInterface[] = [];
        const regex: RegExp = new RegExp(
            '(?:(?<visibility>public|protected|private)\\s?)' +
            '(?:(?<readonly>readonly)\\s?)?' +
            '(?:(?<type>[a-zA-Z0-9_\\|\\\\]+)\\s?)?' +
            '\\$(?<name>[a-zA-Z0-9_]+)', 'gd'
        );
        const constructor: PhpMethodInterface = phpClass.getMethods().get('__construct')!;
        const text = this.#document.getText(new Range(constructor.getPositionFrom(), constructor.getPositionTo()));
        const globalOffset = this.#document.offsetAt(constructor.getPositionFrom());
        let match;
        while ((match = regex.exec(text))) {
            const visibilityIndices = match?.indices?.groups ? match.indices.groups['visibility'] : null;
            if (!visibilityIndices) {
                continue;
            }

            const name = match?.groups?.['name'];
            if (!name) {
                continue;
            }

            const phpProperty = new PhpProperty(name, this.#document.positionAt(visibilityIndices[0] + globalOffset));

            const nameIndices = match?.indices?.groups ? match.indices.groups['name'] : null;
            phpProperty.setPositionTo(this.#document.positionAt(nameIndices![0] + globalOffset + name.length));

            const readonly = match?.groups?.['readonly'];
            if (!!readonly) {
                phpProperty.setReadonly(true);
            }
            const visibility: Visibility = match?.groups?.['visibility'] as Visibility;
            phpProperty.setVisibility(visibility);

            const types = match?.groups?.['type'];
            if (!!types) {
                phpProperty.setTypes(types.split('|'));
            }

            phpProperties.push(phpProperty);
        }
        return phpProperties;
    }
}
