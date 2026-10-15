import { TextEditor, Selection } from "vscode";
import { PhpClassInterface } from "../interface/phpclassinterface";
import { PhpPropertiesSelection } from "../entity/phpproperiesselection";
import { PhpPropertyInterface } from "../interface/phppropertyinterface";
import { PositionService } from "./positionservice";

export class SelectionService {
    #editor: TextEditor;
    #phpClasses: Map<string, PhpClassInterface> = new Map;
    #selections: Map<string, PhpPropertiesSelection> = new Map;

    constructor(editor: TextEditor, phpClasses: Map<string, PhpClassInterface>) {
        this.#editor = editor;
        this.#phpClasses = phpClasses;
        this.#fillSelections();
    }

    getSelections(): Map<string, PhpPropertiesSelection> {
        return this.#selections;
    }

    #getPropertiesSelectionForClass(phpClass: PhpClassInterface): PhpPropertiesSelection {
        if (!this.#selections.has(phpClass.getName())) {
            this.#selections.set(phpClass.getName(), new PhpPropertiesSelection(phpClass));
        }
        return this.#selections.get(phpClass.getName())!;
    }

    #fillPhpPropertiesAtCursor(selection: Selection): void {
        this.#phpClasses.forEach((phpClass: PhpClassInterface) => {
            if (PositionService.isSelectionInside(phpClass, selection)) {
                const phpPropertiesSelection = this.#getPropertiesSelectionForClass(phpClass);

                phpClass.getProperties().forEach((phpProperty: PhpPropertyInterface) => {
                    if (PositionService.isSelectionInside(phpProperty, selection)) {
                        phpPropertiesSelection.addProperty(phpProperty);
                    }
                });
            }
        });
    }

    #fillPhpPropertiesBySelection(selection: Selection): void {
        this.#phpClasses.forEach((phpClass: PhpClassInterface) => {

            if (PositionService.isEntityInside(phpClass, selection)) {
                this.#getPropertiesSelectionForClass(phpClass).selectAllPropties();
            }
            if (PositionService.isSelectionInside(phpClass, selection)) {
                const phpPropertiesSelection = this.#getPropertiesSelectionForClass(phpClass);
                phpClass.getProperties().forEach((phpProperty: PhpPropertyInterface) => {
                    if (PositionService.isEntityAnyIntersect(phpProperty, selection)) {
                        phpPropertiesSelection.addProperty(phpProperty);
                    }
                });
            }
        });
    }

    #fillSelections(): void {
        this.#selections = new Map;
        this.#editor.selections.forEach((selection: Selection) => {
            if (selection.start === selection.end) {
                this.#fillPhpPropertiesAtCursor(selection);
            }
            else {
                this.#fillPhpPropertiesBySelection(selection);
            }
        });

        this.#selections.forEach((phpPropertiesSelection: PhpPropertiesSelection) => {
            if (phpPropertiesSelection.getProperties().size === 0) {
                phpPropertiesSelection.selectAllPropties();
            }
        });
    }
}
