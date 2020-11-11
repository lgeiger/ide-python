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

const chai_1 = require("chai");

const chaiAsPromised = require("chai-as-promised");

const path = require("path");

const TypeMoq = require("typemoq");

const vscode_1 = require("vscode");

const types_1 = require("../../../client/common/application/types");

require("../../../client/common/extensions");

const productInstaller_1 = require("../../../client/common/installer/productInstaller");

const productService_1 = require("../../../client/common/installer/productService");

const types_2 = require("../../../client/common/installer/types");

const types_3 = require("../../../client/common/types");

const enum_1 = require("../../../client/common/utils/enum");

chai_1.use(chaiAsPromised);
suite('Module Installer - Invalid Paths', () => {
  [undefined, vscode_1.Uri.file('resource')].forEach(resource => {
    ['moduleName', path.join('users', 'dev', 'tool', 'executable')].forEach(pathToExecutable => {
      const isExecutableAModule = path.basename(pathToExecutable) === pathToExecutable;
      enum_1.getNamesAndValues(types_3.Product).forEach(product => {
        let installer;
        let serviceContainer;
        let app;
        let workspaceService;
        let productPathService;
        setup(() => {
          serviceContainer = TypeMoq.Mock.ofType();
          const outputChannel = TypeMoq.Mock.ofType();
          serviceContainer.setup(c => c.get(TypeMoq.It.isValue(types_2.IProductService), TypeMoq.It.isAny())).returns(() => new productService_1.ProductService());
          app = TypeMoq.Mock.ofType();
          serviceContainer.setup(c => c.get(TypeMoq.It.isValue(types_1.IApplicationShell), TypeMoq.It.isAny())).returns(() => app.object);
          workspaceService = TypeMoq.Mock.ofType();
          serviceContainer.setup(c => c.get(TypeMoq.It.isValue(types_1.IWorkspaceService), TypeMoq.It.isAny())).returns(() => workspaceService.object);
          productPathService = TypeMoq.Mock.ofType();
          serviceContainer.setup(c => c.get(TypeMoq.It.isValue(types_2.IProductPathService), TypeMoq.It.isAny())).returns(() => productPathService.object);
          installer = new productInstaller_1.ProductInstaller(serviceContainer.object, outputChannel.object);
        });

        switch (product.value) {
          case types_3.Product.isort:
          case types_3.Product.ctags:
          case types_3.Product.rope:
          case types_3.Product.unittest:
            {
              return;
            }

          default:
            {
              test(`Ensure invalid path message is ${isExecutableAModule ? 'not displayed' : 'displayed'} ${product.name} (${resource ? 'With a resource' : 'without a resource'})`, () => __awaiter(void 0, void 0, void 0, function* () {
                // If the path to executable is a module, then we won't display error message indicating path is invalid.
                productPathService.setup(p => p.getExecutableNameFromSettings(TypeMoq.It.isAny(), TypeMoq.It.isValue(resource))).returns(() => pathToExecutable).verifiable(TypeMoq.Times.atLeast(isExecutableAModule ? 0 : 1));
                productPathService.setup(p => p.isExecutableAModule(TypeMoq.It.isAny(), TypeMoq.It.isValue(resource))).returns(() => isExecutableAModule).verifiable(TypeMoq.Times.atLeastOnce());
                const anyParams = [0, 1, 2, 3, 4, 5].map(() => TypeMoq.It.isAny());
                app.setup(a => a.showErrorMessage(TypeMoq.It.isAny(), ...anyParams)).callback(message => {
                  if (!isExecutableAModule) {
                    chai_1.expect(message).contains(pathToExecutable);
                  }
                }).returns(() => Promise.resolve(undefined)).verifiable(TypeMoq.Times.exactly(1));
                yield installer.promptToInstall(product.value, resource);
                productPathService.verifyAll();
              }));
            }
        }
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluc3RhbGxlci5pbnZhbGlkUGF0aC51bml0LnRlc3QuanMiXSwibmFtZXMiOlsiX19hd2FpdGVyIiwidGhpc0FyZyIsIl9hcmd1bWVudHMiLCJQIiwiZ2VuZXJhdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmdWxmaWxsZWQiLCJ2YWx1ZSIsInN0ZXAiLCJuZXh0IiwiZSIsInJlamVjdGVkIiwicmVzdWx0IiwiZG9uZSIsInRoZW4iLCJhcHBseSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsImNoYWlfMSIsInJlcXVpcmUiLCJjaGFpQXNQcm9taXNlZCIsInBhdGgiLCJUeXBlTW9xIiwidnNjb2RlXzEiLCJ0eXBlc18xIiwicHJvZHVjdEluc3RhbGxlcl8xIiwicHJvZHVjdFNlcnZpY2VfMSIsInR5cGVzXzIiLCJ0eXBlc18zIiwiZW51bV8xIiwidXNlIiwic3VpdGUiLCJ1bmRlZmluZWQiLCJVcmkiLCJmaWxlIiwiZm9yRWFjaCIsInJlc291cmNlIiwiam9pbiIsInBhdGhUb0V4ZWN1dGFibGUiLCJpc0V4ZWN1dGFibGVBTW9kdWxlIiwiYmFzZW5hbWUiLCJnZXROYW1lc0FuZFZhbHVlcyIsIlByb2R1Y3QiLCJwcm9kdWN0IiwiaW5zdGFsbGVyIiwic2VydmljZUNvbnRhaW5lciIsImFwcCIsIndvcmtzcGFjZVNlcnZpY2UiLCJwcm9kdWN0UGF0aFNlcnZpY2UiLCJzZXR1cCIsIk1vY2siLCJvZlR5cGUiLCJvdXRwdXRDaGFubmVsIiwiYyIsImdldCIsIkl0IiwiaXNWYWx1ZSIsIklQcm9kdWN0U2VydmljZSIsImlzQW55IiwicmV0dXJucyIsIlByb2R1Y3RTZXJ2aWNlIiwiSUFwcGxpY2F0aW9uU2hlbGwiLCJvYmplY3QiLCJJV29ya3NwYWNlU2VydmljZSIsIklQcm9kdWN0UGF0aFNlcnZpY2UiLCJQcm9kdWN0SW5zdGFsbGVyIiwiaXNvcnQiLCJjdGFncyIsInJvcGUiLCJ1bml0dGVzdCIsInRlc3QiLCJuYW1lIiwicCIsImdldEV4ZWN1dGFibGVOYW1lRnJvbVNldHRpbmdzIiwidmVyaWZpYWJsZSIsIlRpbWVzIiwiYXRMZWFzdCIsImF0TGVhc3RPbmNlIiwiYW55UGFyYW1zIiwibWFwIiwiYSIsInNob3dFcnJvck1lc3NhZ2UiLCJjYWxsYmFjayIsIm1lc3NhZ2UiLCJleHBlY3QiLCJjb250YWlucyIsImV4YWN0bHkiLCJwcm9tcHRUb0luc3RhbGwiLCJ2ZXJpZnlBbGwiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJQSxTQUFTLEdBQUksVUFBUSxTQUFLQSxTQUFkLElBQTRCLFVBQVVDLE9BQVYsRUFBbUJDLFVBQW5CLEVBQStCQyxDQUEvQixFQUFrQ0MsU0FBbEMsRUFBNkM7QUFDckYsU0FBTyxLQUFLRCxDQUFDLEtBQUtBLENBQUMsR0FBR0UsT0FBVCxDQUFOLEVBQXlCLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQ3ZELGFBQVNDLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCO0FBQUUsVUFBSTtBQUFFQyxRQUFBQSxJQUFJLENBQUNOLFNBQVMsQ0FBQ08sSUFBVixDQUFlRixLQUFmLENBQUQsQ0FBSjtBQUE4QixPQUFwQyxDQUFxQyxPQUFPRyxDQUFQLEVBQVU7QUFBRUwsUUFBQUEsTUFBTSxDQUFDSyxDQUFELENBQU47QUFBWTtBQUFFOztBQUMzRixhQUFTQyxRQUFULENBQWtCSixLQUFsQixFQUF5QjtBQUFFLFVBQUk7QUFBRUMsUUFBQUEsSUFBSSxDQUFDTixTQUFTLENBQUMsT0FBRCxDQUFULENBQW1CSyxLQUFuQixDQUFELENBQUo7QUFBa0MsT0FBeEMsQ0FBeUMsT0FBT0csQ0FBUCxFQUFVO0FBQUVMLFFBQUFBLE1BQU0sQ0FBQ0ssQ0FBRCxDQUFOO0FBQVk7QUFBRTs7QUFDOUYsYUFBU0YsSUFBVCxDQUFjSSxNQUFkLEVBQXNCO0FBQUVBLE1BQUFBLE1BQU0sQ0FBQ0MsSUFBUCxHQUFjVCxPQUFPLENBQUNRLE1BQU0sQ0FBQ0wsS0FBUixDQUFyQixHQUFzQyxJ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OlsiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cclxuJ3VzZSBzdHJpY3QnO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGNoYWlfMSA9IHJlcXVpcmUoXCJjaGFpXCIpO1xyXG5jb25zdCBjaGFpQXNQcm9taXNlZCA9IHJlcXVpcmUoXCJjaGFpLWFzLXByb21pc2VkXCIpO1xyXG5jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XHJcbmNvbnN0IFR5cGVNb3EgPSByZXF1aXJlKFwidHlwZW1vcVwiKTtcclxuY29uc3QgdnNjb2RlXzEgPSByZXF1aXJlKFwidnNjb2RlXCIpO1xyXG5jb25zdCB0eXBlc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NsaWVudC9jb21tb24vYXBwbGljYXRpb24vdHlwZXNcIik7XHJcbnJlcXVpcmUoXCIuLi8uLi8uLi9jbGllbnQvY29tbW9uL2V4dGVuc2lvbnNcIik7XHJcbmNvbnN0IHByb2R1Y3RJbnN0YWxsZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jbGllbnQvY29tbW9uL2luc3RhbGxlci9wcm9kdWN0SW5zdGFsbGVyXCIpO1xyXG5jb25zdCBwcm9kdWN0U2VydmljZV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NsaWVudC9jb21tb24vaW5zdGFsbGVyL3Byb2R1Y3RTZXJ2aWNlXCIpO1xyXG5jb25zdCB0eXBlc18yID0gcmVxdWlyZShcIi4uLy4uLy4uL2NsaWVudC9jb21tb24vaW5zdGFsbGVyL3R5cGVzXCIpO1xyXG5jb25zdCB0eXBlc18zID0gcmVxdWlyZShcIi4uLy4uLy4uL2NsaWVudC9jb21tb24vdHlwZXNcIik7XHJcbmNvbnN0IGVudW1fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jbGllbnQvY29tbW9uL3V0aWxzL2VudW1cIik7XHJcbmNoYWlfMS51c2UoY2hhaUFzUHJvbWlzZWQpO1xyXG5zdWl0ZSgnTW9kdWxlIEluc3RhbGxlciAtIEludmFsaWQgUGF0aHMnLCAoKSA9PiB7XHJcbiAgICBbdW5kZWZpbmVkLCB2c2NvZGVfMS5VcmkuZmlsZSgncmVzb3VyY2UnKV0uZm9yRWFjaChyZXNvdXJjZSA9PiB7XHJcbiAgICAgICAgWydtb2R1bGVOYW1lJywgcGF0aC5qb2luKCd1c2VycycsICdkZXYnLCAndG9vbCcsICdleGVjdXRhYmxlJyldLmZvckVhY2gocGF0aFRvRXhlY3V0YWJsZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzRXhlY3V0YWJsZUFNb2R1bGUgPSBwYXRoLmJhc2VuYW1lKHBhdGhUb0V4ZWN1dGFibGUpID09PSBwYXRoVG9FeGVjdXRhYmxlO1xyXG4gICAgICAgICAgICBlbnVtXzEuZ2V0TmFtZXNBbmRWYWx1ZXModHlwZXNfMy5Qcm9kdWN0KS5mb3JFYWNoKHByb2R1Y3QgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluc3RhbGxlcjtcclxuICAgICAgICAgICAgICAgIGxldCBzZXJ2aWNlQ29udGFpbmVyO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFwcDtcclxuICAgICAgICAgICAgICAgIGxldCB3b3Jrc3BhY2VTZXJ2aWNlO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb2R1Y3RQYXRoU2VydmljZTtcclxuICAgICAgICAgICAgICAgIHNldHVwKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlQ29udGFpbmVyID0gVHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG91dHB1dENoYW5uZWwgPSBUeXBlTW9xLk1vY2sub2ZUeXBlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZUNvbnRhaW5lci5zZXR1cChjID0+IGMuZ2V0KFR5cGVNb3EuSXQuaXNWYWx1ZSh0eXBlc18yLklQcm9kdWN0U2VydmljZSksIFR5cGVNb3EuSXQuaXNBbnkoKSkpLnJldHVybnMoKCkgPT4gbmV3IHByb2R1Y3RTZXJ2aWNlXzEuUHJvZHVjdFNlcnZpY2UoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwID0gVHlwZU1vcS5Nb2NrLm9mVHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VDb250YWluZXIuc2V0dXAoYyA9PiBjLmdldChUeXBlTW9xLkl0LmlzVmFsdWUodHlwZXNfMS5JQXBwbGljYXRpb25TaGVsbCksIFR5cGVNb3EuSXQuaXNBbnkoKSkpLnJldHVybnMoKCkgPT4gYXBwLm9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya3NwYWNlU2VydmljZSA9IFR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlQ29udGFpbmVyLnNldHVwKGMgPT4gYy5nZXQoVHlwZU1vcS5JdC5pc1ZhbHVlKHR5cGVzXzEuSVdvcmtzcGFjZVNlcnZpY2UpLCBUeXBlTW9xLkl0LmlzQW55KCkpKS5yZXR1cm5zKCgpID0+IHdvcmtzcGFjZVNlcnZpY2Uub2JqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0UGF0aFNlcnZpY2UgPSBUeXBlTW9xLk1vY2sub2ZUeXBlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZUNvbnRhaW5lci5zZXR1cChjID0+IGMuZ2V0KFR5cGVNb3EuSXQuaXNWYWx1ZSh0eXBlc18yLklQcm9kdWN0UGF0aFNlcnZpY2UpLCBUeXBlTW9xLkl0LmlzQW55KCkpKS5yZXR1cm5zKCgpID0+IHByb2R1Y3RQYXRoU2VydmljZS5vYmplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbGxlciA9IG5ldyBwcm9kdWN0SW5zdGFsbGVyXzEuUHJvZHVjdEluc3RhbGxlcihzZXJ2aWNlQ29udGFpbmVyLm9iamVjdCwgb3V0cHV0Q2hhbm5lbC5vYmplY3QpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHByb2R1Y3QudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzXzMuUHJvZHVjdC5pc29ydDpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzXzMuUHJvZHVjdC5jdGFnczpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzXzMuUHJvZHVjdC5yb3BlOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXNfMy5Qcm9kdWN0LnVuaXR0ZXN0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXN0KGBFbnN1cmUgaW52YWxpZCBwYXRoIG1lc3NhZ2UgaXMgJHtpc0V4ZWN1dGFibGVBTW9kdWxlID8gJ25vdCBkaXNwbGF5ZWQnIDogJ2Rpc3BsYXllZCd9ICR7cHJvZHVjdC5uYW1lfSAoJHtyZXNvdXJjZSA/ICdXaXRoIGEgcmVzb3VyY2UnIDogJ3dpdGhvdXQgYSByZXNvdXJjZSd9KWAsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBwYXRoIHRvIGV4ZWN1dGFibGUgaXMgYSBtb2R1bGUsIHRoZW4gd2Ugd29uJ3QgZGlzcGxheSBlcnJvciBtZXNzYWdlIGluZGljYXRpbmcgcGF0aCBpcyBpbnZhbGlkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdFBhdGhTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldHVwKHAgPT4gcC5nZXRFeGVjdXRhYmxlTmFtZUZyb21TZXR0aW5ncyhUeXBlTW9xLkl0LmlzQW55KCksIFR5cGVNb3EuSXQuaXNWYWx1ZShyZXNvdXJjZSkpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXR1cm5zKCgpID0+IHBhdGhUb0V4ZWN1dGFibGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnZlcmlmaWFibGUoVHlwZU1vcS5UaW1lcy5hdExlYXN0KGlzRXhlY3V0YWJsZUFNb2R1bGUgPyAwIDogMSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdFBhdGhTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldHVwKHAgPT4gcC5pc0V4ZWN1dGFibGVBTW9kdWxlKFR5cGVNb3EuSXQuaXNBbnkoKSwgVHlwZU1vcS5JdC5pc1ZhbHVlKHJlc291cmNlKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJldHVybnMoKCkgPT4gaXNFeGVjdXRhYmxlQU1vZHVsZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudmVyaWZpYWJsZShUeXBlTW9xLlRpbWVzLmF0TGVhc3RPbmNlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYW55UGFyYW1zID0gWzAsIDEsIDIsIDMsIDQsIDVdLm1hcCgoKSA9PiBUeXBlTW9xLkl0LmlzQW55KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwLnNldHVwKGEgPT4gYS5zaG93RXJyb3JNZXNzYWdlKFR5cGVNb3EuSXQuaXNBbnkoKSwgLi4uYW55UGFyYW1zKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2FsbGJhY2sobWVzc2FnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0V4ZWN1dGFibGVBTW9kdWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYWlfMS5leHBlY3QobWVzc2FnZSkuY29udGFpbnMocGF0aFRvRXhlY3V0YWJsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmV0dXJucygoKSA9PiBQcm9taXNlLnJlc29sdmUodW5kZWZpbmVkKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudmVyaWZpYWJsZShUeXBlTW9xLlRpbWVzLmV4YWN0bHkoMSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeWllbGQgaW5zdGFsbGVyLnByb21wdFRvSW5zdGFsbChwcm9kdWN0LnZhbHVlLCByZXNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0UGF0aFNlcnZpY2UudmVyaWZ5QWxsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbnN0YWxsZXIuaW52YWxpZFBhdGgudW5pdC50ZXN0LmpzLm1hcCJdfQ==