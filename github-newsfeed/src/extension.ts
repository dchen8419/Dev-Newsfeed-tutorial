import * as vscode from 'vscode';
import { authenticate } from './authenticate';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';
import { TokenManager } from './TokenManager';

export function activate(context: vscode.ExtensionContext) {
	TokenManager.globalState = context.globalState;
	console.log('token value is: ', TokenManager.getToken);
	const sidebarProvider = new SidebarProvider(context.extensionUri);

	const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
	item.text = "$(beaker) Add Todo";
	item.command = 'github-newsfeed.addTodo';
	item.show();

	context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
    "github-newsfeed-sidebar",
    sidebarProvider
    )
);

	context.subscriptions.push(
		vscode.commands.registerCommand('github-newsfeed.addTodo', () => {
		const { activeTextEditor } = vscode.window;

		if (!activeTextEditor) {
			vscode.window.showInformationMessage("No active text editor");
			return;
		}

		const text = activeTextEditor.document.getText(
			activeTextEditor.selection
		);
		
		sidebarProvider._view?.webview.postMessage({type: 'new-todo', value: text
		});
	})
);

	context.subscriptions.push(
		vscode.commands.registerCommand('github-newsfeed.helloWorld', () => {
			vscode.window.showInformationMessage(
				"token value is: " + TokenManager.getToken()
			);
		// HelloWorldPanel.createOrShow(context.extensionUri);
	})
);

	context.subscriptions.push(
		vscode.commands.registerCommand('github-newsfeed.authenticate', () => {
			// try {
			// 	authenticate();
			// } catch (err) {
			// 	console.log(err);
			// }
	})
);

	context.subscriptions.push(
	vscode.commands.registerCommand('github-newsfeed.refresh', async () => {
		// HelloWorldPanel.kill();
		// HelloWorldPanel.createOrShow(context.extensionUri);
		await vscode.commands.executeCommand("workbench.action.closeSidebar");
		await vscode.commands.executeCommand("workbench.view.extension.github-newsfeed-sidebar-view");
		setTimeout(() => {
			vscode.commands.executeCommand(
				"workbench.action.webview.openDeveloperTools"
			);
		}, 500);
	})
);

	context.subscriptions.push(
	vscode.commands.registerCommand("github-newsfeed.askAQuestion", async () => {
		const answer = await vscode.window.showInformationMessage(
			"How was your day?", 
			"good", 
			"bad"
		);
		if (answer === "bad") {
			vscode.window.showInformationMessage("That stinks");
		} else {
			vscode.window.showInformationMessage(`${answer}`);
			console.log({answer});
		}
	})
);
}

export function deactivate() {}
