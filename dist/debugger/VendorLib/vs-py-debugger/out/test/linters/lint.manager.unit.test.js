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

const TypeMoq = require("typemoq");

const types_1 = require("../../client/common/types");

const linterManager_1 = require("../../client/linters/linterManager"); // setup class instance


class TestLinterManager extends linterManager_1.LinterManager {
  constructor() {
    super(...arguments);
    this.enableUnconfiguredLintersCallCount = 0;
  }

  enableUnconfiguredLinters(resource) {
    return __awaiter(this, void 0, void 0, function* () {
      this.enableUnconfiguredLintersCallCount += 1;
    });
  }

}

function getServiceContainerMockForLinterManagerTests() {
  // setup test mocks
  const serviceContainerMock = TypeMoq.Mock.ofType();
  const configMock = TypeMoq.Mock.ofType();
  const pythonSettingsMock = TypeMoq.Mock.ofType();
  configMock.setup(cm => cm.getSettings(TypeMoq.It.isAny())).returns(() => pythonSettingsMock.object);
  serviceContainerMock.setup(c => c.get(types_1.IConfigurationService)).returns(() => configMock.object);
  return serviceContainerMock;
} // tslint:disable-next-line:max-func-body-length


suite('Lint Manager Unit Tests', () => {
  const workspaceService = TypeMoq.Mock.ofType();
  test('Linter manager isLintingEnabled checks availability when silent = false.', () => __awaiter(void 0, void 0, void 0, function* () {
    // set expectations
    const expectedCallCount = 1;
    const silentFlag = false; // get setup

    const serviceContainerMock = getServiceContainerMockForLinterManagerTests(); // make the call

    const lm = new TestLinterManager(serviceContainerMock.object, workspaceService.object);
    yield lm.isLintingEnabled(silentFlag); // test expectations

    chai_1.expect(lm.enableUnconfiguredLintersCallCount).to.equal(expectedCallCount);
  }));
  test('Linter manager isLintingEnabled does not check availability when silent = true.', () => __awaiter(void 0, void 0, void 0, function* () {
    // set expectations
    const expectedCallCount = 0;
    const silentFlag = true; // get setup

    const serviceContainerMock = getServiceContainerMockForLinterManagerTests(); // make the call

    const lm = new TestLinterManager(serviceContainerMock.object, workspaceService.object);
    yield lm.isLintingEnabled(silentFlag); // test expectations

    chai_1.expect(lm.enableUnconfiguredLintersCallCount).to.equal(expectedCallCount);
  }));
  test('Linter manager getActiveLinters checks availability when silent = false.', () => __awaiter(void 0, void 0, void 0, function* () {
    // set expectations
    const expectedCallCount = 1;
    const silentFlag = false; // get setup

    const serviceContainerMock = getServiceContainerMockForLinterManagerTests(); // make the call

    const lm = new TestLinterManager(serviceContainerMock.object, workspaceService.object);
    yield lm.getActiveLinters(silentFlag); // test expectations

    chai_1.expect(lm.enableUnconfiguredLintersCallCount).to.equal(expectedCallCount);
  }));
  test('Linter manager getActiveLinters checks availability when silent = true.', () => __awaiter(void 0, void 0, void 0, function* () {
    // set expectations
    const expectedCallCount = 0;
    const silentFlag = true; // get setup

    const serviceContainerMock = getServiceContainerMockForLinterManagerTests(); // make the call

    const lm = new TestLinterManager(serviceContainerMock.object, workspaceService.object);
    yield lm.getActiveLinters(silentFlag); // test expectations

    chai_1.expect(lm.enableUnconfiguredLintersCallCount).to.equal(expectedCallCount);
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpbnQubWFuYWdlci51bml0LnRlc3QuanMiXSwibmFtZXMiOlsiX19hd2FpdGVyIiwidGhpc0FyZyIsIl9hcmd1bWVudHMiLCJQIiwiZ2VuZXJhdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmdWxmaWxsZWQiLCJ2YWx1ZSIsInN0ZXAiLCJuZXh0IiwiZSIsInJlamVjdGVkIiwicmVzdWx0IiwiZG9uZSIsInRoZW4iLCJhcHBseSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsImNoYWlfMSIsInJlcXVpcmUiLCJUeXBlTW9xIiwidHlwZXNfMSIsImxpbnRlck1hbmFnZXJfMSIsIlRlc3RMaW50ZXJNYW5hZ2VyIiwiTGludGVyTWFuYWdlciIsImNvbnN0cnVjdG9yIiwiYXJndW1lbnRzIiwiZW5hYmxlVW5jb25maWd1cmVkTGludGVyc0NhbGxDb3VudCIsImVuYWJsZVVuY29uZmlndXJlZExpbnRlcnMiLCJyZXNvdXJjZSIsImdldFNlcnZpY2VDb250YWluZXJNb2NrRm9yTGludGVyTWFuYWdlclRlc3RzIiwic2VydmljZUNvbnRhaW5lck1vY2siLCJNb2NrIiwib2ZUeXBlIiwiY29uZmlnTW9jayIsInB5dGhvblNldHRpbmdzTW9jayIsInNldHVwIiwiY20iLCJnZXRTZXR0aW5ncyIsIkl0IiwiaXNBbnkiLCJyZXR1cm5zIiwib2JqZWN0IiwiYyIsImdldCIsIklDb25maWd1cmF0aW9uU2VydmljZSIsInN1aXRlIiwid29ya3NwYWNlU2VydmljZSIsInRlc3QiLCJleHBlY3RlZENhbGxDb3VudCIsInNpbGVudEZsYWciLCJsbSIsImlzTGludGluZ0VuYWJsZWQiLCJleHBlY3QiLCJ0byIsImVxdWFsIiwiZ2V0QWN0aXZlTGludGVycyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUNBLElBQUlBLFNBQVMsR0FBSSxVQUFRLFNBQUtBLFNBQWQsSUFBNEIsVUFBVUMsT0FBVixFQUFtQkMsVUFBbkIsRUFBK0JD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SDtBQUNBLFVBQU1vRCxpQkFBaUIsR0FBRyxDQUExQjtBQUNBLFVBQU1DLFVBQVUsR0FBRyxJQUFuQixDQUgrSCxDQUkvSDs7QUFDQSxVQUFNbkIsb0JBQW9CLEdBQUdELDRDQUE0QyxFQUF6RSxDQUwrSCxDQU0vSDs7QUFDQSxVQUFNcUIsRUFBRSxHQUFHLElBQUk1QixpQkFBSixDQUFzQlEsb0JBQW9CLENBQUNXLE1BQTNDLEVBQW1ESyxnQkFBZ0IsQ0FBQ0wsTUFBcEUsQ0FBWDtBQUNBLFVBQU1TLEVBQUUsQ0FBQ0ssZ0JBQUgsQ0FBb0JOLFVBQXBCLENBQU4sQ0FSK0gsQ0FTL0g7O0FBQ0FoQyxJQUFBQSxNQUFNLENBQUNtQyxNQUFQLENBQWNGLEVBQUUsQ0FBQ3hCLGtDQUFqQixFQUFxRDJCLEVBQXJELENBQXdEQyxLQUF4RCxDQUE4RE4saUJBQTlEO0FBQ0gsR0FYOEYsQ0FBM0YsQ0FBSjtBQVlILENBbERJLENBQUwiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG4ndXNlIHN0cmljdCc7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgY2hhaV8xID0gcmVxdWlyZShcImNoYWlcIik7XHJcbmNvbnN0IFR5cGVNb3EgPSByZXF1aXJlKFwidHlwZW1vcVwiKTtcclxuY29uc3QgdHlwZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jbGllbnQvY29tbW9uL3R5cGVzXCIpO1xyXG5jb25zdCBsaW50ZXJNYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi4vLi4vY2xpZW50L2xpbnRlcnMvbGludGVyTWFuYWdlclwiKTtcclxuLy8gc2V0dXAgY2xhc3MgaW5zdGFuY2VcclxuY2xhc3MgVGVzdExpbnRlck1hbmFnZXIgZXh0ZW5kcyBsaW50ZXJNYW5hZ2VyXzEuTGludGVyTWFuYWdlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xyXG4gICAgICAgIHRoaXMuZW5hYmxlVW5jb25maWd1cmVkTGludGVyc0NhbGxDb3VudCA9IDA7XHJcbiAgICB9XHJcbiAgICBlbmFibGVVbmNvbmZpZ3VyZWRMaW50ZXJzKHJlc291cmNlKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVVbmNvbmZpZ3VyZWRMaW50ZXJzQ2FsbENvdW50ICs9IDE7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZ2V0U2VydmljZUNvbnRhaW5lck1vY2tGb3JMaW50ZXJNYW5hZ2VyVGVzdHMoKSB7XHJcbiAgICAvLyBzZXR1cCB0ZXN0IG1vY2tzXHJcbiAgICBjb25zdCBzZXJ2aWNlQ29udGFpbmVyTW9jayA9IFR5cGVNb3EuTW9jay5vZlR5cGUoKTtcclxuICAgIGNvbnN0IGNvbmZpZ01vY2sgPSBUeXBlTW9xLk1vY2sub2ZUeXBlKCk7XHJcbiAgICBjb25zdCBweXRob25TZXR0aW5nc01vY2sgPSBUeXBlTW9xLk1vY2sub2ZUeXBlKCk7XHJcbiAgICBjb25maWdNb2NrLnNldHVwKGNtID0+IGNtLmdldFNldHRpbmdzKFR5cGVNb3EuSXQuaXNBbnkoKSkpLnJldHVybnMoKCkgPT4gcHl0aG9uU2V0dGluZ3NNb2NrLm9iamVjdCk7XHJcbiAgICBzZXJ2aWNlQ29udGFpbmVyTW9jay5zZXR1cChjID0+IGMuZ2V0KHR5cGVzXzEuSUNvbmZpZ3VyYXRpb25TZXJ2aWNlKSkucmV0dXJucygoKSA9PiBjb25maWdNb2NrLm9iamVjdCk7XHJcbiAgICByZXR1cm4gc2VydmljZUNvbnRhaW5lck1vY2s7XHJcbn1cclxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1mdW5jLWJvZHktbGVuZ3RoXHJcbnN1aXRlKCdMaW50IE1hbmFnZXIgVW5pdCBUZXN0cycsICgpID0+IHtcclxuICAgIGNvbnN0IHdvcmtzcGFjZVNlcnZpY2UgPSBUeXBlTW9xLk1vY2sub2ZUeXBlKCk7XHJcbiAgICB0ZXN0KCdMaW50ZXIgbWFuYWdlciBpc0xpbnRpbmdFbmFibGVkIGNoZWNrcyBhdmFpbGFiaWxpdHkgd2hlbiBzaWxlbnQgPSBmYWxzZS4nLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgLy8gc2V0IGV4cGVjdGF0aW9uc1xyXG4gICAgICAgIGNvbnN0IGV4cGVjdGVkQ2FsbENvdW50ID0gMTtcclxuICAgICAgICBjb25zdCBzaWxlbnRGbGFnID0gZmFsc2U7XHJcbiAgICAgICAgLy8gZ2V0IHNldHVwXHJcbiAgICAgICAgY29uc3Qgc2VydmljZUNvbnRhaW5lck1vY2sgPSBnZXRTZXJ2aWNlQ29udGFpbmVyTW9ja0ZvckxpbnRlck1hbmFnZXJUZXN0cygpO1xyXG4gICAgICAgIC8vIG1ha2UgdGhlIGNhbGxcclxuICAgICAgICBjb25zdCBsbSA9IG5ldyBUZXN0TGludGVyTWFuYWdlcihzZXJ2aWNlQ29udGFpbmVyTW9jay5vYmplY3QsIHdvcmtzcGFjZVNlcnZpY2Uub2JqZWN0KTtcclxuICAgICAgICB5aWVsZCBsbS5pc0xpbnRpbmdFbmFibGVkKHNpbGVudEZsYWcpO1xyXG4gICAgICAgIC8vIHRlc3QgZXhwZWN0YXRpb25zXHJcbiAgICAgICAgY2hhaV8xLmV4cGVjdChsbS5lbmFibGVVbmNvbmZpZ3VyZWRMaW50ZXJzQ2FsbENvdW50KS50by5lcXVhbChleHBlY3RlZENhbGxDb3VudCk7XHJcbiAgICB9KSk7XHJcbiAgICB0ZXN0KCdMaW50ZXIgbWFuYWdlciBpc0xpbnRpbmdFbmFibGVkIGRvZXMgbm90IGNoZWNrIGF2YWlsYWJpbGl0eSB3aGVuIHNpbGVudCA9IHRydWUuJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIC8vIHNldCBleHBlY3RhdGlvbnNcclxuICAgICAgICBjb25zdCBleHBlY3RlZENhbGxDb3VudCA9IDA7XHJcbiAgICAgICAgY29uc3Qgc2lsZW50RmxhZyA9IHRydWU7XHJcbiAgICAgICAgLy8gZ2V0IHNldHVwXHJcbiAgICAgICAgY29uc3Qgc2VydmljZUNvbnRhaW5lck1vY2sgPSBnZXRTZXJ2aWNlQ29udGFpbmVyTW9ja0ZvckxpbnRlck1hbmFnZXJUZXN0cygpO1xyXG4gICAgICAgIC8vIG1ha2UgdGhlIGNhbGxcclxuICAgICAgICBjb25zdCBsbSA9IG5ldyBUZXN0TGludGVyTWFuYWdlcihzZXJ2aWNlQ29udGFpbmVyTW9jay5vYmplY3QsIHdvcmtzcGFjZVNlcnZpY2Uub2JqZWN0KTtcclxuICAgICAgICB5aWVsZCBsbS5pc0xpbnRpbmdFbmFibGVkKHNpbGVudEZsYWcpO1xyXG4gICAgICAgIC8vIHRlc3QgZXhwZWN0YXRpb25zXHJcbiAgICAgICAgY2hhaV8xLmV4cGVjdChsbS5lbmFibGVVbmNvbmZpZ3VyZWRMaW50ZXJzQ2FsbENvdW50KS50by5lcXVhbChleHBlY3RlZENhbGxDb3VudCk7XHJcbiAgICB9KSk7XHJcbiAgICB0ZXN0KCdMaW50ZXIgbWFuYWdlciBnZXRBY3RpdmVMaW50ZXJzIGNoZWNrcyBhdmFpbGFiaWxpdHkgd2hlbiBzaWxlbnQgPSBmYWxzZS4nLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgLy8gc2V0IGV4cGVjdGF0aW9uc1xyXG4gICAgICAgIGNvbnN0IGV4cGVjdGVkQ2FsbENvdW50ID0gMTtcclxuICAgICAgICBjb25zdCBzaWxlbnRGbGFnID0gZmFsc2U7XHJcbiAgICAgICAgLy8gZ2V0IHNldHVwXHJcbiAgICAgICAgY29uc3Qgc2VydmljZUNvbnRhaW5lck1vY2sgPSBnZXRTZXJ2aWNlQ29udGFpbmVyTW9ja0ZvckxpbnRlck1hbmFnZXJUZXN0cygpO1xyXG4gICAgICAgIC8vIG1ha2UgdGhlIGNhbGxcclxuICAgICAgICBjb25zdCBsbSA9IG5ldyBUZXN0TGludGVyTWFuYWdlcihzZXJ2aWNlQ29udGFpbmVyTW9jay5vYmplY3QsIHdvcmtzcGFjZVNlcnZpY2Uub2JqZWN0KTtcclxuICAgICAgICB5aWVsZCBsbS5nZXRBY3RpdmVMaW50ZXJzKHNpbGVudEZsYWcpO1xyXG4gICAgICAgIC8vIHRlc3QgZXhwZWN0YXRpb25zXHJcbiAgICAgICAgY2hhaV8xLmV4cGVjdChsbS5lbmFibGVVbmNvbmZpZ3VyZWRMaW50ZXJzQ2FsbENvdW50KS50by5lcXVhbChleHBlY3RlZENhbGxDb3VudCk7XHJcbiAgICB9KSk7XHJcbiAgICB0ZXN0KCdMaW50ZXIgbWFuYWdlciBnZXRBY3RpdmVMaW50ZXJzIGNoZWNrcyBhdmFpbGFiaWxpdHkgd2hlbiBzaWxlbnQgPSB0cnVlLicsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAvLyBzZXQgZXhwZWN0YXRpb25zXHJcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRDYWxsQ291bnQgPSAwO1xyXG4gICAgICAgIGNvbnN0IHNpbGVudEZsYWcgPSB0cnVlO1xyXG4gICAgICAgIC8vIGdldCBzZXR1cFxyXG4gICAgICAgIGNvbnN0IHNlcnZpY2VDb250YWluZXJNb2NrID0gZ2V0U2VydmljZUNvbnRhaW5lck1vY2tGb3JMaW50ZXJNYW5hZ2VyVGVzdHMoKTtcclxuICAgICAgICAvLyBtYWtlIHRoZSBjYWxsXHJcbiAgICAgICAgY29uc3QgbG0gPSBuZXcgVGVzdExpbnRlck1hbmFnZXIoc2VydmljZUNvbnRhaW5lck1vY2sub2JqZWN0LCB3b3Jrc3BhY2VTZXJ2aWNlLm9iamVjdCk7XHJcbiAgICAgICAgeWllbGQgbG0uZ2V0QWN0aXZlTGludGVycyhzaWxlbnRGbGFnKTtcclxuICAgICAgICAvLyB0ZXN0IGV4cGVjdGF0aW9uc1xyXG4gICAgICAgIGNoYWlfMS5leHBlY3QobG0uZW5hYmxlVW5jb25maWd1cmVkTGludGVyc0NhbGxDb3VudCkudG8uZXF1YWwoZXhwZWN0ZWRDYWxsQ291bnQpO1xyXG4gICAgfSkpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGludC5tYW5hZ2VyLnVuaXQudGVzdC5qcy5tYXAiXX0=