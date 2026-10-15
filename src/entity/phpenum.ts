import { PhpClassType } from "../enums/phpclasstype";
import { PhpEnumType } from "../enums/phpenumtype";
import { PhpClassInterface } from "../interface/phpclassinterface";
import { PhpClass } from "./phpclass";

export class PhpEnum extends PhpClass {
    #enumType: PhpEnumType = PhpEnumType.default;

    constructor(name: string) {
        super(name, PhpClassType.enum);
    }

    setType(type: PhpClassType): PhpClassInterface {
        return this;
    }

    getEnumType(): PhpEnumType {
        return this.#enumType;
    }

    setEnumType(type: PhpEnumType): PhpEnum {
        this.#enumType = type;
        return this;
    }
}