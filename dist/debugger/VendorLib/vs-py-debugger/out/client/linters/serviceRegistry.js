// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const linterAvailability_1 = require("./linterAvailability");

const linterManager_1 = require("./linterManager");

const lintingEngine_1 = require("./lintingEngine");

const types_1 = require("./types");

function registerTypes(serviceManager) {
  serviceManager.addSingleton(types_1.ILintingEngine, lintingEngine_1.LintingEngine);
  serviceManager.addSingleton(types_1.ILinterManager, linterManager_1.LinterManager);
  serviceManager.add(types_1.IAvailableLinterActivator, linterAvailability_1.AvailableLinterActivator);
}

exports.registerTypes = registerTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VSZWdpc3RyeS5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsImxpbnRlckF2YWlsYWJpbGl0eV8xIiwicmVxdWlyZSIsImxpbnRlck1hbmFnZXJfMSIsImxpbnRpbmdFbmdpbmVfMSIsInR5cGVzXzEiLCJyZWdpc3RlclR5cGVzIiwic2VydmljZU1hbmFnZXIiLCJhZGRTaW5nbGV0b24iLCJJTGludGluZ0VuZ2luZSIsIkxpbnRpbmdFbmdpbmUiLCJJTGludGVyTWFuYWdlciIsIkxpbnRlck1hbmFnZXIiLCJhZGQiLCJJQXZhaWxhYmxlTGludGVyQWN0aXZhdG9yIiwiQXZhaWxhYmxlTGludGVyQWN0aXZhdG9yIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0FBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQkMsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRUMsRUFBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7O0FBQ0EsTUFBTUMsb0JBQW9CLEdBQUdDLE9BQU8sQ0FBQyxzQkFBRCxDQUFwQzs7QUFDQSxNQUFNQyxlQUFlLEdBQUdELE9BQU8sQ0FBQyxpQkFBRCxDQUEvQjs7QUFDQSxNQUFNRSxlQUFlLEdBQUdGLE9BQU8sQ0FBQyxpQkFBRCxDQUEvQjs7QUFDQSxNQUFNRyxPQUFPLEdBQUdILE9BQU8sQ0FBQyxTQUFELENBQXZCOztBQUNBLFNBQVNJLGFBQVQsQ0FBdUJDLGNBQXZCLEVBQXVDO0FBQ25DQSxFQUFBQSxjQUFjLENBQUNDLFlBQWYsQ0FBNEJILE9BQU8sQ0FBQ0ksY0FBcEMsRUFBb0RMLGVBQWUsQ0FBQ00sYUFBcEU7QUFDQUgsRUFBQUEsY0FBYyxDQUFDQyxZQUFmLENBQTRCSCxPQUFPLENBQUNNLGNBQXBDLEVBQW9EUixlQUFlLENBQUNTLGFBQXBFO0FBQ0FMLEVBQUFBLGNBQWMsQ0FBQ00sR0FBZixDQUFtQlIsT0FBTyxDQUFDUyx5QkFBM0IsRUFBc0RiLG9CQUFvQixDQUFDYyx3QkFBM0U7QUFDSDs7QUFDRGhCLE9BQU8sQ0FBQ08sYUFBUixHQUF3QkEsYUFBeEIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbid1c2Ugc3RyaWN0Jztcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGxpbnRlckF2YWlsYWJpbGl0eV8xID0gcmVxdWlyZShcIi4vbGludGVyQXZhaWxhYmlsaXR5XCIpO1xuY29uc3QgbGludGVyTWFuYWdlcl8xID0gcmVxdWlyZShcIi4vbGludGVyTWFuYWdlclwiKTtcbmNvbnN0IGxpbnRpbmdFbmdpbmVfMSA9IHJlcXVpcmUoXCIuL2xpbnRpbmdFbmdpbmVcIik7XG5jb25zdCB0eXBlc18xID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XG5mdW5jdGlvbiByZWdpc3RlclR5cGVzKHNlcnZpY2VNYW5hZ2VyKSB7XG4gICAgc2VydmljZU1hbmFnZXIuYWRkU2luZ2xldG9uKHR5cGVzXzEuSUxpbnRpbmdFbmdpbmUsIGxpbnRpbmdFbmdpbmVfMS5MaW50aW5nRW5naW5lKTtcbiAgICBzZXJ2aWNlTWFuYWdlci5hZGRTaW5nbGV0b24odHlwZXNfMS5JTGludGVyTWFuYWdlciwgbGludGVyTWFuYWdlcl8xLkxpbnRlck1hbmFnZXIpO1xuICAgIHNlcnZpY2VNYW5hZ2VyLmFkZCh0eXBlc18xLklBdmFpbGFibGVMaW50ZXJBY3RpdmF0b3IsIGxpbnRlckF2YWlsYWJpbGl0eV8xLkF2YWlsYWJsZUxpbnRlckFjdGl2YXRvcik7XG59XG5leHBvcnRzLnJlZ2lzdGVyVHlwZXMgPSByZWdpc3RlclR5cGVzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2VydmljZVJlZ2lzdHJ5LmpzLm1hcCJdfQ==