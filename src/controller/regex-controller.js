var vscode = require('vscode');
var HttpPreview = require('../view/http-preview');

module.exports = class RegexController {
  constructor() {
    this.httpPreview = new HttpPreview();
    this.registration = this.httpPreview.register('regex-preview');
  }

  dispose() {

  }

  registerDefault(isNewTab) {
    var method = vscode.workspace.getConfiguration('default').get('method', 'match');
    var cmd = isNewTab ? 'regex.defaultNewTab' : 'regex.default';
    return vscode.commands.registerCommand(cmd, ((isNewTab) => {
      vscode.commands.executeCommand(`regex.${method}${isNewTab ? 'NewTab' : ''}`);
    }).bind(null, isNewTab));
  }

  registerTest() {
    return vscode.commands.registerCommand('regex.test', function() {
      self.run('test', (cmd, content) => {
        try {
          var regex;
          eval(`regex = ${cmd}`);
          var m = regex.test(content);
          vscode.window.showInformationMessage(m ? 'Passed' : 'Failed');
        } catch (e) {
          vscode.window.showErrorMessage(e);
        }
      });
    });
  }
  registerMatch(isNewTab) {
    var self = this;
    var cmd = isNewTab ? 'regex.matchNewTab' : 'regex.match';
    return vscode.commands.registerCommand(cmd, ((isNewTab) => {
      self.run('match', (cmd, content) => {
        try {
          var regex;
          eval(`regex = ${cmd}`);
          var m = content.match(regex);
          var rs = [];
          if (m) {
            for (var i = 0; i < m.length; i++) {
              rs.push(m[i]);
            }
          }
          setTimeout(()=>{
            self.httpPreview.update(rs, 'match', cmd, isNewTab);
          }, 100);
        } catch (e) {
          vscode.window.showErrorMessage(e);
        }
      });
    }).bind(null, isNewTab));
  }
  registerExec(isNewTab) {
    var self = this;
    var cmd = isNewTab ? 'regex.execNewTab' : 'regex.exec';
    return vscode.commands.registerCommand(cmd, ((isNewTab) => {
      self.run('exec', (cmd, content) => {
        try {
          var regex;
          eval(`regex = ${cmd}`);
          if (!/\/.*?g+/.test(cmd)) {
            throw 'Need global flag for exec function. Example: /your_regex/g';
          }
          var m = regex.exec(content);
          var rs = [];
          while (m) {
            var rs0 = [];
            for (var i = 0; i < m.length; i++) {
              rs0.push(m[i]);
            }
            rs.push(rs0);
            m = regex.exec(content);
          }
          setTimeout(()=>{
            self.httpPreview.update(rs, 'exec', cmd, isNewTab);
          }, 100);
        } catch (e) {
          vscode.window.showErrorMessage(e);
        }
      });
    }).bind(null, isNewTab));
  }

  run(type, fcDone) {
    var self = this;
    var editor = vscode.window.activeTextEditor;
    if (!editor) return;
    try {
      var [cmd, content] = this.getContent(editor);
      fcDone(cmd, content);
    } catch (err) {
      vscode.window.showErrorMessage(err);
    }
  }

  getContent(editor) {
    var cnt;
    var api;
    var all = editor.document.getText();
    if (!editor.selection.isEmpty) all = editor.document.getText(editor.selection);
    var cmd = all.match(/^[^\r|\n]+/);
    if (!cmd) {
      throw 'Can not found regex pattern';
    }
    cmd = cmd[0].trim();
    if (cmd.indexOf('/') !== 0) {
      cmd = `/${cmd}/`;
    }
    all = all.substr(all.indexOf('\n'));
    all = all.trim();
    if (all.length == 0) {
      throw 'Can not found your content which need match by regex';
    }
    cmd = cmd.trim();
    return [cmd, all];
  }
}