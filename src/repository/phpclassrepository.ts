import { PhpClassInterface } from "../interface/phpclassinterface";
import { PhpClassParserInterface } from "../interface/phpclassparserinterface";

export class PhpClassRepository
{
    #parser: PhpClassParserInterface;

    constructor(parser: PhpClassParserInterface)
    {
        this.#parser = parser;
    }

    all(): Map<string, PhpClassInterface>
    {
        return this.#parser.parse().all();
    }
}
