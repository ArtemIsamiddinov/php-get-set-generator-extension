import * as vscode from 'vscode';
import { DocumentParseService } from './service/documentparseservice';
import { SelectionService } from './service/selectionservice';
import { GeneratorService } from './service/generatorservice';
import { Config } from './entity/config';
import { PhpPropertiesSelection } from './entity/phpproperiesselection';

export function activate(context: vscode.ExtensionContext) {

	const makeGettersDisposable = vscode.commands.registerCommand('php-get-set-generator.makeGetters', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const parser = new DocumentParseService(editor.document);
			const phpClasses = parser.parse();
			const selectionService = new SelectionService(editor, phpClasses);
			const generatorService = new GeneratorService(editor.document, new Config);

			selectionService.getSelections().forEach((phpPropertiesSelection: PhpPropertiesSelection) => {
				generatorService.makeGetters(phpPropertiesSelection);
			});

		}
		else {
			vscode.window.showErrorMessage("Could not determine the current editor");
		}
	});

	const makeSettersDisposable = vscode.commands.registerCommand('php-get-set-generator.makeSetters', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const parser = new DocumentParseService(editor.document);
			const phpClasses = parser.parse();
			const selectionService = new SelectionService(editor, phpClasses);
			const generatorService = new GeneratorService(editor.document, new Config);

			selectionService.getSelections().forEach((phpPropertiesSelection: PhpPropertiesSelection) => {
				generatorService.makeSetters(phpPropertiesSelection);
			});

		}
		else {
			vscode.window.showErrorMessage("Could not determine the current editor");
		}
	});

	const makeGettersAndSettersDisposable = vscode.commands.registerCommand('php-get-set-generator.makeGettersAndSetters', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const parser = new DocumentParseService(editor.document);
			const phpClasses = parser.parse();
			const selectionService = new SelectionService(editor, phpClasses);
			const generatorService = new GeneratorService(editor.document, new Config);

			selectionService.getSelections().forEach((phpPropertiesSelection: PhpPropertiesSelection) => {
				generatorService.makeGettersAndSetters(phpPropertiesSelection);
			});

		}
		else {
			vscode.window.showErrorMessage("Could not determine the current editor");
		}
	});
}

export function deactivate() { }
