var vscode = require('vscode');
var HttpPreview = require('../view/http-preview');

module.exports = class RegexController {
  constructor(){
    this.httpPreview = new HttpPreview(); 
    this.registration = this.httpPreview.register('regex-preview');      
  }

  dispose() {
    
  }

  registerDefault(){
    var method = vscode.workspace.getConfiguration('default').get('method', 'match');
    return vscode.commands.registerCommand('regex.default', function() {
      vscode.commands.executeCommand(`regex.${method}`);
    });
  }

  registerTest(){
    var self = this;
    return vscode.commands.registerCommand('regex.test', function() {
      self.run('test', (cmd, content) => {
        try{
          var regex;
          eval(`regex = ${cmd}`);
          var m = regex.test(content);
          vscode.window.showInformationMessage(m ? 'Passed' : 'Failed');
        }catch(e){
          vscode.window.showErrorMessage(e);
        }
      });
    });
  }
  registerMatch(){
    var self = this;
    return vscode.commands.registerCommand('regex.match', function() {
      self.run('match', (cmd, content) => {
        try{
          var regex;
          eval(`regex = ${cmd}`);
          var m = content.match(regex);
          var rs = [];
          if(m){
            for(var i =0; i<m.length; i++){
              rs.push(m[i]);
            }
          }
          self.httpPreview.update(rs, 'match', cmd);
        }catch(e){
          vscode.window.showErrorMessage(e);
        }
      });
    });
  }
  registerExec(){
    var self = this;
    return vscode.commands.registerCommand('regex.exec', function() {
      self.run('exec', (cmd, content) => {
        try{
          var regex;
          eval(`regex = ${cmd}`);
          if(!/\/.*?g+/.test(cmd)){
            throw 'Need global flag for exec function. Example: /your_regex/g';
          }
          var m = regex.exec(content);
          var rs = [];
          while(m){
            var rs0 = [];
            for(var i =0; i<m.length; i++){
              rs0.push(m[i]);
            }
            rs.push(rs0);
            m = regex.exec(content);
          }
          self.httpPreview.update(rs, 'exec');
        }catch(e){
          vscode.window.showErrorMessage(e);
        }
      });
    });
  }

  run(type, fcDone){
    var self = this;    
    var editor = vscode.window.activeTextEditor;
    if (!editor) return;
    try{
      var [cmd, content] = this.getContent(editor);
      fcDone(cmd, content);
    }catch(err){
      vscode.window.showErrorMessage(err);
    }    
  }

  getContent(editor){
    var cnt;
    var api;
    var all = editor.document.getText();
    if (!editor.selection.isEmpty) all = editor.document.getText(editor.selection);
    var cmd = all.match(/^[^\r|\n]+/);
    if(!cmd){
      throw 'Can not found regex pattern';
    }
    cmd = cmd[0].trim();
    if(cmd.indexOf('/') !== 0){
      cmd  = `/${cmd}/`;
    }
    all = all.substr(all.indexOf('\n'));
    all = all.trim();
    if(all.length == 0){
      throw 'Can not found your content which need match by regex';
    }
    cmd = cmd.trim();    
    return [cmd, all];  
  }
}