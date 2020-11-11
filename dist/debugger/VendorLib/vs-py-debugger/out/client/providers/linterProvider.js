// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const path = require("path");

const vscode_1 = require("vscode");

const types_1 = require("../common/application/types");

const configSettingMonitor_1 = require("../common/configSettingMonitor");

const constants_1 = require("../common/constants");

require("../common/extensions");

const types_2 = require("../common/platform/types");

const types_3 = require("../common/types");

const contracts_1 = require("../interpreter/contracts");

const types_4 = require("../linters/types");

class LinterProvider {
  constructor(context, serviceContainer) {
    this.context = context;
    this.disposables = [];
    this.fs = serviceContainer.get(types_2.IFileSystem);
    this.engine = serviceContainer.get(types_4.ILintingEngine);
    this.linterManager = serviceContainer.get(types_4.ILinterManager);
    this.interpreterService = serviceContainer.get(contracts_1.IInterpreterService);
    this.documents = serviceContainer.get(types_1.IDocumentManager);
    this.configuration = serviceContainer.get(types_3.IConfigurationService);
    this.disposables.push(this.interpreterService.onDidChangeInterpreter(() => this.engine.lintOpenPythonFiles()));
    this.documents.onDidOpenTextDocument(e => this.onDocumentOpened(e), this.context.subscriptions);
    this.documents.onDidCloseTextDocument(e => this.onDocumentClosed(e), this.context.subscriptions);
    this.documents.onDidSaveTextDocument(e => this.onDocumentSaved(e), this.context.subscriptions);
    this.configMonitor = new configSettingMonitor_1.ConfigSettingMonitor('linting');
    this.configMonitor.on('change', this.lintSettingsChangedHandler.bind(this)); // On workspace reopen we don't get `onDocumentOpened` since it is first opened
    // and then the extension is activated. So schedule linting pass now.

    if (!constants_1.isTestExecution()) {
      setTimeout(() => this.engine.lintOpenPythonFiles().ignoreErrors(), 1200);
    }
  }

  dispose() {
    this.disposables.forEach(d => d.dispose());
    this.configMonitor.dispose();
  }

  isDocumentOpen(uri) {
    return this.documents.textDocuments.some(document => this.fs.arePathsSame(document.uri.fsPath, uri.fsPath));
  }

  lintSettingsChangedHandler(configTarget, wkspaceOrFolder) {
    if (configTarget === vscode_1.ConfigurationTarget.Workspace) {
      this.engine.lintOpenPythonFiles().ignoreErrors();
      return;
    } // Look for python files that belong to the specified workspace folder.


    vscode_1.workspace.textDocuments.forEach(document => __awaiter(this, void 0, void 0, function* () {
      const wkspaceFolder = vscode_1.workspace.getWorkspaceFolder(document.uri);

      if (wkspaceFolder && wkspaceFolder.uri.fsPath === wkspaceOrFolder.fsPath) {
        this.engine.lintDocument(document, 'auto').ignoreErrors();
      }
    }));
  }

  onDocumentOpened(document) {
    this.engine.lintDocument(document, 'auto').ignoreErrors();
  }

  onDocumentSaved(document) {
    const settings = this.configuration.getSettings(document.uri);

    if (document.languageId === 'python' && settings.linting.enabled && settings.linting.lintOnSave) {
      this.engine.lintDocument(document, 'save').ignoreErrors();
      return;
    }

    this.linterManager.getActiveLinters(false, document.uri).then(linters => {
      const fileName = path.basename(document.uri.fsPath).toLowerCase();
      const watchers = linters.filter(info => info.configFileNames.indexOf(fileName) >= 0);

      if (watchers.length > 0) {
        setTimeout(() => this.engine.lintOpenPythonFiles(), 1000);
      }
    }).ignoreErrors();
  }

  onDocumentClosed(document) {
    if (!document || !document.fileName || !document.uri) {
      return;
    } // Check if this document is still open as a duplicate editor.


    if (!this.isDocumentOpen(document.uri)) {
      this.engine.clearDiagnostics(document);
    }
  }

}

exports.LinterProvider = LinterProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpbnRlclByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJwYXRoIiwicmVxdWlyZSIsInZzY29kZV8xIiwidHlwZXNfMSIsImNvbmZpZ1NldHRpbmdNb25pdG9yXzEiLCJjb25zdGFudHNfMSIsInR5cGVzXzIiLCJ0eXBlc18zIiwiY29udHJhY3RzXzEiLCJ0eXBlc180IiwiTGludGVyUHJvdmlkZXIiLCJjb25zdHJ1Y3RvciIsImNvbnRleHQiLCJzZXJ2aWNlQ29udGFpbmVyIiwiZGlzcG9zYWJsZXMiLCJmcyIsImdldCIsIklGaWxlU3lzdGVtIiwiZW5naW5lIiwiSUxpbnRpbmdFbmdpbmUiLCJsaW50ZXJNYW5hZ2VyIiwiSUxpbnRlck1hbmFnZXIiLCJpbnRlcnByZXRlclNlcnZpY2UiLCJJSW50ZXJwcmV0ZXJTZXJ2aWNlIiwiZG9jdW1lbnRzIiwiSURvY3VtZW50TWFuYWdlciIsImNvbmZpZ3VyYXRpb24iLCJJQ29uZmlndXJhdGlvblNlcnZpY2UiLCJwdXNoIiwib25EaWRDaGFuZ2VJbnRlcnByZXRlciIsImxpbnRPcGVuUHl0aG9uRmlsZXMiLCJvbkRpZE9wZW5UZXh0RG9jdW1lbnQiLCJvbkRvY3VtZW50T3BlbmVkIiwic3Vic2NyaXB0aW9ucyIsIm9uRGlkQ2xvc2VUZXh0RG9jdW1lbnQiLCJvbkRvY3VtZW50Q2xvc2VkIiwib25EaWRTYXZlVGV4dERvY3VtZW50Iiwib25Eb2N1bWVudFNhdmVkIiwiY29uZmlnTW9uaXRvciIsIkNvbmZpZ1NldHRpbmdNb25pdG9yIiwib24iLCJsaW50U2V0dGluZ3NDaGFuZ2VkSGFuZGxlciIsImJpbmQiLCJpc1Rlc3RFeGVjdXRpb24iLCJzZXRUaW1lb3V0IiwiaWdub3JlRXJyb3JzIiwiZGlzcG9zZSIsImZvckVhY2giLCJkIiwiaXNEb2N1bWVudE9wZW4iLCJ1cmkiLCJ0ZXh0RG9jdW1lbnRzIiwic29tZSIsImRvY3VtZW50IiwiYXJlUGF0aHNTYW1lIiwiZnNQYXRoIiwiY29uZmlnVGFyZ2V0Iiwid2tzcGFjZU9yRm9sZGVyIiwiQ29uZmlndXJhdGlvblRhcmdldCIsIldvcmtzcGFjZSIsIndvcmtzcGFjZSIsIndrc3BhY2VGb2xkZXIiLCJnZXRXb3Jrc3BhY2VGb2xkZXIiLCJsaW50RG9jdW1lbnQiLCJzZXR0aW5ncyIsImdldFNldHRpbmdzIiwibGFuZ3VhZ2VJZCIsImxpbnRpbmciLCJlbmFibGVkIiwibGludE9uU2F2ZSIsImdldEFjdGl2ZUxpbnRlcnMiLCJsaW50ZXJzIiwiZmlsZU5hbWUiLCJiYXNlbmFtZSIsInRvTG93ZXJDYXNlIiwid2F0Y2hlcnMiLCJmaWx0ZXIiLCJpbmZvIiwiY29uZmlnRmlsZU5hbWVzIiwiaW5kZXhPZiIsImxlbmd0aCIsImNsZWFyRGlhZ25vc3RpY3MiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJQSxTQUFTLEdBQUksVUFBUSxTQUFLQSxTQUFkLElBQTRCLFVBQVVDLE9BQVYsRUFBbUJDLFVBQW5CLEVBQStCQyxDQUEvQixFQUFrQ0MsU0FBbEMsRUFBNkM7QUFDckYsU0FBTyxLQUFLRCxDQUFDLEtBQUtBLENBQUMsR0FBR0UsT0FBVCxDQUFOLEVBQXlCLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQ3ZELGFBQVNDLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCO0FBQUUsVUFBSTtBQUFFQyxRQUFBQSxJQUFJLENBQUNOLFNBQVMsQ0FBQ08sSUFBVixDQUFlRixLQUFmLENBQUQsQ0FBSjtBQUE4QixPQUFwQyxDQUFxQyxPQUFPRyxDQUFQLEVBQVU7QUFBRUwsUUFBQUEsTUFBTSxDQUFDSyxD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T0FBTyxDQUFDVyxjQUFSLEdBQXlCQSxjQUF6QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcbid1c2Ugc3RyaWN0JztcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XHJcbmNvbnN0IHZzY29kZV8xID0gcmVxdWlyZShcInZzY29kZVwiKTtcclxuY29uc3QgdHlwZXNfMSA9IHJlcXVpcmUoXCIuLi9jb21tb24vYXBwbGljYXRpb24vdHlwZXNcIik7XHJcbmNvbnN0IGNvbmZpZ1NldHRpbmdNb25pdG9yXzEgPSByZXF1aXJlKFwiLi4vY29tbW9uL2NvbmZpZ1NldHRpbmdNb25pdG9yXCIpO1xyXG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb21tb24vY29uc3RhbnRzXCIpO1xyXG5yZXF1aXJlKFwiLi4vY29tbW9uL2V4dGVuc2lvbnNcIik7XHJcbmNvbnN0IHR5cGVzXzIgPSByZXF1aXJlKFwiLi4vY29tbW9uL3BsYXRmb3JtL3R5cGVzXCIpO1xyXG5jb25zdCB0eXBlc18zID0gcmVxdWlyZShcIi4uL2NvbW1vbi90eXBlc1wiKTtcclxuY29uc3QgY29udHJhY3RzXzEgPSByZXF1aXJlKFwiLi4vaW50ZXJwcmV0ZXIvY29udHJhY3RzXCIpO1xyXG5jb25zdCB0eXBlc180ID0gcmVxdWlyZShcIi4uL2xpbnRlcnMvdHlwZXNcIik7XHJcbmNsYXNzIExpbnRlclByb3ZpZGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQsIHNlcnZpY2VDb250YWluZXIpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmZzID0gc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMi5JRmlsZVN5c3RlbSk7XHJcbiAgICAgICAgdGhpcy5lbmdpbmUgPSBzZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc180LklMaW50aW5nRW5naW5lKTtcclxuICAgICAgICB0aGlzLmxpbnRlck1hbmFnZXIgPSBzZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc180LklMaW50ZXJNYW5hZ2VyKTtcclxuICAgICAgICB0aGlzLmludGVycHJldGVyU2VydmljZSA9IHNlcnZpY2VDb250YWluZXIuZ2V0KGNvbnRyYWN0c18xLklJbnRlcnByZXRlclNlcnZpY2UpO1xyXG4gICAgICAgIHRoaXMuZG9jdW1lbnRzID0gc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMS5JRG9jdW1lbnRNYW5hZ2VyKTtcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSBzZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc18zLklDb25maWd1cmF0aW9uU2VydmljZSk7XHJcbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKHRoaXMuaW50ZXJwcmV0ZXJTZXJ2aWNlLm9uRGlkQ2hhbmdlSW50ZXJwcmV0ZXIoKCkgPT4gdGhpcy5lbmdpbmUubGludE9wZW5QeXRob25GaWxlcygpKSk7XHJcbiAgICAgICAgdGhpcy5kb2N1bWVudHMub25EaWRPcGVuVGV4dERvY3VtZW50KGUgPT4gdGhpcy5vbkRvY3VtZW50T3BlbmVkKGUpLCB0aGlzLmNvbnRleHQuc3Vic2NyaXB0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5kb2N1bWVudHMub25EaWRDbG9zZVRleHREb2N1bWVudChlID0+IHRoaXMub25Eb2N1bWVudENsb3NlZChlKSwgdGhpcy5jb250ZXh0LnN1YnNjcmlwdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuZG9jdW1lbnRzLm9uRGlkU2F2ZVRleHREb2N1bWVudChlID0+IHRoaXMub25Eb2N1bWVudFNhdmVkKGUpLCB0aGlzLmNvbnRleHQuc3Vic2NyaXB0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5jb25maWdNb25pdG9yID0gbmV3IGNvbmZpZ1NldHRpbmdNb25pdG9yXzEuQ29uZmlnU2V0dGluZ01vbml0b3IoJ2xpbnRpbmcnKTtcclxuICAgICAgICB0aGlzLmNvbmZpZ01vbml0b3Iub24oJ2NoYW5nZScsIHRoaXMubGludFNldHRpbmdzQ2hhbmdlZEhhbmRsZXIuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgLy8gT24gd29ya3NwYWNlIHJlb3BlbiB3ZSBkb24ndCBnZXQgYG9uRG9jdW1lbnRPcGVuZWRgIHNpbmNlIGl0IGlzIGZpcnN0IG9wZW5lZFxyXG4gICAgICAgIC8vIGFuZCB0aGVuIHRoZSBleHRlbnNpb24gaXMgYWN0aXZhdGVkLiBTbyBzY2hlZHVsZSBsaW50aW5nIHBhc3Mgbm93LlxyXG4gICAgICAgIGlmICghY29uc3RhbnRzXzEuaXNUZXN0RXhlY3V0aW9uKCkpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVuZ2luZS5saW50T3BlblB5dGhvbkZpbGVzKCkuaWdub3JlRXJyb3JzKCksIDEyMDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRpc3Bvc2UoKSB7XHJcbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlcy5mb3JFYWNoKGQgPT4gZC5kaXNwb3NlKCkpO1xyXG4gICAgICAgIHRoaXMuY29uZmlnTW9uaXRvci5kaXNwb3NlKCk7XHJcbiAgICB9XHJcbiAgICBpc0RvY3VtZW50T3Blbih1cmkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kb2N1bWVudHMudGV4dERvY3VtZW50cy5zb21lKGRvY3VtZW50ID0+IHRoaXMuZnMuYXJlUGF0aHNTYW1lKGRvY3VtZW50LnVyaS5mc1BhdGgsIHVyaS5mc1BhdGgpKTtcclxuICAgIH1cclxuICAgIGxpbnRTZXR0aW5nc0NoYW5nZWRIYW5kbGVyKGNvbmZpZ1RhcmdldCwgd2tzcGFjZU9yRm9sZGVyKSB7XHJcbiAgICAgICAgaWYgKGNvbmZpZ1RhcmdldCA9PT0gdnNjb2RlXzEuQ29uZmlndXJhdGlvblRhcmdldC5Xb3Jrc3BhY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmdpbmUubGludE9wZW5QeXRob25GaWxlcygpLmlnbm9yZUVycm9ycygpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIExvb2sgZm9yIHB5dGhvbiBmaWxlcyB0aGF0IGJlbG9uZyB0byB0aGUgc3BlY2lmaWVkIHdvcmtzcGFjZSBmb2xkZXIuXHJcbiAgICAgICAgdnNjb2RlXzEud29ya3NwYWNlLnRleHREb2N1bWVudHMuZm9yRWFjaCgoZG9jdW1lbnQpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3Qgd2tzcGFjZUZvbGRlciA9IHZzY29kZV8xLndvcmtzcGFjZS5nZXRXb3Jrc3BhY2VGb2xkZXIoZG9jdW1lbnQudXJpKTtcclxuICAgICAgICAgICAgaWYgKHdrc3BhY2VGb2xkZXIgJiYgd2tzcGFjZUZvbGRlci51cmkuZnNQYXRoID09PSB3a3NwYWNlT3JGb2xkZXIuZnNQYXRoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZ2luZS5saW50RG9jdW1lbnQoZG9jdW1lbnQsICdhdXRvJykuaWdub3JlRXJyb3JzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbiAgICBvbkRvY3VtZW50T3BlbmVkKGRvY3VtZW50KSB7XHJcbiAgICAgICAgdGhpcy5lbmdpbmUubGludERvY3VtZW50KGRvY3VtZW50LCAnYXV0bycpLmlnbm9yZUVycm9ycygpO1xyXG4gICAgfVxyXG4gICAgb25Eb2N1bWVudFNhdmVkKGRvY3VtZW50KSB7XHJcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB0aGlzLmNvbmZpZ3VyYXRpb24uZ2V0U2V0dGluZ3MoZG9jdW1lbnQudXJpKTtcclxuICAgICAgICBpZiAoZG9jdW1lbnQubGFuZ3VhZ2VJZCA9PT0gJ3B5dGhvbicgJiYgc2V0dGluZ3MubGludGluZy5lbmFibGVkICYmIHNldHRpbmdzLmxpbnRpbmcubGludE9uU2F2ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZS5saW50RG9jdW1lbnQoZG9jdW1lbnQsICdzYXZlJykuaWdub3JlRXJyb3JzKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5saW50ZXJNYW5hZ2VyLmdldEFjdGl2ZUxpbnRlcnMoZmFsc2UsIGRvY3VtZW50LnVyaSlcclxuICAgICAgICAgICAgLnRoZW4oKGxpbnRlcnMpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBwYXRoLmJhc2VuYW1lKGRvY3VtZW50LnVyaS5mc1BhdGgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHdhdGNoZXJzID0gbGludGVycy5maWx0ZXIoKGluZm8pID0+IGluZm8uY29uZmlnRmlsZU5hbWVzLmluZGV4T2YoZmlsZU5hbWUpID49IDApO1xyXG4gICAgICAgICAgICBpZiAod2F0Y2hlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVuZ2luZS5saW50T3BlblB5dGhvbkZpbGVzKCksIDEwMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkuaWdub3JlRXJyb3JzKCk7XHJcbiAgICB9XHJcbiAgICBvbkRvY3VtZW50Q2xvc2VkKGRvY3VtZW50KSB7XHJcbiAgICAgICAgaWYgKCFkb2N1bWVudCB8fCAhZG9jdW1lbnQuZmlsZU5hbWUgfHwgIWRvY3VtZW50LnVyaSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIENoZWNrIGlmIHRoaXMgZG9jdW1lbnQgaXMgc3RpbGwgb3BlbiBhcyBhIGR1cGxpY2F0ZSBlZGl0b3IuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlzRG9jdW1lbnRPcGVuKGRvY3VtZW50LnVyaSkpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmdpbmUuY2xlYXJEaWFnbm9zdGljcyhkb2N1bWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuTGludGVyUHJvdmlkZXIgPSBMaW50ZXJQcm92aWRlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGludGVyUHJvdmlkZXIuanMubWFwIl19