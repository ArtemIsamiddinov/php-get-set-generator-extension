import * as vscode from 'vscode';
import { DocumentParseService } from './service/documentparseservice';

export function activate(context: vscode.ExtensionContext) {

	const makeGettersDisposable = vscode.commands.registerCommand('php-get-set-generator.makeGetters', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const parser = new DocumentParseService(editor.document);
			const phpClasses = parser.parse();

			console.log(phpClasses);
		}
		else {
			vscode.window.showErrorMessage("Could not determine the current editor");
		}
	});
	// const disposable = vscode.commands.registerCommand('php-get-set-generator.helloWorld', () => {
	// 	vscode.window.showInformationMessage('Hello World from php-get-set-generator!');
	// });

	// const versionDisposable = vscode.commands.registerCommand('php-get-set-generator.version', () => {
	// 	try {
	// 		let version = vscode.extensions.getExtension('demai.php-get-set-generator')?.packageJSON?.version;
	// 		if (version === undefined || version === null || version === '') {
	// 			throw new Error('Version information is empty');
	// 		}
	// 		vscode.window.showInformationMessage(`php-get-set-generator version: ${version}`);
	// 	} catch (error) {
	// 		vscode.window.showErrorMessage(`Error: ${error}`);
	// 	}
	// });

	// context.subscriptions.push(disposable);
	// context.subscriptions.push(versionDisposable);
}

export function deactivate() {}
