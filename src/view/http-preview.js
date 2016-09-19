const vscode = require('vscode');
const path = require('path');

const assets = path.join(vscode.extensions.getExtension('just4developments.testing-regex').extensionPath, 'assets');
const previewCss = path.join(assets, 'styles', 'preview.css');

class HttpPreview {

  constructor(){
    this._onDidChange = new vscode.EventEmitter();
  }

  get uri(){
    return `${this.schema}://authority/${this.schema}/${HttpPreview.index}`;
  }

  register(schema){
    this.schema = schema;
    return vscode.workspace.registerTextDocumentContentProvider(schema, this);
  }

  get onDidChange() {
    return this._onDidChange.event;
  }

  update(rs, type, regexStr) {
    this.rs = rs;
    this.regexStr = regexStr;
    this.type = type;
    this._onDidChange.fire(this.uri);
    vscode.commands.executeCommand('vscode.previewHtml', this.uri, vscode.ViewColumn.Two, `Regex - ${type} method`);
  }

  toHtmlGroup(list){
    var rs = [];
    for(var i in list){
      var item = list[i];
      rs.push(`<details ${i == 0 ? 'open' : ''}><summary>Group ${i}</summary><pre><xmp class="hljs-string">${item}</xmp></pre></details>`);
    }
    return rs.join('');
  }

  toHtmlMatch(list){
    var rs = [];
    for(var i in list){
      var items = list[i];
      rs.push(`<details ${i == 0 ? 'open' : ''}><summary>Match ${i}</summary>${this.toHtmlGroup(items, i===0)}</details>`);
    }
    return rs.join('');
  }

  provideTextDocumentContent(scheme, provider){
    if(this.rs === undefined)
      return `Executing ...`;
    try{
      var rs = `<head>
          <link rel="stylesheet" href="${previewCss}">
      </head>
      <body>
        <xmp style="font-weight: bold">${this.regexStr}</xmp>
        <hr size="1"/><br/>
        ${this.type === 'exec' ? this.toHtmlMatch(this.rs) : this.toHtmlGroup(this.rs)}
      </body>`;
      return rs;
    }catch(e){
      vscode.window.showErrorMessage(e);
    }
    return '';
  }

  dispose(){
    
  }
  
  formatHeader(header){
    var rs = [];
    for(var i in header){
      rs.push(`${i}: ${header[i]}`);
    }
    return rs.join('\n');
  }
  formatBody(body, type, contentType){
    if('json' === type){
      return JSON.stringify(body, null, 2);
    }
    return body;
  }
}
HttpPreview.index = 1;
module.exports = HttpPreview;