"use strict";

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

const assert = require("assert");

const path = require("path");

const vscode_1 = require("vscode");

const types_1 = require("../../client/common/application/types");

const types_2 = require("../../client/common/platform/types");

const types_3 = require("../../client/common/process/types");

const generator_1 = require("../../client/workspaceSymbols/generator");

const provider_1 = require("../../client/workspaceSymbols/provider");

const initialize_1 = require("../initialize");

const mockClasses_1 = require("../mockClasses");

const serviceRegistry_1 = require("../unittests/serviceRegistry");

const common_1 = require("./../common");

const multirootPath = path.join(__dirname, '..', '..', '..', 'src', 'testMultiRootWkspc');
suite('Multiroot Workspace Symbols', () => {
  let ioc;
  let processServiceFactory;
  suiteSetup(function () {
    if (!initialize_1.IS_MULTI_ROOT_TEST) {
      // tslint:disable-next-line:no-invalid-this
      this.skip();
    }

    return initialize_1.initialize();
  });
  setup(() => __awaiter(void 0, void 0, void 0, function* () {
    initializeDI();
    yield initialize_1.initializeTest();
  }));
  suiteTeardown(initialize_1.closeActiveWindows);
  teardown(() => __awaiter(void 0, void 0, void 0, function* () {
    ioc.dispose();
    yield initialize_1.closeActiveWindows();
    yield common_1.updateSetting('workspaceSymbols.enabled', false, vscode_1.Uri.file(path.join(multirootPath, 'parent', 'child')), vscode_1.ConfigurationTarget.WorkspaceFolder);
    yield common_1.updateSetting('workspaceSymbols.enabled', false, vscode_1.Uri.file(path.join(multirootPath, 'workspace2')), vscode_1.ConfigurationTarget.WorkspaceFolder);
  }));

  function initializeDI() {
    ioc = new serviceRegistry_1.UnitTestIocContainer();
    ioc.registerCommonTypes();
    ioc.registerVariableTypes();
    ioc.registerProcessTypes();
    processServiceFactory = ioc.serviceContainer.get(types_3.IProcessServiceFactory);
  }

  test('symbols should be returned when enabeld and vice versa', () => __awaiter(void 0, void 0, void 0, function* () {
    const childWorkspaceUri = vscode_1.Uri.file(path.join(multirootPath, 'parent', 'child'));
    const outputChannel = new mockClasses_1.MockOutputChannel('Output');
    yield common_1.updateSetting('workspaceSymbols.enabled', false, childWorkspaceUri, vscode_1.ConfigurationTarget.WorkspaceFolder);
    let generator = new generator_1.Generator(childWorkspaceUri, outputChannel, processServiceFactory);
    let provider = new provider_1.WorkspaceSymbolProvider(ioc.serviceContainer.get(types_2.IFileSystem), ioc.serviceContainer.get(types_1.ICommandManager), [generator]);
    let symbols = yield provider.provideWorkspaceSymbols('', new vscode_1.CancellationTokenSource().token);
    assert.equal(symbols.length, 0, 'Symbols returned even when workspace symbols are turned off');
    generator.dispose();
    yield common_1.updateSetting('workspaceSymbols.enabled', true, childWorkspaceUri, vscode_1.ConfigurationTarget.WorkspaceFolder);
    generator = new generator_1.Generator(childWorkspaceUri, outputChannel, processServiceFactory);
    provider = new provider_1.WorkspaceSymbolProvider(ioc.serviceContainer.get(types_2.IFileSystem), ioc.serviceContainer.get(types_1.ICommandManager), [generator]);
    symbols = yield provider.provideWorkspaceSymbols('', new vscode_1.CancellationTokenSource().token);
    assert.notEqual(symbols.length, 0, 'Symbols should be returned when workspace symbols are turned on');
  }));
  test('symbols should be filtered correctly', () => __awaiter(void 0, void 0, void 0, function* () {
    const childWorkspaceUri = vscode_1.Uri.file(path.join(multirootPath, 'parent', 'child'));
    const workspace2Uri = vscode_1.Uri.file(path.join(multirootPath, 'workspace2'));
    const outputChannel = new mockClasses_1.MockOutputChannel('Output');
    yield common_1.updateSetting('workspaceSymbols.enabled', true, childWorkspaceUri, vscode_1.ConfigurationTarget.WorkspaceFolder);
    yield common_1.updateSetting('workspaceSymbols.enabled', true, workspace2Uri, vscode_1.ConfigurationTarget.WorkspaceFolder);
    const generators = [new generator_1.Generator(childWorkspaceUri, outputChannel, processServiceFactory), new generator_1.Generator(workspace2Uri, outputChannel, processServiceFactory)];
    const provider = new provider_1.WorkspaceSymbolProvider(ioc.serviceContainer.get(types_2.IFileSystem), ioc.serviceContainer.get(types_1.ICommandManager), generators);
    const symbols = yield provider.provideWorkspaceSymbols('meth1Of', new vscode_1.CancellationTokenSource().token);
    assert.equal(symbols.length, 2, 'Incorrect number of symbols returned');
    assert.notEqual(symbols.findIndex(sym => sym.location.uri.fsPath.endsWith('childFile.py')), -1, 'File with symbol not found in child workspace folder');
    assert.notEqual(symbols.findIndex(sym => sym.location.uri.fsPath.endsWith('workspace2File.py')), -1, 'File with symbol not found in child workspace folder');
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11bHRpcm9vdC50ZXN0LmpzIl0sIm5hbWVzIjpbIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJhc3NlcnQiLCJyZXF1aXJlIiwicGF0aCIsInZzY29kZV8xIiwidHlwZXNfMSIsInR5cGVzXzIiLCJ0eXBlc18zIiwiZ2VuZXJhdG9yXzEiLCJwcm92aWRlcl8xIiwiaW5pdGlhbGl6ZV8xIiwibW9ja0NsYXNzZXNfMSIsInNlcnZpY2VSZWdpc3RyeV8xIiwiY29tbW9uXzEiLCJtdWx0aXJvb3RQYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsInN1aXRlIiwiaW9jIiwicHJvY2Vzc1NlcnZpY2VGYWN0b3J5Iiwic3VpdGVTZXR1cCIsIklTX01VTFRJX1JPT1RfVEVTVCIsInNraXAiLCJpbml0aWFsaXplIiwic2V0dXAiLCJpbml0aWFsaXplREkiLCJpbml0aWFsaXplVGVzdCIsInN1aXRlVGVhcmRvd24iLCJjbG9zZUFjdGl2ZVdpbmRvd3MiLCJ0ZWFyZG93biIsImRpc3Bvc2UiLCJ1cGRhdGVTZXR0aW5nIiwiVXJpIiwiZmlsZSIsIkNvbmZpZ3VyYXRpb25UYXJnZXQiLCJXb3Jrc3BhY2VGb2xkZXIiLCJVbml0VGVzdElvY0NvbnRhaW5lciIsInJlZ2lzdGVyQ29tbW9uVHlwZXMiLCJyZWdpc3RlclZhcmlhYmxlVHlwZXMiLCJyZWdpc3RlclByb2Nlc3NUeXBlcyIsInNlcnZpY2VDb250YWluZXIiLCJnZXQiLCJJUHJvY2Vzc1NlcnZpY2VGYWN0b3J5IiwidGVzdCIsImNoaWxkV29ya3NwYWNlVXJpIiwib3V0cHV0Q2hhbm5lbCIsIk1vY2tPdXRwdXRDaGFubmVsIiwiR2VuZXJhdG9yIiwicHJvdmlkZXIiLCJXb3Jrc3BhY2VTeW1ib2xQcm92aWRlciIsIklGaWxlU3lzdGVtIiwiSUNvbW1hbmRNYW5hZ2VyIiwic3ltYm9scyIsInByb3ZpZGVXb3Jrc3BhY2VTeW1ib2xzIiwiQ2FuY2VsbGF0aW9uVG9rZW5Tb3VyY2UiLCJ0b2tlbiIsImVxdWFsIiwibGVuZ3RoIiwibm90RXF1YWwiLCJ3b3Jrc3BhY2UyVXJpIiwiZ2VuZXJhdG9ycyIsImZpbmRJbmRleCIsInN5bSIsImxvY2F0aW9uIiwidXJpIiwiZnNQYXRoIiwiZW5kc1dpdGgiXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBLElBQUlBLFNBQVMsR0FBSSxVQUFRLFNBQUtBLFNBQWQsSUFBNEIsVUFBVUMsT0FBVixFQUFtQkMsVUFBbkIsRUFBK0JDLENBQS9CLEVBQWtDQyxTQUFsQyxFQUE2QztBQUNyRixTQUFPLEtBQUtELENBQUMsS0FBS0EsQ0FBQyxHQUFHRSxPQUFULENBQU4sRUFBeUIsVUFBVUMsT0FBVixFQUFtQkMsTUFBbkIsRUFBMkI7QUFDdkQsYUFBU0MsU0FBVCxDQUFtQkMsS0FBbkIsRUFBMEI7QUFBRSxVQUFJO0FBQUVDLFFBQUFBLElBQUksQ0FBQ04sU0FBUyxDQUFDTyxJQUFWLENBQWVGLEtBQWYsQ0FBRCxDQUFKO0FBQThCLE9BQXBDLENBQXFDLE9BQU9HLENBQVAsRUFBVTtBQUFFTCxRQUFBQSxNQUFNLENBQUNLLENBQUQsQ0FBTjtBQUFZO0FBQUU7O0FBQzNGLGFBQVNDLFFBQVQsQ0FBa0JKLEtBQWxCLEVBQXlCO0FBQUUsVUFBSTtBQUFFQyxRQUFBQSxJQUFJLENBQUNOLFNBQVMsQ0FBQyxPQUFELENBQVQsQ0FBbUJLLEtBQW5CLENBQUQsQ0FBSjtBQUFrQyxPQUF4QyxDQUF5QyxPQUFPRyxDQUFQLEVBQVU7QUFBRUwsUUFBQUEsTUFBTSxDQUFDSyxDQUFELENBQU47QUFBWTtBQUFFOztBQUM5RixhQUFTRixJQUFULENBQWNJLE1BQWQsRUFBc0I7QUFBRUEsTUFBQUEsTUFBTSxDQUFDQyxJQUFQLEdBQWNULE9BQU8sQ0FBQ1EsTUFBTSxDQUFDTCxLQUFSLENBQXJCLEdBQXNDLElBQUlOLENBQUosQ0FBTSxVQUFVRyxPQUFWLEVBQW1CO0FBQUVBLFFBQUFBLE9BQU8sQ0FBQ1EsTUFBTSxDQUFDTCxLQUFSLENBQVA7QUFBd0IsT0FBbkQsRUFBcURPLElBQXJELENBQTBEUixTQUExRCxFQUFxRUssUUFBckUsQ0FBdEM7QUFBdUg7O0FBQy9JSCxJQUFBQSxJQUFJLENBQUMsQ0FBQ04sU0FBUyxHQUFHQSxTQUFTLENBQUNhLEtBQVYsQ0FBZ0JoQixPQUFoQixFQUF5QkMsVUFBVSxJQUFJLEVBQXZDLENBQWIsRUFBeURTLElBQXpELEVBQUQsQ0FBSjtBQUNILEdBTE0sQ0FBUDtBQU1ILENBUEQ7O0FBUUFPLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQkMsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRVgsRUFBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7O0FBQ0EsTUFBTVksTUFBTSxHQUFHQyxPQUFPLENBQUMsUUFBRCxDQUF0Qjs7QUFDQSxNQUFNQyxJQUFJLEdBQUdELE9BQU8sQ0FBQyxNQUFELENBQXBCOztBQUNBLE1BQU1FLFFBQVEsR0FBR0YsT0FBTyxDQUFDLFFBQUQsQ0FBeEI7O0FBQ0EsTUFBTUcsT0FBTyxHQUFHSCxPQUFPLENBQUMsdUNBQUQsQ0FBdkI7O0FBQ0EsTUFBTUksT0FBTyxHQUFHSixPQUFPLENBQUMsb0NBQUQsQ0FBdkI7O0FBQ0EsTUFBTUssT0FBTyxHQUFHTCxPQUFPLENBQUMsbUNBQUQsQ0FBdkI7O0FBQ0EsTUFBTU0sV0FBVyxHQUFHTixPQUFPLENBQUMseUNBQUQsQ0FBM0I7O0FBQ0EsTUFBTU8sVUFBVSxHQUFHUCxPQUFPLENBQUMsd0NBQUQsQ0FBMUI7O0FBQ0EsTUFBTVEsWUFBWSxHQUFHUixPQUFPLENBQUMsZUFBRCxDQUE1Qjs7QUFDQSxNQUFNUyxhQUFhLEdBQUdULE9BQU8sQ0FBQyxnQkFBRCxDQUE3Qjs7QUFDQSxNQUFNVSxpQkFBaUIsR0FBR1YsT0FBTyxDQUFDLDhCQUFELENBQWpDOztBQUNBLE1BQU1XLFFBQVEsR0FBR1gsT0FBTyxDQUFDLGFBQUQsQ0FBeEI7O0FBQ0EsTUFBTVksYUFBYSxHQUFHWCxJQUFJLENBQUNZLElBQUwsQ0FBVUMsU0FBVixFQUFxQixJQUFyQixFQUEyQixJQUEzQixFQUFpQyxJQUFqQyxFQUF1QyxLQUF2QyxFQUE4QyxvQkFBOUMsQ0FBdEI7QUFDQUMsS0FBSyxDQUFDLDZCQUFELEVBQWdDLE1BQU07QUFDdkMsTUFBSUMsR0FBSjtBQUNBLE1BQUlDLHFCQUFKO0FBQ0FDLEVBQUFBLFVBQVUsQ0FBQyxZQUFZO0FBQ25CLFFBQUksQ0FBQ1YsWUFBWSxDQUFDVyxrQkFBbEIsRUFBc0M7QUFDbEM7QUFDQSxXQUFLQyxJQUFMO0FBQ0g7O0FBQ0QsV0FBT1osWUFBWSxDQUFDYSxVQUFiLEVBQVA7QUFDSCxHQU5TLENBQVY7QUFPQUMsRUFBQUEsS0FBSyxDQUFDLE1BQU01QyxTQUFTLFNBQU8sS0FBSyxDQUFaLEVBQWUsS0FBSyxDQUFwQixFQUF1QixhQUFhO0FBQ3JENkMsSUFBQUEsWUFBWTtBQUNaLFVBQU1mLFlBQVksQ0FBQ2dCLGNBQWIsRUFBTjtBQUNILEdBSG9CLENBQWhCLENBQUw7QUFJQUMsRUFBQUEsYUFBYSxDQUFDakIsWUFBWSxDQUFDa0Isa0JBQWQsQ0FBYjtBQUNBQyxFQUFBQSxRQUFRLENBQUMsTUFBTWpELFNBQVMsU0FBTyxLQUFLLENBQVosRUFBZSxLQUFLLENBQXBCLEVBQXVCLGFBQWE7QUFDeERzQyxJQUFBQSxHQUFHLENBQUNZLE9BQUo7QUFDQSxVQUFNcEIsWUFBWSxDQUFDa0Isa0JBQWIsRUFBTjtBQUNBLFVBQU1mLFFBQVEsQ0FBQ2tCLGFBQVQsQ0FBdUIsMEJBQXZCLEVBQW1ELEtBQW5ELEVBQTBEM0IsUUFBUSxDQUFDNEIsR0FBVCxDQUFhQyxJQUFiLENBQWtCOUIsSUFBSSxDQUFDWSxJQUFMLENBQVVELGFBQVYsRUFBeUIsUUFBekIsRUFBbUMsT0FBbkMsQ0FBbEIsQ0FBMUQsRUFBMEhWLFFBQVEsQ0FBQzhCLG1CQUFULENBQTZCQyxlQUF2SixDQUFOO0FBQ0EsVUFBTXRCLFFBQVEsQ0FBQ2tCLGFBQVQsQ0FBdUIsMEJBQXZCLEVBQW1ELEtBQW5ELEVBQTBEM0IsUUFBUSxDQUFDNEIsR0FBVCxDQUFhQyxJQUFiLENBQWtCOUIsSUFBSSxDQUFDWSxJQUFMLENBQVVELGFBQVYsRUFBeUIsWUFBekIsQ0FBbEIsQ0FBMUQsRUFBcUhWLFFBQVEsQ0FBQzhCLG1CQUFULENBQTZCQyxlQUFsSixDQUFOO0FBQ0gsR0FMdUIsQ0FBaEIsQ0FBUjs7QUFNQSxXQUFTVixZQUFULEdBQXdCO0FBQ3BCUCxJQUFBQSxHQUFHLEdBQUcsSUFBSU4saUJBQWlCLENBQUN3QixvQkFBdEIsRUFBTjtBQUNBbEIsSUFBQUEsR0FBRyxDQUFDbUIsbUJBQUo7QUFDQW5CLElBQUFBLEdBQUcsQ0FBQ29CLHFCQUFKO0FBQ0FwQixJQUFBQSxHQUFHLENBQUNxQixvQkFBSjtBQUNBcEIsSUFBQUEscUJBQXFCLEdBQUdELEdBQUcsQ0FBQ3NCLGdCQUFKLENBQXFCQyxHQUFyQixDQUF5QmxDLE9BQU8sQ0FBQ21DLHNCQUFqQyxDQUF4QjtBQUNIOztBQUNEQyxFQUFBQSxJQUFJLENBQUMsd0RBQUQsRUFBMkQsTUFBTS9ELFNBQVMsU0FBTyxLQUFLLENBQVosRUFBZSxLQUFLLENBQXBCLEVBQXVCLGFBQWE7QUFDOUcsVUFBTWdFLGlCQUFpQixHQUFHeEMsUUFBUSxDQUFDNEIsR0FBVCxDQUFhQyxJQUFiLENBQWtCOUIsSUFBSSxDQUFDWSxJQUFMLENBQVVELGFBQVYsRUFBeUIsUUFBekIsRUFBbUMsT0FBbkMsQ0FBbEIsQ0FBMUI7QUFDQSxVQUFNK0IsYUFBYSxHQUFHLElBQUlsQyxhQUFhLENBQUNtQyxpQkFBbEIsQ0FBb0MsUUFBcEMsQ0FBdEI7QUFDQSxVQUFNakMsUUFBUSxDQUFDa0IsYUFBVCxDQUF1QiwwQkFBdkIsRUFBbUQsS0FBbkQsRUFBMERhLGlCQUExRCxFQUE2RXhDLFFBQVEsQ0FBQzhCLG1CQUFULENBQTZCQyxlQUExRyxDQUFOO0FBQ0EsUUFBSW5ELFNBQVMsR0FBRyxJQUFJd0IsV0FBVyxDQUFDdUMsU0FBaEIsQ0FBMEJILGlCQUExQixFQUE2Q0MsYUFBN0MsRUFBNEQxQixxQkFBNUQsQ0FBaEI7QUFDQSxRQUFJNkIsUUFBUSxHQUFHLElBQUl2QyxVQUFVLENBQUN3Qyx1QkFBZixDQUF1Qy9CLEdBQUcsQ0FBQ3NCLGdCQUFKLENBQXFCQyxHQUFyQixDQUF5Qm5DLE9BQU8sQ0FBQzRDLFdBQWpDLENBQXZDLEVBQXNGaEMsR0FBRyxDQUFDc0IsZ0JBQUosQ0FBcUJDLEdBQXJCLENBQXlCcEMsT0FBTyxDQUFDOEMsZUFBakMsQ0FBdEYsRUFBeUksQ0FBQ25FLFNBQUQsQ0FBekksQ0FBZjtBQUNBLFFBQUlvRSxPQUFPLEdBQUcsTUFBTUosUUFBUSxDQUFDSyx1QkFBVCxDQUFpQyxFQUFqQyxFQUFxQyxJQUFJakQsUUFBUSxDQUFDa0QsdUJBQWIsR0FBdUNDLEtBQTVFLENBQXBCO0FBQ0F0RCxJQUFBQSxNQUFNLENBQUN1RCxLQUFQLENBQWFKLE9BQU8sQ0FBQ0ssTUFBckIsRUFBNkIsQ0FBN0IsRUFBZ0MsNkRBQWhDO0FBQ0F6RSxJQUFBQSxTQUFTLENBQUM4QyxPQUFWO0FBQ0EsVUFBTWpCLFFBQVEsQ0FBQ2tCLGFBQVQsQ0FBdUIsMEJBQXZCLEVBQW1ELElBQW5ELEVBQXlEYSxpQkFBekQsRUFBNEV4QyxRQUFRLENBQUM4QixtQkFBVCxDQUE2QkMsZUFBekcsQ0FBTjtBQUNBbkQsSUFBQUEsU0FBUyxHQUFHLElBQUl3QixXQUFXLENBQUN1QyxTQUFoQixDQUEwQkgsaUJBQTFCLEVBQTZDQyxhQUE3QyxFQUE0RDFCLHFCQUE1RCxDQUFaO0FBQ0E2QixJQUFBQSxRQUFRLEdBQUcsSUFBSXZDLFVBQVUsQ0FBQ3dDLHVCQUFmLENBQXVDL0IsR0FBRyxDQUFDc0IsZ0JBQUosQ0FBcUJDLEdBQXJCLENBQXlCbkMsT0FBTyxDQUFDNEMsV0FBakMsQ0FBdkMsRUFBc0ZoQyxHQUFHLENBQUNzQixnQkFBSixDQUFxQkMsR0FBckIsQ0FBeUJwQyxPQUFPLENBQUM4QyxlQUFqQyxDQUF0RixFQUF5SSxDQUFDbkUsU0FBRCxDQUF6SSxDQUFYO0FBQ0FvRSxJQUFBQSxPQUFPLEdBQUcsTUFBTUosUUFBUSxDQUFDSyx1QkFBVCxDQUFpQyxFQUFqQyxFQUFxQyxJQUFJakQsUUFBUSxDQUFDa0QsdUJBQWIsR0FBdUNDLEtBQTVFLENBQWhCO0FBQ0F0RCxJQUFBQSxNQUFNLENBQUN5RCxRQUFQLENBQWdCTixPQUFPLENBQUNLLE1BQXhCLEVBQWdDLENBQWhDLEVBQW1DLGlFQUFuQztBQUNILEdBZDZFLENBQTFFLENBQUo7QUFlQWQsRUFBQUEsSUFBSSxDQUFDLHNDQUFELEVBQXlDLE1BQU0vRCxTQUFTLFNBQU8sS0FBSyxDQUFaLEVBQWUsS0FBSyxDQUFwQixFQUF1QixhQUFhO0FBQzVGLFVBQU1nRSxpQkFBaUIsR0FBR3hDLFFBQVEsQ0FBQzRCLEdBQVQsQ0FBYUMsSUFBYixDQUFrQjlCLElBQUksQ0FBQ1ksSUFBTCxDQUFVRCxhQUFWLEVBQXlCLFFBQXpCLEVBQW1DLE9BQW5DLENBQWxCLENBQTFCO0FBQ0EsVUFBTTZDLGFBQWEsR0FBR3ZELFFBQVEsQ0FBQzRCLEdBQVQsQ0FBYUMsSUFBYixDQUFrQjlCLElBQUksQ0FBQ1ksSUFBTCxDQUFVRCxhQUFWLEVBQXlCLFlBQXpCLENBQWxCLENBQXRCO0FBQ0EsVUFBTStCLGFBQWEsR0FBRyxJQUFJbEMsYUFBYSxDQUFDbUMsaUJBQWxCLENBQW9DLFFBQXBDLENBQXRCO0FBQ0EsVUFBTWpDLFFBQVEsQ0FBQ2tCLGFBQVQsQ0FBdUIsMEJBQXZCLEVBQW1ELElBQW5ELEVBQXlEYSxpQkFBekQsRUFBNEV4QyxRQUFRLENBQUM4QixtQkFBVCxDQUE2QkMsZUFBekcsQ0FBTjtBQUNBLFVBQU10QixRQUFRLENBQUNrQixhQUFULENBQXVCLDBCQUF2QixFQUFtRCxJQUFuRCxFQUF5RDRCLGFBQXpELEVBQXdFdkQsUUFBUSxDQUFDOEIsbUJBQVQsQ0FBNkJDLGVBQXJHLENBQU47QUFDQSxVQUFNeUIsVUFBVSxHQUFHLENBQ2YsSUFBSXBELFdBQVcsQ0FBQ3VDLFNBQWhCLENBQTBCSCxpQkFBMUIsRUFBNkNDLGFBQTdDLEVBQTREMUIscUJBQTVELENBRGUsRUFFZixJQUFJWCxXQUFXLENBQUN1QyxTQUFoQixDQUEwQlksYUFBMUIsRUFBeUNkLGFBQXpDLEVBQXdEMUIscUJBQXhELENBRmUsQ0FBbkI7QUFJQSxVQUFNNkIsUUFBUSxHQUFHLElBQUl2QyxVQUFVLENBQUN3Qyx1QkFBZixDQUF1Qy9CLEdBQUcsQ0FBQ3NCLGdCQUFKLENBQXFCQyxHQUFyQixDQUF5Qm5DLE9BQU8sQ0FBQzRDLFdBQWpDLENBQXZDLEVBQXNGaEMsR0FBRyxDQUFDc0IsZ0JBQUosQ0FBcUJDLEdBQXJCLENBQXlCcEMsT0FBTyxDQUFDOEMsZUFBakMsQ0FBdEYsRUFBeUlTLFVBQXpJLENBQWpCO0FBQ0EsVUFBTVIsT0FBTyxHQUFHLE1BQU1KLFFBQVEsQ0FBQ0ssdUJBQVQsQ0FBaUMsU0FBakMsRUFBNEMsSUFBSWpELFFBQVEsQ0FBQ2tELHVCQUFiLEdBQXVDQyxLQUFuRixDQUF0QjtBQUNBdEQsSUFBQUEsTUFBTSxDQUFDdUQsS0FBUCxDQUFhSixPQUFPLENBQUNLLE1BQXJCLEVBQTZCLENBQTdCLEVBQWdDLHNDQUFoQztBQUNBeEQsSUFBQUEsTUFBTSxDQUFDeUQsUUFBUCxDQUFnQk4sT0FBTyxDQUFDUyxTQUFSLENBQWtCQyxHQUFHLElBQUlBLEdBQUcsQ0FBQ0MsUUFBSixDQUFhQyxHQUFiLENBQWlCQyxNQUFqQixDQUF3QkMsUUFBeEIsQ0FBaUMsY0FBakMsQ0FBekIsQ0FBaEIsRUFBNEYsQ0FBQyxDQUE3RixFQUFnRyxzREFBaEc7QUFDQWpFLElBQUFBLE1BQU0sQ0FBQ3lELFFBQVAsQ0FBZ0JOLE9BQU8sQ0FBQ1MsU0FBUixDQUFrQkMsR0FBRyxJQUFJQSxHQUFHLENBQUNDLFFBQUosQ0FBYUMsR0FBYixDQUFpQkMsTUFBakIsQ0FBd0JDLFFBQXhCLENBQWlDLG1CQUFqQyxDQUF6QixDQUFoQixFQUFpRyxDQUFDLENBQWxHLEVBQXFHLHNEQUFyRztBQUNILEdBZjJELENBQXhELENBQUo7QUFnQkgsQ0EzREksQ0FBTCIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGFzc2VydCA9IHJlcXVpcmUoXCJhc3NlcnRcIik7XHJcbmNvbnN0IHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcclxuY29uc3QgdnNjb2RlXzEgPSByZXF1aXJlKFwidnNjb2RlXCIpO1xyXG5jb25zdCB0eXBlc18xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9jb21tb24vYXBwbGljYXRpb24vdHlwZXNcIik7XHJcbmNvbnN0IHR5cGVzXzIgPSByZXF1aXJlKFwiLi4vLi4vY2xpZW50L2NvbW1vbi9wbGF0Zm9ybS90eXBlc1wiKTtcclxuY29uc3QgdHlwZXNfMyA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvY29tbW9uL3Byb2Nlc3MvdHlwZXNcIik7XHJcbmNvbnN0IGdlbmVyYXRvcl8xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC93b3Jrc3BhY2VTeW1ib2xzL2dlbmVyYXRvclwiKTtcclxuY29uc3QgcHJvdmlkZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvd29ya3NwYWNlU3ltYm9scy9wcm92aWRlclwiKTtcclxuY29uc3QgaW5pdGlhbGl6ZV8xID0gcmVxdWlyZShcIi4uL2luaXRpYWxpemVcIik7XHJcbmNvbnN0IG1vY2tDbGFzc2VzXzEgPSByZXF1aXJlKFwiLi4vbW9ja0NsYXNzZXNcIik7XHJcbmNvbnN0IHNlcnZpY2VSZWdpc3RyeV8xID0gcmVxdWlyZShcIi4uL3VuaXR0ZXN0cy9zZXJ2aWNlUmVnaXN0cnlcIik7XHJcbmNvbnN0IGNvbW1vbl8xID0gcmVxdWlyZShcIi4vLi4vY29tbW9uXCIpO1xyXG5jb25zdCBtdWx0aXJvb3RQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ3NyYycsICd0ZXN0TXVsdGlSb290V2tzcGMnKTtcclxuc3VpdGUoJ011bHRpcm9vdCBXb3Jrc3BhY2UgU3ltYm9scycsICgpID0+IHtcclxuICAgIGxldCBpb2M7XHJcbiAgICBsZXQgcHJvY2Vzc1NlcnZpY2VGYWN0b3J5O1xyXG4gICAgc3VpdGVTZXR1cChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCFpbml0aWFsaXplXzEuSVNfTVVMVElfUk9PVF9URVNUKSB7XHJcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbnZhbGlkLXRoaXNcclxuICAgICAgICAgICAgdGhpcy5za2lwKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbml0aWFsaXplXzEuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfSk7XHJcbiAgICBzZXR1cCgoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgaW5pdGlhbGl6ZURJKCk7XHJcbiAgICAgICAgeWllbGQgaW5pdGlhbGl6ZV8xLmluaXRpYWxpemVUZXN0KCk7XHJcbiAgICB9KSk7XHJcbiAgICBzdWl0ZVRlYXJkb3duKGluaXRpYWxpemVfMS5jbG9zZUFjdGl2ZVdpbmRvd3MpO1xyXG4gICAgdGVhcmRvd24oKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGlvYy5kaXNwb3NlKCk7XHJcbiAgICAgICAgeWllbGQgaW5pdGlhbGl6ZV8xLmNsb3NlQWN0aXZlV2luZG93cygpO1xyXG4gICAgICAgIHlpZWxkIGNvbW1vbl8xLnVwZGF0ZVNldHRpbmcoJ3dvcmtzcGFjZVN5bWJvbHMuZW5hYmxlZCcsIGZhbHNlLCB2c2NvZGVfMS5VcmkuZmlsZShwYXRoLmpvaW4obXVsdGlyb290UGF0aCwgJ3BhcmVudCcsICdjaGlsZCcpKSwgdnNjb2RlXzEuQ29uZmlndXJhdGlvblRhcmdldC5Xb3Jrc3BhY2VGb2xkZXIpO1xyXG4gICAgICAgIHlpZWxkIGNvbW1vbl8xLnVwZGF0ZVNldHRpbmcoJ3dvcmtzcGFjZVN5bWJvbHMuZW5hYmxlZCcsIGZhbHNlLCB2c2NvZGVfMS5VcmkuZmlsZShwYXRoLmpvaW4obXVsdGlyb290UGF0aCwgJ3dvcmtzcGFjZTInKSksIHZzY29kZV8xLkNvbmZpZ3VyYXRpb25UYXJnZXQuV29ya3NwYWNlRm9sZGVyKTtcclxuICAgIH0pKTtcclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVESSgpIHtcclxuICAgICAgICBpb2MgPSBuZXcgc2VydmljZVJlZ2lzdHJ5XzEuVW5pdFRlc3RJb2NDb250YWluZXIoKTtcclxuICAgICAgICBpb2MucmVnaXN0ZXJDb21tb25UeXBlcygpO1xyXG4gICAgICAgIGlvYy5yZWdpc3RlclZhcmlhYmxlVHlwZXMoKTtcclxuICAgICAgICBpb2MucmVnaXN0ZXJQcm9jZXNzVHlwZXMoKTtcclxuICAgICAgICBwcm9jZXNzU2VydmljZUZhY3RvcnkgPSBpb2Muc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMy5JUHJvY2Vzc1NlcnZpY2VGYWN0b3J5KTtcclxuICAgIH1cclxuICAgIHRlc3QoJ3N5bWJvbHMgc2hvdWxkIGJlIHJldHVybmVkIHdoZW4gZW5hYmVsZCBhbmQgdmljZSB2ZXJzYScsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjb25zdCBjaGlsZFdvcmtzcGFjZVVyaSA9IHZzY29kZV8xLlVyaS5maWxlKHBhdGguam9pbihtdWx0aXJvb3RQYXRoLCAncGFyZW50JywgJ2NoaWxkJykpO1xyXG4gICAgICAgIGNvbnN0IG91dHB1dENoYW5uZWwgPSBuZXcgbW9ja0NsYXNzZXNfMS5Nb2NrT3V0cHV0Q2hhbm5lbCgnT3V0cHV0Jyk7XHJcbiAgICAgICAgeWllbGQgY29tbW9uXzEudXBkYXRlU2V0dGluZygnd29ya3NwYWNlU3ltYm9scy5lbmFibGVkJywgZmFsc2UsIGNoaWxkV29ya3NwYWNlVXJpLCB2c2NvZGVfMS5Db25maWd1cmF0aW9uVGFyZ2V0LldvcmtzcGFjZUZvbGRlcik7XHJcbiAgICAgICAgbGV0IGdlbmVyYXRvciA9IG5ldyBnZW5lcmF0b3JfMS5HZW5lcmF0b3IoY2hpbGRXb3Jrc3BhY2VVcmksIG91dHB1dENoYW5uZWwsIHByb2Nlc3NTZXJ2aWNlRmFjdG9yeSk7XHJcbiAgICAgICAgbGV0IHByb3ZpZGVyID0gbmV3IHByb3ZpZGVyXzEuV29ya3NwYWNlU3ltYm9sUHJvdmlkZXIoaW9jLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSUZpbGVTeXN0ZW0pLCBpb2Muc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMS5JQ29tbWFuZE1hbmFnZXIpLCBbZ2VuZXJhdG9yXSk7XHJcbiAgICAgICAgbGV0IHN5bWJvbHMgPSB5aWVsZCBwcm92aWRlci5wcm92aWRlV29ya3NwYWNlU3ltYm9scygnJywgbmV3IHZzY29kZV8xLkNhbmNlbGxhdGlvblRva2VuU291cmNlKCkudG9rZW4pO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChzeW1ib2xzLmxlbmd0aCwgMCwgJ1N5bWJvbHMgcmV0dXJuZWQgZXZlbiB3aGVuIHdvcmtzcGFjZSBzeW1ib2xzIGFyZSB0dXJuZWQgb2ZmJyk7XHJcbiAgICAgICAgZ2VuZXJhdG9yLmRpc3Bvc2UoKTtcclxuICAgICAgICB5aWVsZCBjb21tb25fMS51cGRhdGVTZXR0aW5nKCd3b3Jrc3BhY2VTeW1ib2xzLmVuYWJsZWQnLCB0cnVlLCBjaGlsZFdvcmtzcGFjZVVyaSwgdnNjb2RlXzEuQ29uZmlndXJhdGlvblRhcmdldC5Xb3Jrc3BhY2VGb2xkZXIpO1xyXG4gICAgICAgIGdlbmVyYXRvciA9IG5ldyBnZW5lcmF0b3JfMS5HZW5lcmF0b3IoY2hpbGRXb3Jrc3BhY2VVcmksIG91dHB1dENoYW5uZWwsIHByb2Nlc3NTZXJ2aWNlRmFjdG9yeSk7XHJcbiAgICAgICAgcHJvdmlkZXIgPSBuZXcgcHJvdmlkZXJfMS5Xb3Jrc3BhY2VTeW1ib2xQcm92aWRlcihpb2Muc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMi5JRmlsZVN5c3RlbSksIGlvYy5zZXJ2aWNlQ29udGFpbmVyLmdldCh0eXBlc18xLklDb21tYW5kTWFuYWdlciksIFtnZW5lcmF0b3JdKTtcclxuICAgICAgICBzeW1ib2xzID0geWllbGQgcHJvdmlkZXIucHJvdmlkZVdvcmtzcGFjZVN5bWJvbHMoJycsIG5ldyB2c2NvZGVfMS5DYW5jZWxsYXRpb25Ub2tlblNvdXJjZSgpLnRva2VuKTtcclxuICAgICAgICBhc3NlcnQubm90RXF1YWwoc3ltYm9scy5sZW5ndGgsIDAsICdTeW1ib2xzIHNob3VsZCBiZSByZXR1cm5lZCB3aGVuIHdvcmtzcGFjZSBzeW1ib2xzIGFyZSB0dXJuZWQgb24nKTtcclxuICAgIH0pKTtcclxuICAgIHRlc3QoJ3N5bWJvbHMgc2hvdWxkIGJlIGZpbHRlcmVkIGNvcnJlY3RseScsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjb25zdCBjaGlsZFdvcmtzcGFjZVVyaSA9IHZzY29kZV8xLlVyaS5maWxlKHBhdGguam9pbihtdWx0aXJvb3RQYXRoLCAncGFyZW50JywgJ2NoaWxkJykpO1xyXG4gICAgICAgIGNvbnN0IHdvcmtzcGFjZTJVcmkgPSB2c2NvZGVfMS5VcmkuZmlsZShwYXRoLmpvaW4obXVsdGlyb290UGF0aCwgJ3dvcmtzcGFjZTInKSk7XHJcbiAgICAgICAgY29uc3Qgb3V0cHV0Q2hhbm5lbCA9IG5ldyBtb2NrQ2xhc3Nlc18xLk1vY2tPdXRwdXRDaGFubmVsKCdPdXRwdXQnKTtcclxuICAgICAgICB5aWVsZCBjb21tb25fMS51cGRhdGVTZXR0aW5nKCd3b3Jrc3BhY2VTeW1ib2xzLmVuYWJsZWQnLCB0cnVlLCBjaGlsZFdvcmtzcGFjZVVyaSwgdnNjb2RlXzEuQ29uZmlndXJhdGlvblRhcmdldC5Xb3Jrc3BhY2VGb2xkZXIpO1xyXG4gICAgICAgIHlpZWxkIGNvbW1vbl8xLnVwZGF0ZVNldHRpbmcoJ3dvcmtzcGFjZVN5bWJvbHMuZW5hYmxlZCcsIHRydWUsIHdvcmtzcGFjZTJVcmksIHZzY29kZV8xLkNvbmZpZ3VyYXRpb25UYXJnZXQuV29ya3NwYWNlRm9sZGVyKTtcclxuICAgICAgICBjb25zdCBnZW5lcmF0b3JzID0gW1xyXG4gICAgICAgICAgICBuZXcgZ2VuZXJhdG9yXzEuR2VuZXJhdG9yKGNoaWxkV29ya3NwYWNlVXJpLCBvdXRwdXRDaGFubmVsLCBwcm9jZXNzU2VydmljZUZhY3RvcnkpLFxyXG4gICAgICAgICAgICBuZXcgZ2VuZXJhdG9yXzEuR2VuZXJhdG9yKHdvcmtzcGFjZTJVcmksIG91dHB1dENoYW5uZWwsIHByb2Nlc3NTZXJ2aWNlRmFjdG9yeSlcclxuICAgICAgICBdO1xyXG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0gbmV3IHByb3ZpZGVyXzEuV29ya3NwYWNlU3ltYm9sUHJvdmlkZXIoaW9jLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSUZpbGVTeXN0ZW0pLCBpb2Muc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMS5JQ29tbWFuZE1hbmFnZXIpLCBnZW5lcmF0b3JzKTtcclxuICAgICAgICBjb25zdCBzeW1ib2xzID0geWllbGQgcHJvdmlkZXIucHJvdmlkZVdvcmtzcGFjZVN5bWJvbHMoJ21ldGgxT2YnLCBuZXcgdnNjb2RlXzEuQ2FuY2VsbGF0aW9uVG9rZW5Tb3VyY2UoKS50b2tlbik7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHN5bWJvbHMubGVuZ3RoLCAyLCAnSW5jb3JyZWN0IG51bWJlciBvZiBzeW1ib2xzIHJldHVybmVkJyk7XHJcbiAgICAgICAgYXNzZXJ0Lm5vdEVxdWFsKHN5bWJvbHMuZmluZEluZGV4KHN5bSA9PiBzeW0ubG9jYXRpb24udXJpLmZzUGF0aC5lbmRzV2l0aCgnY2hpbGRGaWxlLnB5JykpLCAtMSwgJ0ZpbGUgd2l0aCBzeW1ib2wgbm90IGZvdW5kIGluIGNoaWxkIHdvcmtzcGFjZSBmb2xkZXInKTtcclxuICAgICAgICBhc3NlcnQubm90RXF1YWwoc3ltYm9scy5maW5kSW5kZXgoc3ltID0+IHN5bS5sb2NhdGlvbi51cmkuZnNQYXRoLmVuZHNXaXRoKCd3b3Jrc3BhY2UyRmlsZS5weScpKSwgLTEsICdGaWxlIHdpdGggc3ltYm9sIG5vdCBmb3VuZCBpbiBjaGlsZCB3b3Jrc3BhY2UgZm9sZGVyJyk7XHJcbiAgICB9KSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tdWx0aXJvb3QudGVzdC5qcy5tYXAiXX0=