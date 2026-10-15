import { workspace } from "vscode";

export class Config {
    #indentation: string;
    #fluentSetters: boolean;
    #getterPrefix: string;
    #getterBoolPrefix: string;
    #addVoidToSetters: boolean;

    constructor() {
        const config = workspace.getConfiguration('php-get-set-generator');

        this.#indentation = config.get<string>('indentation', '4 spaces');
        this.#fluentSetters = config.get<boolean>('fluentSetters', true);
        this.#getterPrefix = config.get<string>('getterPrefix', 'get');
        this.#getterBoolPrefix = config.get<string>('getterBoolPrefix', 'is');
        this.#addVoidToSetters = config.get<boolean>('addVoidToSetters', false);
    }

    getIndentation(): string {
        return this.#indentation;
    }

    isFluentSetters(): boolean {
        return this.#fluentSetters;
    }

    getGetterPrefix(): string {
        return this.#getterPrefix;
    }

    getGetterBoolPrefix(): string {
        return this.#getterBoolPrefix;
    }

    isAddVoidToSetters(): boolean {
        if (this.isFluentSetters()) {
            return false;
        }
        return this.#addVoidToSetters;
    }
}
