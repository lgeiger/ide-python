// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __param = void 0 && (void 0).__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};

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

const inversify_1 = require("inversify");

const path = require("path");

const vscode_1 = require("vscode");

const types_1 = require("../../../common/application/types");

require("../../../common/extensions");

const logger_1 = require("../../../common/logger");

const types_2 = require("../../../common/platform/types");

const types_3 = require("../../../common/process/types");

const types_4 = require("../../../common/types");

const maxTimeToWaitForEnvCreation = 60000;
const timeToPollForEnvCreation = 2000;
let WorkspaceVirtualEnvWatcherService = class WorkspaceVirtualEnvWatcherService {
  constructor(disposableRegistry, workspaceService, platformService, pythonExecFactory) {
    this.disposableRegistry = disposableRegistry;
    this.workspaceService = workspaceService;
    this.platformService = platformService;
    this.pythonExecFactory = pythonExecFactory;
    this.timers = new Map();
    this.fsWatchers = [];
    this.didCreate = new vscode_1.EventEmitter();
    disposableRegistry.push(this);
  }

  get onDidCreate() {
    return this.didCreate.event;
  }

  dispose() {
    this.clearTimers();
  }

  register(resource) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.fsWatchers.length > 0) {
        return;
      }

      const workspaceFolder = resource ? this.workspaceService.getWorkspaceFolder(resource) : undefined;
      const executable = this.platformService.isWindows ? 'python.exe' : 'python';
      const patterns = [path.join('*', executable), path.join('*', '*', executable)];

      for (const pattern of patterns) {
        const globPatern = workspaceFolder ? new vscode_1.RelativePattern(workspaceFolder.uri.fsPath, pattern) : pattern;
        logger_1.Logger.verbose(`Create file systemwatcher with pattern ${pattern}`);
        const fsWatcher = this.workspaceService.createFileSystemWatcher(globPatern);
        fsWatcher.onDidCreate(e => this.createHandler(e), this, this.disposableRegistry);
        this.disposableRegistry.push(fsWatcher);
        this.fsWatchers.push(fsWatcher);
      }
    });
  }

  createHandler(e) {
    return __awaiter(this, void 0, void 0, function* () {
      this.didCreate.fire(); // On Windows, creation of environments are very slow, hence lets notify again after
      // the python executable is accessible (i.e. when we can launch the process).

      this.notifyCreationWhenReady(e.fsPath).ignoreErrors();
    });
  }

  notifyCreationWhenReady(pythonPath) {
    return __awaiter(this, void 0, void 0, function* () {
      const counter = this.timers.has(pythonPath) ? this.timers.get(pythonPath).counter + 1 : 0;
      const isValid = yield this.isValidExecutable(pythonPath);

      if (isValid) {
        if (counter > 0) {
          this.didCreate.fire();
        }

        return this.timers.delete(pythonPath);
      }

      if (counter > maxTimeToWaitForEnvCreation / timeToPollForEnvCreation) {
        // Send notification before we give up trying.
        this.didCreate.fire();
        this.timers.delete(pythonPath);
        return;
      }

      const timer = setTimeout(() => this.notifyCreationWhenReady(pythonPath).ignoreErrors(), timeToPollForEnvCreation);
      this.timers.set(pythonPath, {
        timer,
        counter
      });
    });
  }

  clearTimers() {
    this.timers.forEach(item => clearTimeout(item.timer));
    this.timers.clear();
  }

  isValidExecutable(pythonPath) {
    return __awaiter(this, void 0, void 0, function* () {
      const execService = yield this.pythonExecFactory.create({
        pythonPath
      });
      const info = yield execService.getInterpreterInformation().catch(() => undefined);
      return info !== undefined;
    });
  }

};

__decorate([logger_1.traceVerbose('Register Intepreter Watcher')], WorkspaceVirtualEnvWatcherService.prototype, "register", null);

__decorate([logger_1.traceVerbose('Intepreter Watcher change handler')], WorkspaceVirtualEnvWatcherService.prototype, "createHandler", null);

WorkspaceVirtualEnvWatcherService = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_4.IDisposableRegistry)), __param(1, inversify_1.inject(types_1.IWorkspaceService)), __param(2, inversify_1.inject(types_2.IPlatformService)), __param(3, inversify_1.inject(types_3.IPythonExecutionFactory))], WorkspaceVirtualEnvWatcherService);
exports.WorkspaceVirtualEnvWatcherService = WorkspaceVirtualEnvWatcherService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZS5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJfX3BhcmFtIiwicGFyYW1JbmRleCIsImRlY29yYXRvciIsIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJleHBvcnRzIiwiaW52ZXJzaWZ5XzEiLCJyZXF1aXJlIiwicGF0aCIsInZzY29kZV8xIiwidHlwZXNfMSIsImxvZ2dlcl8xIiwidHlwZXNfMiIsInR5cGVzXzMiLCJ0eXBlc180IiwibWF4VGltZVRvV2FpdEZvckVudkNyZWF0aW9uIiwidGltZVRvUG9sbEZvckVudkNyZWF0aW9uIiwiV29ya3NwYWNlVmlydHVhbEVudldhdGNoZXJTZXJ2aWNlIiwiY29uc3RydWN0b3IiLCJkaXNwb3NhYmxlUmVnaXN0cnkiLCJ3b3Jrc3BhY2VTZXJ2aWNlIiwicGxhdGZvcm1TZXJ2aWNlIiwicHl0aG9uRXhlY0ZhY3RvcnkiLCJ0aW1lcnMiLCJNYXAiLCJmc1dhdGNoZXJzIiwiZGlkQ3JlYXRlIiwiRXZlbnRFbWl0dGVyIiwicHVzaCIsIm9uRGlkQ3JlYXRlIiwiZXZlbnQiLCJkaXNwb3NlIiwiY2xlYXJUaW1lcnMiLCJyZWdpc3RlciIsInJlc291cmNlIiwid29ya3NwYWNlRm9sZGVyIiwiZ2V0V29ya3NwYWNlRm9sZGVyIiwidW5kZWZpbmVkIiwiZXhlY3V0YWJsZSIsImlzV2luZG93cyIsInBhdHRlcm5zIiwiam9pbiIsInBhdHRlcm4iLCJnbG9iUGF0ZXJuIiwiUmVsYXRpdmVQYXR0ZXJuIiwidXJpIiwiZnNQYXRoIiwiTG9nZ2VyIiwidmVyYm9zZSIsImZzV2F0Y2hlciIsImNyZWF0ZUZpbGVTeXN0ZW1XYXRjaGVyIiwiY3JlYXRlSGFuZGxlciIsImZpcmUiLCJub3RpZnlDcmVhdGlvbldoZW5SZWFkeSIsImlnbm9yZUVycm9ycyIsInB5dGhvblBhdGgiLCJjb3VudGVyIiwiaGFzIiwiZ2V0IiwiaXNWYWxpZCIsImlzVmFsaWRFeGVjdXRhYmxlIiwiZGVsZXRlIiwidGltZXIiLCJzZXRUaW1lb3V0Iiwic2V0IiwiZm9yRWFjaCIsIml0ZW0iLCJjbGVhclRpbWVvdXQiLCJjbGVhciIsImV4ZWNTZXJ2aWNlIiwiY3JlYXRlIiwiaW5mbyIsImdldEludGVycHJldGVySW5mb3JtYXRpb24iLCJjYXRjaCIsInRyYWNlVmVyYm9zZSIsInByb3RvdHlwZSIsImluamVjdGFibGUiLCJpbmplY3QiLCJJRGlzcG9zYWJsZVJlZ2lzdHJ5IiwiSVdvcmtzcGFjZVNlcnZpY2UiLCJJUGxhdGZvcm1TZXJ2aWNlIiwiSVB5dGhvbkV4ZWN1dGlvbkZhY3RvcnkiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJQSxVQUFVLEdBQUksVUFBUSxTQUFLQSxVQUFkLElBQTZCLFVBQVVDLFVBQVYsRUFBc0JDLE1BQXRCLEVBQThCQyxHQUE5QixFQUFtQ0MsSUFBbkMsRUFBeUM7QUFDbkYsTUFBSUMsQ0FBQyxHQUFHQyxTQUFTLENBQUNDLE1BQWxCO0FBQUEsTUFBMEJDLENBQUMsR0FBR0gsQ0FBQyxHQUFHLENBQUosR0FBUUgsTUFBUixHQUFpQkUsSUFBSSxLQUFLLElBQVQsR0FBZ0JBLElBQUksR0FBR0ssTUFBTSxDQUFDQyx3QkFBUCxDQUFnQ1IsTUFBaEMsRUFBd0NDLEdBQXhDLENBQXZCLEdBQXNFQyxJQUFySDtBQUFBLE1BQTJITyxDQUEzSDtBQUNB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QUFDMEQsU0FGM0IsRUFFc0MsVUFGdEMsRUFFa0QsSUFGbEQsQ0FBVjs7QUFHQTNHLFVBQVUsQ0FBQyxDQUNQMkMsUUFBUSxDQUFDK0QsWUFBVCxDQUFzQixtQ0FBdEIsQ0FETyxDQUFELEVBRVB6RCxpQ0FBaUMsQ0FBQzBELFNBRjNCLEVBRXNDLGVBRnRDLEVBRXVELElBRnZELENBQVY7O0FBR0ExRCxpQ0FBaUMsR0FBR2pELFVBQVUsQ0FBQyxDQUMzQ3NDLFdBQVcsQ0FBQ3NFLFVBQVosRUFEMkMsRUFFM0M1RixPQUFPLENBQUMsQ0FBRCxFQUFJc0IsV0FBVyxDQUFDdUUsTUFBWixDQUFtQi9ELE9BQU8sQ0FBQ2dFLG1CQUEzQixDQUFKLENBRm9DLEVBRzNDOUYsT0FBTyxDQUFDLENBQUQsRUFBSXNCLFdBQVcsQ0FBQ3VFLE1BQVosQ0FBbUJuRSxPQUFPLENBQUNxRSxpQkFBM0IsQ0FBSixDQUhvQyxFQUkzQy9GLE9BQU8sQ0FBQyxDQUFELEVBQUlzQixXQUFXLENBQUN1RSxNQUFaLENBQW1CakUsT0FBTyxDQUFDb0UsZ0JBQTNCLENBQUosQ0FKb0MsRUFLM0NoRyxPQUFPLENBQUMsQ0FBRCxFQUFJc0IsV0FBVyxDQUFDdUUsTUFBWixDQUFtQmhFLE9BQU8sQ0FBQ29FLHVCQUEzQixDQUFKLENBTG9DLENBQUQsRUFNM0NoRSxpQ0FOMkMsQ0FBOUM7QUFPQVosT0FBTyxDQUFDWSxpQ0FBUixHQUE0Q0EsaUNBQTVDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4ndXNlIHN0cmljdCc7XG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG52YXIgX19wYXJhbSA9ICh0aGlzICYmIHRoaXMuX19wYXJhbSkgfHwgZnVuY3Rpb24gKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgaW52ZXJzaWZ5XzEgPSByZXF1aXJlKFwiaW52ZXJzaWZ5XCIpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuY29uc3QgdnNjb2RlXzEgPSByZXF1aXJlKFwidnNjb2RlXCIpO1xuY29uc3QgdHlwZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vYXBwbGljYXRpb24vdHlwZXNcIik7XG5yZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL2V4dGVuc2lvbnNcIik7XG5jb25zdCBsb2dnZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vbG9nZ2VyXCIpO1xuY29uc3QgdHlwZXNfMiA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGxhdGZvcm0vdHlwZXNcIik7XG5jb25zdCB0eXBlc18zID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wcm9jZXNzL3R5cGVzXCIpO1xuY29uc3QgdHlwZXNfNCA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vdHlwZXNcIik7XG5jb25zdCBtYXhUaW1lVG9XYWl0Rm9yRW52Q3JlYXRpb24gPSA2MDAwMDtcbmNvbnN0IHRpbWVUb1BvbGxGb3JFbnZDcmVhdGlvbiA9IDIwMDA7XG5sZXQgV29ya3NwYWNlVmlydHVhbEVudldhdGNoZXJTZXJ2aWNlID0gY2xhc3MgV29ya3NwYWNlVmlydHVhbEVudldhdGNoZXJTZXJ2aWNlIHtcbiAgICBjb25zdHJ1Y3RvcihkaXNwb3NhYmxlUmVnaXN0cnksIHdvcmtzcGFjZVNlcnZpY2UsIHBsYXRmb3JtU2VydmljZSwgcHl0aG9uRXhlY0ZhY3RvcnkpIHtcbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlUmVnaXN0cnkgPSBkaXNwb3NhYmxlUmVnaXN0cnk7XG4gICAgICAgIHRoaXMud29ya3NwYWNlU2VydmljZSA9IHdvcmtzcGFjZVNlcnZpY2U7XG4gICAgICAgIHRoaXMucGxhdGZvcm1TZXJ2aWNlID0gcGxhdGZvcm1TZXJ2aWNlO1xuICAgICAgICB0aGlzLnB5dGhvbkV4ZWNGYWN0b3J5ID0gcHl0aG9uRXhlY0ZhY3Rvcnk7XG4gICAgICAgIHRoaXMudGltZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmZzV2F0Y2hlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5kaWRDcmVhdGUgPSBuZXcgdnNjb2RlXzEuRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIGRpc3Bvc2FibGVSZWdpc3RyeS5wdXNoKHRoaXMpO1xuICAgIH1cbiAgICBnZXQgb25EaWRDcmVhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpZENyZWF0ZS5ldmVudDtcbiAgICB9XG4gICAgZGlzcG9zZSgpIHtcbiAgICAgICAgdGhpcy5jbGVhclRpbWVycygpO1xuICAgIH1cbiAgICByZWdpc3RlcihyZXNvdXJjZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZnNXYXRjaGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgd29ya3NwYWNlRm9sZGVyID0gcmVzb3VyY2UgPyB0aGlzLndvcmtzcGFjZVNlcnZpY2UuZ2V0V29ya3NwYWNlRm9sZGVyKHJlc291cmNlKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IGV4ZWN1dGFibGUgPSB0aGlzLnBsYXRmb3JtU2VydmljZS5pc1dpbmRvd3MgPyAncHl0aG9uLmV4ZScgOiAncHl0aG9uJztcbiAgICAgICAgICAgIGNvbnN0IHBhdHRlcm5zID0gW3BhdGguam9pbignKicsIGV4ZWN1dGFibGUpLCBwYXRoLmpvaW4oJyonLCAnKicsIGV4ZWN1dGFibGUpXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGF0dGVybiBvZiBwYXR0ZXJucykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdsb2JQYXRlcm4gPSB3b3Jrc3BhY2VGb2xkZXIgPyBuZXcgdnNjb2RlXzEuUmVsYXRpdmVQYXR0ZXJuKHdvcmtzcGFjZUZvbGRlci51cmkuZnNQYXRoLCBwYXR0ZXJuKSA6IHBhdHRlcm47XG4gICAgICAgICAgICAgICAgbG9nZ2VyXzEuTG9nZ2VyLnZlcmJvc2UoYENyZWF0ZSBmaWxlIHN5c3RlbXdhdGNoZXIgd2l0aCBwYXR0ZXJuICR7cGF0dGVybn1gKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmc1dhdGNoZXIgPSB0aGlzLndvcmtzcGFjZVNlcnZpY2UuY3JlYXRlRmlsZVN5c3RlbVdhdGNoZXIoZ2xvYlBhdGVybik7XG4gICAgICAgICAgICAgICAgZnNXYXRjaGVyLm9uRGlkQ3JlYXRlKGUgPT4gdGhpcy5jcmVhdGVIYW5kbGVyKGUpLCB0aGlzLCB0aGlzLmRpc3Bvc2FibGVSZWdpc3RyeSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwb3NhYmxlUmVnaXN0cnkucHVzaChmc1dhdGNoZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZnNXYXRjaGVycy5wdXNoKGZzV2F0Y2hlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjcmVhdGVIYW5kbGVyKGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMuZGlkQ3JlYXRlLmZpcmUoKTtcbiAgICAgICAgICAgIC8vIE9uIFdpbmRvd3MsIGNyZWF0aW9uIG9mIGVudmlyb25tZW50cyBhcmUgdmVyeSBzbG93LCBoZW5jZSBsZXRzIG5vdGlmeSBhZ2FpbiBhZnRlclxuICAgICAgICAgICAgLy8gdGhlIHB5dGhvbiBleGVjdXRhYmxlIGlzIGFjY2Vzc2libGUgKGkuZS4gd2hlbiB3ZSBjYW4gbGF1bmNoIHRoZSBwcm9jZXNzKS5cbiAgICAgICAgICAgIHRoaXMubm90aWZ5Q3JlYXRpb25XaGVuUmVhZHkoZS5mc1BhdGgpLmlnbm9yZUVycm9ycygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbm90aWZ5Q3JlYXRpb25XaGVuUmVhZHkocHl0aG9uUGF0aCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgY291bnRlciA9IHRoaXMudGltZXJzLmhhcyhweXRob25QYXRoKSA/IHRoaXMudGltZXJzLmdldChweXRob25QYXRoKS5jb3VudGVyICsgMSA6IDA7XG4gICAgICAgICAgICBjb25zdCBpc1ZhbGlkID0geWllbGQgdGhpcy5pc1ZhbGlkRXhlY3V0YWJsZShweXRob25QYXRoKTtcbiAgICAgICAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ZXIgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlkQ3JlYXRlLmZpcmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGltZXJzLmRlbGV0ZShweXRob25QYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb3VudGVyID4gKG1heFRpbWVUb1dhaXRGb3JFbnZDcmVhdGlvbiAvIHRpbWVUb1BvbGxGb3JFbnZDcmVhdGlvbikpIHtcbiAgICAgICAgICAgICAgICAvLyBTZW5kIG5vdGlmaWNhdGlvbiBiZWZvcmUgd2UgZ2l2ZSB1cCB0cnlpbmcuXG4gICAgICAgICAgICAgICAgdGhpcy5kaWRDcmVhdGUuZmlyZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMudGltZXJzLmRlbGV0ZShweXRob25QYXRoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5ub3RpZnlDcmVhdGlvbldoZW5SZWFkeShweXRob25QYXRoKS5pZ25vcmVFcnJvcnMoKSwgdGltZVRvUG9sbEZvckVudkNyZWF0aW9uKTtcbiAgICAgICAgICAgIHRoaXMudGltZXJzLnNldChweXRob25QYXRoLCB7IHRpbWVyLCBjb3VudGVyIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2xlYXJUaW1lcnMoKSB7XG4gICAgICAgIHRoaXMudGltZXJzLmZvckVhY2goaXRlbSA9PiBjbGVhclRpbWVvdXQoaXRlbS50aW1lcikpO1xuICAgICAgICB0aGlzLnRpbWVycy5jbGVhcigpO1xuICAgIH1cbiAgICBpc1ZhbGlkRXhlY3V0YWJsZShweXRob25QYXRoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBleGVjU2VydmljZSA9IHlpZWxkIHRoaXMucHl0aG9uRXhlY0ZhY3RvcnkuY3JlYXRlKHsgcHl0aG9uUGF0aCB9KTtcbiAgICAgICAgICAgIGNvbnN0IGluZm8gPSB5aWVsZCBleGVjU2VydmljZS5nZXRJbnRlcnByZXRlckluZm9ybWF0aW9uKCkuY2F0Y2goKCkgPT4gdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHJldHVybiBpbmZvICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5fX2RlY29yYXRlKFtcbiAgICBsb2dnZXJfMS50cmFjZVZlcmJvc2UoJ1JlZ2lzdGVyIEludGVwcmV0ZXIgV2F0Y2hlcicpXG5dLCBXb3Jrc3BhY2VWaXJ0dWFsRW52V2F0Y2hlclNlcnZpY2UucHJvdG90eXBlLCBcInJlZ2lzdGVyXCIsIG51bGwpO1xuX19kZWNvcmF0ZShbXG4gICAgbG9nZ2VyXzEudHJhY2VWZXJib3NlKCdJbnRlcHJldGVyIFdhdGNoZXIgY2hhbmdlIGhhbmRsZXInKVxuXSwgV29ya3NwYWNlVmlydHVhbEVudldhdGNoZXJTZXJ2aWNlLnByb3RvdHlwZSwgXCJjcmVhdGVIYW5kbGVyXCIsIG51bGwpO1xuV29ya3NwYWNlVmlydHVhbEVudldhdGNoZXJTZXJ2aWNlID0gX19kZWNvcmF0ZShbXG4gICAgaW52ZXJzaWZ5XzEuaW5qZWN0YWJsZSgpLFxuICAgIF9fcGFyYW0oMCwgaW52ZXJzaWZ5XzEuaW5qZWN0KHR5cGVzXzQuSURpc3Bvc2FibGVSZWdpc3RyeSkpLFxuICAgIF9fcGFyYW0oMSwgaW52ZXJzaWZ5XzEuaW5qZWN0KHR5cGVzXzEuSVdvcmtzcGFjZVNlcnZpY2UpKSxcbiAgICBfX3BhcmFtKDIsIGludmVyc2lmeV8xLmluamVjdCh0eXBlc18yLklQbGF0Zm9ybVNlcnZpY2UpKSxcbiAgICBfX3BhcmFtKDMsIGludmVyc2lmeV8xLmluamVjdCh0eXBlc18zLklQeXRob25FeGVjdXRpb25GYWN0b3J5KSlcbl0sIFdvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZSk7XG5leHBvcnRzLldvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZSA9IFdvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdvcmtzcGFjZVZpcnR1YWxFbnZXYXRjaGVyU2VydmljZS5qcy5tYXAiXX0=