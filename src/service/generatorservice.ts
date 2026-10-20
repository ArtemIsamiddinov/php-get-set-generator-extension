import { PhpPropertiesSelection } from "../entity/phpproperiesselection";
import { Config } from "../entity/config";
import { Position, TextDocument, WorkspaceEdit, workspace, window } from "vscode";
import { PhpPropertyInterface } from "../interface/phppropertyinterface";
import { PhpMethodInterface } from "../interface/phpmethodinterface";
import { PhpClassInterface } from "../interface/phpclassinterface";

export class GeneratorService {
    #document: TextDocument;
    #config: Config;

    constructor(document: TextDocument, config: Config) {
        this.#document = document;
        this.#config = config;
    }

    #getExistsMethods(phpClass: PhpClassInterface): Array<string> {
        let existsMethods: Array<string> = [];
        phpClass.getMethods().forEach((phpMethod: PhpMethodInterface) => {
            existsMethods.push(phpMethod.getName());
        });
        return existsMethods;
    }

    async makeGetters(phpPropertiesSelection: PhpPropertiesSelection): Promise<void> {
        let getters: Array<string> = [];
        let existsMethods = this.#getExistsMethods(phpPropertiesSelection.getClass());

        phpPropertiesSelection.getProperties().forEach((phpProperty: PhpPropertyInterface) => {
            if (!existsMethods.includes(this.#solveGetterName(phpProperty))) {
                getters.push(this.#makeGetter(phpProperty));
            }
        });

        const gettersCount = getters.length;
        if (gettersCount === 0) {
            return;
        }

        const phpClass = phpPropertiesSelection.getClass();
        const className = phpClass.getName();
        const phpClassType: string = phpClass.getType();
        const gettersName = gettersCount === 1 ? 'getter' : 'getters';
        await this.#insertCode(
            phpClass.getPositionTo(), 
            '\n' + getters.join('\n\n') + '\n', 
            `Generated ${gettersCount} ${gettersName} for ${phpClassType} ${className}!`, 
            `Could not generate getters for ${phpClassType} ${className}`
        );
    }

    async makeSetters(phpPropertiesSelection: PhpPropertiesSelection): Promise<void> {
        let setters: Array<string> = [];
        let existsMethods = this.#getExistsMethods(phpPropertiesSelection.getClass());

        phpPropertiesSelection.getProperties().forEach((phpProperty: PhpPropertyInterface) => {
            if (!existsMethods.includes(this.#solveSetterName(phpProperty))) {
                const setter = this.#makeSetter(phpProperty, phpPropertiesSelection.getClass());
                if (!!setter) {
                    setters.push(setter);
                }
            }
        });

        const settersCount = setters.length;
        if (settersCount === 0) {
            return;
        }

        const phpClass = phpPropertiesSelection.getClass();
        const className = phpClass.getName();
        const phpClassType: string = phpClass.getType();
        const settersName = settersCount === 1 ? 'setter' : 'setters';
        await this.#insertCode(
            phpClass.getPositionTo().with(), 
            '\n' + setters.join('\n\n') + '\n', 
            `Generated ${settersCount} ${settersName} for ${phpClassType} ${className}!`, 
            `Could not generate setters for ${phpClassType} ${className}`
        );
    }

    async makeGettersAndSetters(phpPropertiesSelection: PhpPropertiesSelection): Promise<void> {
        let 
            gettersAndSetters: Array<string> = [],
            gettersCount: number = 0,
            settersCount: number = 0,
            existsMethods = this.#getExistsMethods(phpPropertiesSelection.getClass());

        phpPropertiesSelection.getProperties().forEach((phpProperty: PhpPropertyInterface) => {

            if (!existsMethods.includes(this.#solveGetterName(phpProperty))) {
                gettersAndSetters.push(this.#makeGetter(phpProperty));
                gettersCount++;
            }


            if (!existsMethods.includes(this.#solveSetterName(phpProperty))) {
                const setter = this.#makeSetter(phpProperty, phpPropertiesSelection.getClass());
                if (!!setter) {
                    gettersAndSetters.push(setter);
                    settersCount++;
                }
            }
        });

        if (gettersAndSetters.length === 0) {
            return;
        }

        const phpClass = phpPropertiesSelection.getClass();
        const className = phpClass.getName();
        const phpClassType: string = phpClass.getType();
        const gettersName = gettersCount === 1 ? 'getter' : 'getters';
        const settersName = settersCount === 1 ? 'setter' : 'setters';
        await this.#insertCode(
            phpClass.getPositionTo().with(), 
            '\n' + gettersAndSetters.join('\n\n') + '\n', 
            `Generated for ${phpClassType} ${className}: ${gettersCount} ${gettersName} and ${settersCount} ${settersName}`, 
            `Could not generate getters and setters for ${phpClassType} ${className}`
        );
    }

    #solveGetterName(phpProperty: PhpPropertyInterface): string {
        let namePrefix = this.#config.getGetterPrefix();
        if (phpProperty.getTypes().length === 1 && phpProperty.getTypes().includes('bool')) {
            namePrefix = this.#config.getGetterBoolPrefix();
        }

        const checkGetterPrefixExists = new RegExp('^' + namePrefix + '[0-9A-Z_]');
        let name = phpProperty.getName();

        if (!!name.match(checkGetterPrefixExists)) {
            return name;
        }
        else {
            return namePrefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
    }

    #solveSetterName(phpProperty: PhpPropertyInterface): string {
        const checkGetterPrefixExists = new RegExp('^set[0-9A-Z_]');
        let name = phpProperty.getName();

        if (!!name.match(checkGetterPrefixExists)) {
            return name;
        }
        else {
            return 'set' + name.charAt(0).toUpperCase() + name.slice(1);
        }
    }

    #getIndentation(): string {
        switch (this.#config.getIndentation()) {
            case '2 spaces':
                return '  ';
            case '1 tab':
                return '\t';
            default:
                return '    ';
        }
    }

    #makeGetter(phpProperty: PhpPropertyInterface): string {
        const indentation = this.#getIndentation();
        let callInstance = '$this->';
        let staticDeclaration = '';
        if (phpProperty.isStatic()) {
            callInstance = 'static::\$';
            staticDeclaration = 'static ';
        }

        let declaration = `public ${staticDeclaration}function `;
        let getterName = this.#solveGetterName(phpProperty);
        let getterContent = `${callInstance}${phpProperty.getName()};`;
        let returnTypes: string = phpProperty.getTypes().join('|');
        if (returnTypes.length === 0) {
            returnTypes = 'mixed';
        }

        let getter = `${indentation}${declaration}${getterName}(): ${returnTypes}\n`;
        getter += `${indentation}{\n`;
        getter += `${indentation}${indentation}return ${getterContent}\n`;
        getter += `${indentation}}`;

        return getter;
    }

    #makeSetter(phpProperty: PhpPropertyInterface, phpClass: PhpClassInterface): string|null {
        if (phpClass.isReadonly() || phpProperty.isReadonly()) {
            return null;
        }

        const indentation = this.#getIndentation();
        let callInstance = '$this->';
        let staticDeclaration = '';
        if (phpProperty.isStatic()) {
            callInstance = 'static::\$';
            staticDeclaration = 'static ';
        }

        let declaration = `public ${staticDeclaration}function `;
        let setterName = this.#solveSetterName(phpProperty);
        let types: string = phpProperty.getTypes().join('|');
        if (types.length === 0) {
            types = 'mixed';
        }
        const propName: string = phpProperty.getName();
        let returnLine = '';
        let returnType = 'void';
        if (this.#config.isFluentSetters() && !phpProperty.isStatic()) {
            returnType = this.#config.getFluentSettersReturnType() === 'Class name' ? phpClass.getName() : 'static';
            returnLine = `${indentation}${indentation}return $this;\n`;
        }

        let setter = `${indentation}${declaration}${setterName}(${types} \$${propName}): ${returnType}\n`;
        setter += `${indentation}{\n`;
        setter += `${indentation}${indentation}${callInstance}${propName} = \$${propName};\n`;
        setter += returnLine;
        setter += `${indentation}}`;
        return setter;
    }

    async #insertCode(insertPosition: Position, generatedCode: string, successMessage: string, errorMessage: string): Promise<void>
    {
        const workspaceEdit = new WorkspaceEdit();
        workspaceEdit.insert(this.#document.uri, insertPosition, generatedCode);

        const success = await workspace.applyEdit(workspaceEdit);
        
        if (success) {
            window.showInformationMessage(successMessage);
        } else {
            window.showErrorMessage(errorMessage);
        }
    }
}
