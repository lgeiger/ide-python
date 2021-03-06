// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const types_1 = require("../application/types");

const webPanelProvider_1 = require("../application/webPanelProvider");

const types_2 = require("../types");

const channelManager_1 = require("./channelManager");

const condaInstaller_1 = require("./condaInstaller");

const pipEnvInstaller_1 = require("./pipEnvInstaller");

const pipInstaller_1 = require("./pipInstaller");

const productPath_1 = require("./productPath");

const productService_1 = require("./productService");

const types_3 = require("./types");

function registerTypes(serviceManager) {
  serviceManager.addSingleton(types_3.IModuleInstaller, condaInstaller_1.CondaInstaller);
  serviceManager.addSingleton(types_3.IModuleInstaller, pipInstaller_1.PipInstaller);
  serviceManager.addSingleton(types_3.IModuleInstaller, pipEnvInstaller_1.PipEnvInstaller);
  serviceManager.addSingleton(types_3.IInstallationChannelManager, channelManager_1.InstallationChannelManager);
  serviceManager.addSingleton(types_3.IProductService, productService_1.ProductService);
  serviceManager.addSingleton(types_3.IProductPathService, productPath_1.CTagsProductPathService, types_2.ProductType.WorkspaceSymbols);
  serviceManager.addSingleton(types_3.IProductPathService, productPath_1.FormatterProductPathService, types_2.ProductType.Formatter);
  serviceManager.addSingleton(types_3.IProductPathService, productPath_1.LinterProductPathService, types_2.ProductType.Linter);
  serviceManager.addSingleton(types_3.IProductPathService, productPath_1.TestFrameworkProductPathService, types_2.ProductType.TestFramework);
  serviceManager.addSingleton(types_3.IProductPathService, productPath_1.RefactoringLibraryProductPathService, types_2.ProductType.RefactoringLibrary);
  serviceManager.addSingleton(types_1.IWebPanelProvider, webPanelProvider_1.WebPanelProvider);
}

exports.registerTypes = registerTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VSZWdpc3RyeS5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsInR5cGVzXzEiLCJyZXF1aXJlIiwid2ViUGFuZWxQcm92aWRlcl8xIiwidHlwZXNfMiIsImNoYW5uZWxNYW5hZ2VyXzEiLCJjb25kYUluc3RhbGxlcl8xIiwicGlwRW52SW5zdGFsbGVyXzEiLCJwaXBJbnN0YWxsZXJfMSIsInByb2R1Y3RQYXRoXzEiLCJwcm9kdWN0U2VydmljZV8xIiwidHlwZXNfMyIsInJlZ2lzdGVyVHlwZXMiLCJzZXJ2aWNlTWFuYWdlciIsImFkZFNpbmdsZXRvbiIsIklNb2R1bGVJbnN0YWxsZXIiLCJDb25kYUluc3RhbGxlciIsIlBpcEluc3RhbGxlciIsIlBpcEVudkluc3RhbGxlciIsIklJbnN0YWxsYXRpb25DaGFubmVsTWFuYWdlciIsIkluc3RhbGxhdGlvbkNoYW5uZWxNYW5hZ2VyIiwiSVByb2R1Y3RTZXJ2aWNlIiwiUHJvZHVjdFNlcnZpY2UiLCJJUHJvZHVjdFBhdGhTZXJ2aWNlIiwiQ1RhZ3NQcm9kdWN0UGF0aFNlcnZpY2UiLCJQcm9kdWN0VHlwZSIsIldvcmtzcGFjZVN5bWJvbHMiLCJGb3JtYXR0ZXJQcm9kdWN0UGF0aFNlcnZpY2UiLCJGb3JtYXR0ZXIiLCJMaW50ZXJQcm9kdWN0UGF0aFNlcnZpY2UiLCJMaW50ZXIiLCJUZXN0RnJhbWV3b3JrUHJvZHVjdFBhdGhTZXJ2aWNlIiwiVGVzdEZyYW1ld29yayIsIlJlZmFjdG9yaW5nTGlicmFyeVByb2R1Y3RQYXRoU2VydmljZSIsIlJlZmFjdG9yaW5nTGlicmFyeSIsIklXZWJQYW5lbFByb3ZpZGVyIiwiV2ViUGFuZWxQcm92aWRlciJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUNBQSxNQUFNLENBQUNDLGNBQVAsQ0FBc0JDLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUVDLEVBQUFBLEtBQUssRUFBRTtBQUFULENBQTdDOztBQUNBLE1BQU1DLE9BQU8sR0FBR0MsT0FBTyxDQUFDLHNCQUFELENBQXZCOztBQUNBLE1BQU1DLGtCQUFrQixHQUFHRCxPQUFPLENBQUMsaUNBQUQsQ0FBbEM7O0FBQ0EsTUFBTUUsT0FBTyxHQUFHRixPQUFPLENBQUMsVUFBRCxDQUF2Qjs7QUFDQSxNQUFNRyxnQkFBZ0IsR0FBR0gsT0FBTyxDQUFDLGtCQUFELENBQWhDOztBQUNBLE1BQU1JLGdCQUFnQixHQUFHSixPQUFPLENBQUMsa0JBQUQsQ0FBaEM7O0FBQ0EsTUFBTUssaUJBQWlCLEdBQUdMLE9BQU8sQ0FBQyxtQkFBRCxDQUFqQzs7QUFDQSxNQUFNTSxjQUFjLEdBQUdOLE9BQU8sQ0FBQyxnQkFBRCxDQUE5Qjs7QUFDQSxNQUFNTyxhQUFhLEdBQUdQLE9BQU8sQ0FBQyxlQUFELENBQTdCOztBQUNBLE1BQU1RLGdCQUFnQixHQUFHUixPQUFPLENBQUMsa0JBQUQsQ0FBaEM7O0FBQ0EsTUFBTVMsT0FBTyxHQUFHVCxPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFDQSxTQUFTVSxhQUFULENBQXVCQyxjQUF2QixFQUF1QztBQUNuQ0EsRUFBQUEsY0FBYyxDQUFDQyxZQUFmLENBQTRCSCxPQUFPLENBQUNJLGdCQUFwQyxFQUFzRFQsZ0JBQWdCLENBQUNVLGNBQXZFO0FBQ0FILEVBQUFBLGNBQWMsQ0FBQ0MsWUFBZixDQUE0QkgsT0FBTyxDQUFDSSxnQkFBcEMsRUFBc0RQLGNBQWMsQ0FBQ1MsWUFBckU7QUFDQUosRUFBQUEsY0FBYyxDQUFDQyxZQUFmLENBQTRCSCxPQUFPLENBQUNJLGdCQUFwQyxFQUFzRFIsaUJBQWlCLENBQUNXLGVBQXhFO0FBQ0FMLEVBQUFBLGNBQWMsQ0FBQ0MsWUFBZixDQUE0QkgsT0FBTyxDQUFDUSwyQkFBcEMsRUFBaUVkLGdCQUFnQixDQUFDZSwwQkFBbEY7QUFDQVAsRUFBQUEsY0FBYyxDQUFDQyxZQUFmLENBQTRCSCxPQUFPLENBQUNVLGVBQXBDLEVBQXFEWCxnQkFBZ0IsQ0FBQ1ksY0FBdEU7QUFDQVQsRUFBQUEsY0FBYyxDQUFDQyxZQUFmLENBQTRCSCxPQUFPLENBQUNZLG1CQUFwQyxFQUF5RGQsYUFBYSxDQUFDZSx1QkFBdkUsRUFBZ0dwQixPQUFPLENBQUNxQixXQUFSLENBQW9CQyxnQkFBcEg7QUFDQWIsRUFBQUEsY0FBYyxDQUFDQyxZQUFmLENBQTRCSCxPQUFPLENBQUNZLG1CQUFwQyxFQUF5RGQsYUFBYSxDQUFDa0IsMkJBQXZFLEVBQW9HdkIsT0FBTyxDQUFDcUIsV0FBUixDQUFvQkcsU0FBeEg7QUFDQWYsRUFBQUEsY0FBYyxDQUFDQyxZQUFmLENBQTRCSCxPQUFPLENBQUNZLG1CQUFwQyxFQUF5RGQsYUFBYSxDQUFDb0Isd0JBQXZFLEVBQWlHekIsT0FBTyxDQUFDcUIsV0FBUixDQUFvQkssTUFBckg7QUFDQWpCLEVBQUFBLGNBQWMsQ0FBQ0MsWUFBZixDQUE0QkgsT0FBTyxDQUFDWSxtQkFBcEMsRUFBeURkLGFBQWEsQ0FBQ3NCLCtCQUF2RSxFQUF3RzNCLE9BQU8sQ0FBQ3FCLFdBQVIsQ0FBb0JPLGFBQTVIO0FBQ0FuQixFQUFBQSxjQUFjLENBQUNDLFlBQWYsQ0FBNEJILE9BQU8sQ0FBQ1ksbUJBQXBDLEVBQXlEZCxhQUFhLENBQUN3QixvQ0FBdkUsRUFBNkc3QixPQUFPLENBQUNxQixXQUFSLENBQW9CUyxrQkFBakk7QUFDQXJCLEVBQUFBLGNBQWMsQ0FBQ0MsWUFBZixDQUE0QmIsT0FBTyxDQUFDa0MsaUJBQXBDLEVBQXVEaEMsa0JBQWtCLENBQUNpQyxnQkFBMUU7QUFDSDs7QUFDRHJDLE9BQU8sQ0FBQ2EsYUFBUixHQUF3QkEsYUFBeEIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbid1c2Ugc3RyaWN0Jztcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vYXBwbGljYXRpb24vdHlwZXNcIik7XG5jb25zdCB3ZWJQYW5lbFByb3ZpZGVyXzEgPSByZXF1aXJlKFwiLi4vYXBwbGljYXRpb24vd2ViUGFuZWxQcm92aWRlclwiKTtcbmNvbnN0IHR5cGVzXzIgPSByZXF1aXJlKFwiLi4vdHlwZXNcIik7XG5jb25zdCBjaGFubmVsTWFuYWdlcl8xID0gcmVxdWlyZShcIi4vY2hhbm5lbE1hbmFnZXJcIik7XG5jb25zdCBjb25kYUluc3RhbGxlcl8xID0gcmVxdWlyZShcIi4vY29uZGFJbnN0YWxsZXJcIik7XG5jb25zdCBwaXBFbnZJbnN0YWxsZXJfMSA9IHJlcXVpcmUoXCIuL3BpcEVudkluc3RhbGxlclwiKTtcbmNvbnN0IHBpcEluc3RhbGxlcl8xID0gcmVxdWlyZShcIi4vcGlwSW5zdGFsbGVyXCIpO1xuY29uc3QgcHJvZHVjdFBhdGhfMSA9IHJlcXVpcmUoXCIuL3Byb2R1Y3RQYXRoXCIpO1xuY29uc3QgcHJvZHVjdFNlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL3Byb2R1Y3RTZXJ2aWNlXCIpO1xuY29uc3QgdHlwZXNfMyA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xuZnVuY3Rpb24gcmVnaXN0ZXJUeXBlcyhzZXJ2aWNlTWFuYWdlcikge1xuICAgIHNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbih0eXBlc18zLklNb2R1bGVJbnN0YWxsZXIsIGNvbmRhSW5zdGFsbGVyXzEuQ29uZGFJbnN0YWxsZXIpO1xuICAgIHNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbih0eXBlc18zLklNb2R1bGVJbnN0YWxsZXIsIHBpcEluc3RhbGxlcl8xLlBpcEluc3RhbGxlcik7XG4gICAgc2VydmljZU1hbmFnZXIuYWRkU2luZ2xldG9uKHR5cGVzXzMuSU1vZHVsZUluc3RhbGxlciwgcGlwRW52SW5zdGFsbGVyXzEuUGlwRW52SW5zdGFsbGVyKTtcbiAgICBzZXJ2aWNlTWFuYWdlci5hZGRTaW5nbGV0b24odHlwZXNfMy5JSW5zdGFsbGF0aW9uQ2hhbm5lbE1hbmFnZXIsIGNoYW5uZWxNYW5hZ2VyXzEuSW5zdGFsbGF0aW9uQ2hhbm5lbE1hbmFnZXIpO1xuICAgIHNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbih0eXBlc18zLklQcm9kdWN0U2VydmljZSwgcHJvZHVjdFNlcnZpY2VfMS5Qcm9kdWN0U2VydmljZSk7XG4gICAgc2VydmljZU1hbmFnZXIuYWRkU2luZ2xldG9uKHR5cGVzXzMuSVByb2R1Y3RQYXRoU2VydmljZSwgcHJvZHVjdFBhdGhfMS5DVGFnc1Byb2R1Y3RQYXRoU2VydmljZSwgdHlwZXNfMi5Qcm9kdWN0VHlwZS5Xb3Jrc3BhY2VTeW1ib2xzKTtcbiAgICBzZXJ2aWNlTWFuYWdlci5hZGRTaW5nbGV0b24odHlwZXNfMy5JUHJvZHVjdFBhdGhTZXJ2aWNlLCBwcm9kdWN0UGF0aF8xLkZvcm1hdHRlclByb2R1Y3RQYXRoU2VydmljZSwgdHlwZXNfMi5Qcm9kdWN0VHlwZS5Gb3JtYXR0ZXIpO1xuICAgIHNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbih0eXBlc18zLklQcm9kdWN0UGF0aFNlcnZpY2UsIHByb2R1Y3RQYXRoXzEuTGludGVyUHJvZHVjdFBhdGhTZXJ2aWNlLCB0eXBlc18yLlByb2R1Y3RUeXBlLkxpbnRlcik7XG4gICAgc2VydmljZU1hbmFnZXIuYWRkU2luZ2xldG9uKHR5cGVzXzMuSVByb2R1Y3RQYXRoU2VydmljZSwgcHJvZHVjdFBhdGhfMS5UZXN0RnJhbWV3b3JrUHJvZHVjdFBhdGhTZXJ2aWNlLCB0eXBlc18yLlByb2R1Y3RUeXBlLlRlc3RGcmFtZXdvcmspO1xuICAgIHNlcnZpY2VNYW5hZ2VyLmFkZFNpbmdsZXRvbih0eXBlc18zLklQcm9kdWN0UGF0aFNlcnZpY2UsIHByb2R1Y3RQYXRoXzEuUmVmYWN0b3JpbmdMaWJyYXJ5UHJvZHVjdFBhdGhTZXJ2aWNlLCB0eXBlc18yLlByb2R1Y3RUeXBlLlJlZmFjdG9yaW5nTGlicmFyeSk7XG4gICAgc2VydmljZU1hbmFnZXIuYWRkU2luZ2xldG9uKHR5cGVzXzEuSVdlYlBhbmVsUHJvdmlkZXIsIHdlYlBhbmVsUHJvdmlkZXJfMS5XZWJQYW5lbFByb3ZpZGVyKTtcbn1cbmV4cG9ydHMucmVnaXN0ZXJUeXBlcyA9IHJlZ2lzdGVyVHlwZXM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zZXJ2aWNlUmVnaXN0cnkuanMubWFwIl19