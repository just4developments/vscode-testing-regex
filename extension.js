var vscode = require('vscode');
var RegexController = require('./src/controller/regex-controller');
var regexController = new RegexController();

function activate(context) {
    console.log('Congratulations, your extension "testing-regex" is now active!');
    context.subscriptions.push(regexController.registerDefault(true));
    context.subscriptions.push(regexController.registerDefault(false));
    context.subscriptions.push(regexController.registerTest());
    context.subscriptions.push(regexController.registerMatch(false));
    context.subscriptions.push(regexController.registerExec(false));
    context.subscriptions.push(regexController.registerMatch(true));
    context.subscriptions.push(regexController.registerExec(true));
}
exports.activate = activate;

function deactivate() {

}
exports.deactivate = deactivate;