import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.createResourceFiles', async () => {
		// 1. Ask for base folder using folder picker
		const folders = await vscode.window.showOpenDialog({
			canSelectFolders: true,
			openLabel: 'Select base folder for MVC structure',
			canSelectFiles: false,
			canSelectMany: false
		});

		if (!folders || folders.length === 0) {
			vscode.window.showErrorMessage('No folder selected.');
			return;
		}

		const basePath = folders[0].fsPath;

		// 2. Ask for route name
		const routeName = await vscode.window.showInputBox({
			prompt: 'Enter route name (e.g., user, product)'
		});

		if (!routeName) {
			vscode.window.showErrorMessage('No route name provided.');
			return;
		}

		const pascalCaseName = routeName
			.replace(/(^\w|-\w)/g, (match) => match.replace('-', '').toUpperCase());

		const directories = [
			{ dir: 'Controllers', suffix: 'Controller' },
			{ dir: 'Models', suffix: 'Model' },
			{ dir: 'Services', suffix: 'Service' },
			{ dir: 'Routes', suffix: 'Routes' }
		];

		for (const { dir, suffix } of directories) {
			const targetDir = path.join(basePath, dir);
			if (!fs.existsSync(targetDir)) {
				fs.mkdirSync(targetDir, { recursive: true });
			}

			const fileName = `${pascalCaseName}${suffix}.ts`;
			const filePath = path.join(targetDir, fileName);

			if (fs.existsSync(filePath)) {
				vscode.window.showWarningMessage(`${fileName} already exists in ${dir}`);
				continue;
			}

			const content = `// ${fileName}\n\nexport class ${pascalCaseName}${suffix} {\n\t// TODO: Implement ${suffix.toLowerCase()}\n}\n`;

			fs.writeFileSync(filePath, content, 'utf8');
		}

		vscode.window.showInformationMessage(`✅ Created files for "${pascalCaseName}" in selected directory.`);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
