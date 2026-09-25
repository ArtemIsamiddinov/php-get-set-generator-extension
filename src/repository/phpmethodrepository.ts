import { PhpClassInterface } from "../interface/phpclassinterface";
import { PhpMethodInterface } from "../interface/phpmethodinterface";
import { PhpMethodParserInterface } from "../interface/phpmethodparserinterface";

export class PhpMethodRepository
{
    #parser: PhpMethodParserInterface;

    constructor (parser: PhpMethodParserInterface)
    {
        this.#parser = parser;
    }

    all(phpclass: PhpClassInterface): Map<string, PhpMethodInterface>
    {
        return this.#parser.parse(phpclass).all();
    }
}
