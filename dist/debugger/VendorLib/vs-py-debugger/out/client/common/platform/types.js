"use strict"; // Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IPlatformInfo = Symbol('IPlatformInfo');
var RegistryHive;

(function (RegistryHive) {
  RegistryHive[RegistryHive["HKCU"] = 0] = "HKCU";
  RegistryHive[RegistryHive["HKLM"] = 1] = "HKLM";
})(RegistryHive = exports.RegistryHive || (exports.RegistryHive = {}));

exports.IRegistry = Symbol('IRegistry');
exports.IPlatformService = Symbol('IPlatformService');
exports.IFileSystem = Symbol('IFileSystem');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR5cGVzLmpzIl0sIm5hbWVzIjpbIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwiSVBsYXRmb3JtSW5mbyIsIlN5bWJvbCIsIlJlZ2lzdHJ5SGl2ZSIsIklSZWdpc3RyeSIsIklQbGF0Zm9ybVNlcnZpY2UiLCJJRmlsZVN5c3RlbSJdLCJtYXBwaW5ncyI6IkFBQUEsYSxDQUNBO0FBQ0E7O0FBQ0FBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQkMsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRUMsRUFBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7QUFDQUQsT0FBTyxDQUFDRSxhQUFSLEdBQXdCQyxNQUFNLENBQUMsZUFBRCxDQUE5QjtBQUNBLElBQUlDLFlBQUo7O0FBQ0EsQ0FBQyxVQUFVQSxZQUFWLEVBQXdCO0FBQ3JCQSxFQUFBQSxZQUFZLENBQUNBLFlBQVksQ0FBQyxNQUFELENBQVosR0FBdUIsQ0FBeEIsQ0FBWixHQUF5QyxNQUF6QztBQUNBQSxFQUFBQSxZQUFZLENBQUNBLFlBQVksQ0FBQyxNQUFELENBQVosR0FBdUIsQ0FBeEIsQ0FBWixHQUF5QyxNQUF6QztBQUNILENBSEQsRUFHR0EsWUFBWSxHQUFHSixPQUFPLENBQUNJLFlBQVIsS0FBeUJKLE9BQU8sQ0FBQ0ksWUFBUixHQUF1QixFQUFoRCxDQUhsQjs7QUFJQUosT0FBTyxDQUFDSyxTQUFSLEdBQW9CRixNQUFNLENBQUMsV0FBRCxDQUExQjtBQUNBSCxPQUFPLENBQUNNLGdCQUFSLEdBQTJCSCxNQUFNLENBQUMsa0JBQUQsQ0FBakM7QUFDQUgsT0FBTyxDQUFDTyxXQUFSLEdBQXNCSixNQUFNLENBQUMsYUFBRCxDQUE1QiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLklQbGF0Zm9ybUluZm8gPSBTeW1ib2woJ0lQbGF0Zm9ybUluZm8nKTtcbnZhciBSZWdpc3RyeUhpdmU7XG4oZnVuY3Rpb24gKFJlZ2lzdHJ5SGl2ZSkge1xuICAgIFJlZ2lzdHJ5SGl2ZVtSZWdpc3RyeUhpdmVbXCJIS0NVXCJdID0gMF0gPSBcIkhLQ1VcIjtcbiAgICBSZWdpc3RyeUhpdmVbUmVnaXN0cnlIaXZlW1wiSEtMTVwiXSA9IDFdID0gXCJIS0xNXCI7XG59KShSZWdpc3RyeUhpdmUgPSBleHBvcnRzLlJlZ2lzdHJ5SGl2ZSB8fCAoZXhwb3J0cy5SZWdpc3RyeUhpdmUgPSB7fSkpO1xuZXhwb3J0cy5JUmVnaXN0cnkgPSBTeW1ib2woJ0lSZWdpc3RyeScpO1xuZXhwb3J0cy5JUGxhdGZvcm1TZXJ2aWNlID0gU3ltYm9sKCdJUGxhdGZvcm1TZXJ2aWNlJyk7XG5leHBvcnRzLklGaWxlU3lzdGVtID0gU3ltYm9sKCdJRmlsZVN5c3RlbScpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHlwZXMuanMubWFwIl19