// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IAvailableLinterActivator = Symbol('IAvailableLinterActivator');
exports.ILinterManager = Symbol('ILinterManager');
var LintMessageSeverity;

(function (LintMessageSeverity) {
  LintMessageSeverity[LintMessageSeverity["Hint"] = 0] = "Hint";
  LintMessageSeverity[LintMessageSeverity["Error"] = 1] = "Error";
  LintMessageSeverity[LintMessageSeverity["Warning"] = 2] = "Warning";
  LintMessageSeverity[LintMessageSeverity["Information"] = 3] = "Information";
})(LintMessageSeverity = exports.LintMessageSeverity || (exports.LintMessageSeverity = {}));

exports.ILintingEngine = Symbol('ILintingEngine');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR5cGVzLmpzIl0sIm5hbWVzIjpbIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwiSUF2YWlsYWJsZUxpbnRlckFjdGl2YXRvciIsIlN5bWJvbCIsIklMaW50ZXJNYW5hZ2VyIiwiTGludE1lc3NhZ2VTZXZlcml0eSIsIklMaW50aW5nRW5naW5lIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0FBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQkMsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRUMsRUFBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7QUFDQUQsT0FBTyxDQUFDRSx5QkFBUixHQUFvQ0MsTUFBTSxDQUFDLDJCQUFELENBQTFDO0FBQ0FILE9BQU8sQ0FBQ0ksY0FBUixHQUF5QkQsTUFBTSxDQUFDLGdCQUFELENBQS9CO0FBQ0EsSUFBSUUsbUJBQUo7O0FBQ0EsQ0FBQyxVQUFVQSxtQkFBVixFQUErQjtBQUM1QkEsRUFBQUEsbUJBQW1CLENBQUNBLG1CQUFtQixDQUFDLE1BQUQsQ0FBbkIsR0FBOEIsQ0FBL0IsQ0FBbkIsR0FBdUQsTUFBdkQ7QUFDQUEsRUFBQUEsbUJBQW1CLENBQUNBLG1CQUFtQixDQUFDLE9BQUQsQ0FBbkIsR0FBK0IsQ0FBaEMsQ0FBbkIsR0FBd0QsT0FBeEQ7QUFDQUEsRUFBQUEsbUJBQW1CLENBQUNBLG1CQUFtQixDQUFDLFNBQUQsQ0FBbkIsR0FBaUMsQ0FBbEMsQ0FBbkIsR0FBMEQsU0FBMUQ7QUFDQUEsRUFBQUEsbUJBQW1CLENBQUNBLG1CQUFtQixDQUFDLGFBQUQsQ0FBbkIsR0FBcUMsQ0FBdEMsQ0FBbkIsR0FBOEQsYUFBOUQ7QUFDSCxDQUxELEVBS0dBLG1CQUFtQixHQUFHTCxPQUFPLENBQUNLLG1CQUFSLEtBQWdDTCxPQUFPLENBQUNLLG1CQUFSLEdBQThCLEVBQTlELENBTHpCOztBQU1BTCxPQUFPLENBQUNNLGNBQVIsR0FBeUJILE1BQU0sQ0FBQyxnQkFBRCxDQUEvQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcbid1c2Ugc3RyaWN0JztcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLklBdmFpbGFibGVMaW50ZXJBY3RpdmF0b3IgPSBTeW1ib2woJ0lBdmFpbGFibGVMaW50ZXJBY3RpdmF0b3InKTtcclxuZXhwb3J0cy5JTGludGVyTWFuYWdlciA9IFN5bWJvbCgnSUxpbnRlck1hbmFnZXInKTtcclxudmFyIExpbnRNZXNzYWdlU2V2ZXJpdHk7XHJcbihmdW5jdGlvbiAoTGludE1lc3NhZ2VTZXZlcml0eSkge1xyXG4gICAgTGludE1lc3NhZ2VTZXZlcml0eVtMaW50TWVzc2FnZVNldmVyaXR5W1wiSGludFwiXSA9IDBdID0gXCJIaW50XCI7XHJcbiAgICBMaW50TWVzc2FnZVNldmVyaXR5W0xpbnRNZXNzYWdlU2V2ZXJpdHlbXCJFcnJvclwiXSA9IDFdID0gXCJFcnJvclwiO1xyXG4gICAgTGludE1lc3NhZ2VTZXZlcml0eVtMaW50TWVzc2FnZVNldmVyaXR5W1wiV2FybmluZ1wiXSA9IDJdID0gXCJXYXJuaW5nXCI7XHJcbiAgICBMaW50TWVzc2FnZVNldmVyaXR5W0xpbnRNZXNzYWdlU2V2ZXJpdHlbXCJJbmZvcm1hdGlvblwiXSA9IDNdID0gXCJJbmZvcm1hdGlvblwiO1xyXG59KShMaW50TWVzc2FnZVNldmVyaXR5ID0gZXhwb3J0cy5MaW50TWVzc2FnZVNldmVyaXR5IHx8IChleHBvcnRzLkxpbnRNZXNzYWdlU2V2ZXJpdHkgPSB7fSkpO1xyXG5leHBvcnRzLklMaW50aW5nRW5naW5lID0gU3ltYm9sKCdJTGludGluZ0VuZ2luZScpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10eXBlcy5qcy5tYXAiXX0=