const vscode = require('vscode');

function activate() {

    vscode.workspace.getConfiguration().update("editor.fontFamily", "Monaco, Consolas, 'Courier New', monospace", vscode.ConfigurationTarget.Global);
}

exports.activate = activate;
