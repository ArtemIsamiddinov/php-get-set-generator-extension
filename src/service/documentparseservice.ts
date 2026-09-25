import { PhpClassRepository } from "../repository/phpclassrepository";
import { PhpClassParser } from '../parser/phpclassparser';
import { PhpClassInterface } from '../interface/phpclassinterface';
import { PhpMethodRepository } from '../repository/phpmethodrepository';
import { PhpMethodParser } from '../parser/phpmethodparser';
import { PhpPropertyParser } from '../parser/phppropertyparser';
import { PhpPropertyRepository } from '../repository/phppropertyrepository';
import { TextDocument } from "vscode";

export class DocumentParseService {
    #document: TextDocument;

    constructor(document: TextDocument) {
        this.#document = document;
    }

    parse(): Map<string, PhpClassInterface> {
        const phpClassParser = new PhpClassParser(this.#document);
        const phpClassRepository = new PhpClassRepository(phpClassParser);

        const phpMethodParser = new PhpMethodParser(this.#document);
        const phpMethodRepository = new PhpMethodRepository(phpMethodParser);

        const phpClasses = phpClassRepository.all();
        phpClasses.forEach((phpClass: PhpClassInterface, className: string): void => {
            phpClass.setMethods(phpMethodRepository.all(phpClass));
        });

        const phpPropertyParser = new PhpPropertyParser(this.#document);
        const phpPropertyRepository = new PhpPropertyRepository(phpPropertyParser);

        phpClasses.forEach((phpClass: PhpClassInterface, className: string): void => {
            phpClass.setProperties(phpPropertyRepository.all(phpClass));
        });

        return phpClasses;
    }
}