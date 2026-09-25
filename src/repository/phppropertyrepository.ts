import { PhpClassInterface } from "../interface/phpclassinterface";
import { PhpPropertyInterface } from "../interface/phppropertyinterface";
import { PhpPropertyParserInterface } from "../interface/phppropertyparserinterface";

export class PhpPropertyRepository
{
    #parser: PhpPropertyParserInterface;

    constructor (parser: PhpPropertyParserInterface)
    {
        this.#parser = parser;
    }

    all(phpClass: PhpClassInterface): Map<string, PhpPropertyInterface>
    {
        return this.#parser.parse(phpClass).all();
    }
}
