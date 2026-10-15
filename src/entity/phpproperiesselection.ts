import { PhpClassInterface } from "../interface/phpclassinterface";
import { PhpPropertyInterface } from "../interface/phppropertyinterface";

export class PhpPropertiesSelection {

    #phpClass: PhpClassInterface;
    #phpProperties: Set<PhpPropertyInterface> = new Set;

    constructor(phpClass: PhpClassInterface) {
        this.#phpClass = phpClass;
    }

    addProperty(phpPropery: PhpPropertyInterface): void
    {
        if (!this.#phpProperties.has(phpPropery)) {
            this.#phpProperties.add(phpPropery);
        }
    }

    setProperties(phpProperties: Set<PhpPropertyInterface>): void
    {
        this.#phpProperties = phpProperties;
    }

    selectAllPropties(): void
    {
        this.#phpClass.getProperties().forEach((phpProperty: PhpPropertyInterface, propName: string) => {
            this.addProperty(phpProperty);
        });
    }

    getClass(): PhpClassInterface
    {
        return this.#phpClass;
    }

    getProperties(): Set<PhpPropertyInterface> {
        return this.#phpProperties;
    }
}