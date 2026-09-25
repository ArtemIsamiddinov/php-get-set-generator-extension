import { PhpClassType } from "../enums/phpclasstype";
import { PhpEnumType } from "../enums/phpenumtype";
import { PhpClassInterface } from "../interface/phpclassinterface";
import { PhpClass } from "./phpclass";

export class PhpEnum extends PhpClass
{
    #type: PhpClassType = PhpClassType.enum;
    #enumType: PhpEnumType = PhpEnumType.default;

    setType(type: PhpClassType): PhpClassInterface {
        return this;
    }

    getEnumType(): PhpEnumType
    {
        return this.#enumType;
    }

    setEnumType(type: PhpEnumType): PhpEnum
    {
        this.#enumType = type;
        return this;
    }
}