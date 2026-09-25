// import * as vscode from 'vscode';
// import { PhpClass } from './types/phpclass';
// import { Property } from './types/property';
// import { PropertyType } from './types/types';

// export class Parser {
//     editor: vscode.TextEditor;
//     document: vscode.TextDocument;

//     classes: PhpClass[] = [];

//     constructor(editor: vscode.TextEditor) {
//         this.editor = editor;
//         this.document = editor.document;
//     }

//     #parseDocument(): void {
//         this.#findClasses();
//         this.#findClassesEndLine();
//         this.#fillProperties();
//     }

//     #findClasses(): void {
//         this.document.getText().match(/class\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*{/g)?.forEach(classMatch => {
//             let classInfo = classMatch.match(/class\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*{/);
//             if (classInfo !== null) {
//                 let className = 1 in classInfo ? classInfo[1] : '';
//                 if (className !== '') {
//                     let startLine = this.document.positionAt(this.document.getText().indexOf(classMatch)).line;
//                     let phpClass = new PhpClass(className, startLine, -1);
//                     this.classes.push(phpClass);
//                 }
//             }
//         });
//     }

//     #findClassesEndLine(): void {
//         let lastIndex = this.classes.length - 1;
//         let curLine = this.document.lineCount;
//         for (let i = lastIndex; i >= 0; i--) {
//             let searchEndLine = true;
//             while (curLine >= 0 && searchEndLine) {
//                 curLine--;

//                 let endLineMatch = this.document.lineAt(curLine).text.match(/}/g);
//                 if (endLineMatch === null) {
//                     continue;
//                 }
//                 else {
//                     this.classes[i].setEndLine(curLine);
//                     searchEndLine = false;
//                     curLine = this.classes[i].startLine - 1;
//                 }
//             }
//         }
//     }

//     #fillProperties(): void {
//         this.classes.forEach(phpClass => {
            
//         });
//     }

//     parse() {
//         this.#parseDocument();
//         console.log(this.classes);
//         // this.editor.selections.forEach(selection => {
//         //     this.parseSelection(selection);
//         // });
//     }

//     parseSelection(selection: vscode.Selection): void {
//         if (selection.start.line === selection.end.line && selection.start.character === selection.end.character) {
//             let lineText = this.document.lineAt(selection.start.line).text;
//             console.log(`search in line ${selection.start.line}: ${lineText}`);
//         }
//         else {
//             console.log(`search in selections`);
//         }
//     }

//     parseProperties(text: string): Property[] {
//         text.match(/(private|protected|public)\s+\$([a-zA-Z_][a-zA-Z0-9_]*)\s*;/g)?.forEach(match => { });
//         return [];
//     }
// }
