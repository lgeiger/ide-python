"use strict"; // Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

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

Object.defineProperty(exports, "__esModule", {
  value: true
});

const inversify_1 = require("inversify");

const types_1 = require("../../ioc/types");

const types_2 = require("../application/types");

const service_1 = require("./service");

let TerminalServiceFactory = class TerminalServiceFactory {
  constructor(serviceContainer) {
    this.serviceContainer = serviceContainer;
    this.terminalServices = new Map();
  }

  getTerminalService(resource, title) {
    const terminalTitle = typeof title === 'string' && title.trim().length > 0 ? title.trim() : 'Python';
    const id = this.getTerminalId(terminalTitle, resource);

    if (!this.terminalServices.has(id)) {
      const terminalService = new service_1.TerminalService(this.serviceContainer, resource, terminalTitle);
      this.terminalServices.set(id, terminalService);
    }

    return this.terminalServices.get(id);
  }

  createTerminalService(resource, title) {
    const terminalTitle = typeof title === 'string' && title.trim().length > 0 ? title.trim() : 'Python';
    return new service_1.TerminalService(this.serviceContainer, resource, terminalTitle);
  }

  getTerminalId(title, resource) {
    if (!resource) {
      return title;
    }

    const workspaceFolder = this.serviceContainer.get(types_2.IWorkspaceService).getWorkspaceFolder(resource);
    return workspaceFolder ? `${title}:${workspaceFolder.uri.fsPath}` : title;
  }

};
TerminalServiceFactory = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_1.IServiceContainer))], TerminalServiceFactory);
exports.TerminalServiceFactory = TerminalServiceFactory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZhY3RvcnkuanMiXSwibmFtZXMiOlsiX19kZWNvcmF0ZSIsImRlY29yYXRvcnMiLCJ0YXJnZXQiLCJrZXkiLCJkZXNjIiwiYyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInIiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJkIiwiUmVmbGVjdCIsImRlY29yYXRlIiwiaSIsImRlZmluZVByb3BlcnR5IiwiX19wYXJhbSIsInBhcmFtSW5kZXgiLCJkZWNvcmF0b3IiLCJleHBvcnRzIiwidmFsdWUiLCJpbnZlcnNpZnlfMSIsInJlcXVpcmUiLCJ0eXBlc18xIiwidHlwZXNfMiIsInNlcnZpY2VfMSIsIlRlcm1pbmFsU2VydmljZUZhY3RvcnkiLCJjb25zdHJ1Y3RvciIsInNlcnZpY2VDb250YWluZXIiLCJ0ZXJtaW5hbFNlcnZpY2VzIiwiTWFwIiwiZ2V0VGVybWluYWxTZXJ2aWNlIiwicmVzb3VyY2UiLCJ0aXRsZSIsInRlcm1pbmFsVGl0bGUiLCJ0cmltIiwiaWQiLCJnZXRUZXJtaW5hbElkIiwiaGFzIiwidGVybWluYWxTZXJ2aWNlIiwiVGVybWluYWxTZXJ2aWNlIiwic2V0IiwiZ2V0IiwiY3JlYXRlVGVybWluYWxTZXJ2aWNlIiwid29ya3NwYWNlRm9sZGVyIiwiSVdvcmtzcGFjZVNlcnZpY2UiLCJnZXRXb3Jrc3BhY2VGb2xkZXIiLCJ1cmkiLCJmc1BhdGgiLCJpbmplY3RhYmxlIiwiaW5qZWN0IiwiSVNlcnZpY2VDb250YWluZXIiXSwibWFwcGluZ3MiOiJBQUFBLGEsQ0FDQTtBQUNBOztBQUNBLElBQUlBLFVBQVUsR0FBSSxVQUFRLFNBQUtBLFVBQWQsSUFBNkIsVUFBVUMsVUFBVixFQUFzQkMsTUFBdEIsRUFBOEJDLEdBQTlCLEVBQW1DQyxJQUFuQyxFQUF5QztBQUNuRixNQUFJQyxDQUFDLEdBQUdDLFNBQVMsQ0FBQ0MsTUFBbEI7QUFBQSxNQUEwQkMsQ0FBQyxHQUFHSCxDQUFDLEdBQUcsQ0FBSixHQUFRSCxNQUFSLEdBQWlC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XG4vLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbnZhciBfX3BhcmFtID0gKHRoaXMgJiYgdGhpcy5fX3BhcmFtKSB8fCBmdW5jdGlvbiAocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgaW52ZXJzaWZ5XzEgPSByZXF1aXJlKFwiaW52ZXJzaWZ5XCIpO1xuY29uc3QgdHlwZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9pb2MvdHlwZXNcIik7XG5jb25zdCB0eXBlc18yID0gcmVxdWlyZShcIi4uL2FwcGxpY2F0aW9uL3R5cGVzXCIpO1xuY29uc3Qgc2VydmljZV8xID0gcmVxdWlyZShcIi4vc2VydmljZVwiKTtcbmxldCBUZXJtaW5hbFNlcnZpY2VGYWN0b3J5ID0gY2xhc3MgVGVybWluYWxTZXJ2aWNlRmFjdG9yeSB7XG4gICAgY29uc3RydWN0b3Ioc2VydmljZUNvbnRhaW5lcikge1xuICAgICAgICB0aGlzLnNlcnZpY2VDb250YWluZXIgPSBzZXJ2aWNlQ29udGFpbmVyO1xuICAgICAgICB0aGlzLnRlcm1pbmFsU2VydmljZXMgPSBuZXcgTWFwKCk7XG4gICAgfVxuICAgIGdldFRlcm1pbmFsU2VydmljZShyZXNvdXJjZSwgdGl0bGUpIHtcbiAgICAgICAgY29uc3QgdGVybWluYWxUaXRsZSA9IHR5cGVvZiB0aXRsZSA9PT0gJ3N0cmluZycgJiYgdGl0bGUudHJpbSgpLmxlbmd0aCA+IDAgPyB0aXRsZS50cmltKCkgOiAnUHl0aG9uJztcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmdldFRlcm1pbmFsSWQodGVybWluYWxUaXRsZSwgcmVzb3VyY2UpO1xuICAgICAgICBpZiAoIXRoaXMudGVybWluYWxTZXJ2aWNlcy5oYXMoaWQpKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXJtaW5hbFNlcnZpY2UgPSBuZXcgc2VydmljZV8xLlRlcm1pbmFsU2VydmljZSh0aGlzLnNlcnZpY2VDb250YWluZXIsIHJlc291cmNlLCB0ZXJtaW5hbFRpdGxlKTtcbiAgICAgICAgICAgIHRoaXMudGVybWluYWxTZXJ2aWNlcy5zZXQoaWQsIHRlcm1pbmFsU2VydmljZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudGVybWluYWxTZXJ2aWNlcy5nZXQoaWQpO1xuICAgIH1cbiAgICBjcmVhdGVUZXJtaW5hbFNlcnZpY2UocmVzb3VyY2UsIHRpdGxlKSB7XG4gICAgICAgIGNvbnN0IHRlcm1pbmFsVGl0bGUgPSB0eXBlb2YgdGl0bGUgPT09ICdzdHJpbmcnICYmIHRpdGxlLnRyaW0oKS5sZW5ndGggPiAwID8gdGl0bGUudHJpbSgpIDogJ1B5dGhvbic7XG4gICAgICAgIHJldHVybiBuZXcgc2VydmljZV8xLlRlcm1pbmFsU2VydmljZSh0aGlzLnNlcnZpY2VDb250YWluZXIsIHJlc291cmNlLCB0ZXJtaW5hbFRpdGxlKTtcbiAgICB9XG4gICAgZ2V0VGVybWluYWxJZCh0aXRsZSwgcmVzb3VyY2UpIHtcbiAgICAgICAgaWYgKCFyZXNvdXJjZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRpdGxlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHdvcmtzcGFjZUZvbGRlciA9IHRoaXMuc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMi5JV29ya3NwYWNlU2VydmljZSkuZ2V0V29ya3NwYWNlRm9sZGVyKHJlc291cmNlKTtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUZvbGRlciA/IGAke3RpdGxlfToke3dvcmtzcGFjZUZvbGRlci51cmkuZnNQYXRofWAgOiB0aXRsZTtcbiAgICB9XG59O1xuVGVybWluYWxTZXJ2aWNlRmFjdG9yeSA9IF9fZGVjb3JhdGUoW1xuICAgIGludmVyc2lmeV8xLmluamVjdGFibGUoKSxcbiAgICBfX3BhcmFtKDAsIGludmVyc2lmeV8xLmluamVjdCh0eXBlc18xLklTZXJ2aWNlQ29udGFpbmVyKSlcbl0sIFRlcm1pbmFsU2VydmljZUZhY3RvcnkpO1xuZXhwb3J0cy5UZXJtaW5hbFNlcnZpY2VGYWN0b3J5ID0gVGVybWluYWxTZXJ2aWNlRmFjdG9yeTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZhY3RvcnkuanMubWFwIl19