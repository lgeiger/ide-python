// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const child_process_1 = require("child_process");

const path = require("path");

const vscode_debugadapter_testsupport_1 = require("vscode-debugadapter-testsupport");

const constants_1 = require("../../client/common/constants");

const misc_1 = require("../../client/common/utils/misc");

class DebugClientEx extends vscode_debugadapter_testsupport_1.DebugClient {
  constructor(executable, debugType, coverageDirectory, spawnOptions) {
    super('node', '', debugType, spawnOptions);
    this.executable = executable;
    this.coverageDirectory = coverageDirectory;
    this.spawnOptions = spawnOptions;

    this.stopAdapterProcess = () => {
      if (this.adapterProcess) {
        this.adapterProcess.kill();
        this.adapterProcess = undefined;
      }
    };
  }
  /**
   * Starts a new debug adapter and sets up communication via stdin/stdout.
   * If a port number is specified the adapter is not launched but a connection to
   * a debug adapter running in server mode is established. This is useful for debugging
   * the adapter while running tests. For this reason all timeouts are disabled in server mode.
   */


  start(port) {
    return new Promise((resolve, reject) => {
      const runtime = path.join(constants_1.EXTENSION_ROOT_DIR, 'node_modules', '.bin', 'istanbul');
      const args = ['cover', '--report=json', '--print=none', `--dir=${this.coverageDirectory}`, '--handle-sigint', this.executable];
      this.adapterProcess = child_process_1.spawn(runtime, args, this.spawnOptions);
      this.adapterProcess.stderr.on('data', misc_1.noop);
      this.adapterProcess.on('error', err => {
        console.error(err);
        reject(err);
      });
      this.adapterProcess.on('exit', misc_1.noop);
      this.connect(this.adapterProcess.stdout, this.adapterProcess.stdin);
      resolve();
    });
  }

  stop() {
    return this.disconnectRequest().then(this.stopAdapterProcess).catch(this.stopAdapterProcess);
  }

}

exports.DebugClientEx = DebugClientEx;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlYnVnQ2xpZW50LmpzIl0sIm5hbWVzIjpbIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwiY2hpbGRfcHJvY2Vzc18xIiwicmVxdWlyZSIsInBhdGgiLCJ2c2NvZGVfZGVidWdhZGFwdGVyX3Rlc3RzdXBwb3J0XzEiLCJjb25zdGFudHNfMSIsIm1pc2NfMSIsIkRlYnVnQ2xpZW50RXgiLCJEZWJ1Z0NsaWVudCIsImNvbnN0cnVjdG9yIiwiZXhlY3V0YWJsZSIsImRlYnVnVHlwZSIsImNvdmVyYWdlRGlyZWN0b3J5Iiwic3Bhd25PcHRpb25zIiwic3RvcEFkYXB0ZXJQcm9jZXNzIiwiYWRhcHRlclByb2Nlc3MiLCJraWxsIiwidW5kZWZpbmVkIiwic3RhcnQiLCJwb3J0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJydW50aW1lIiwiam9pbiIsIkVYVEVOU0lPTl9ST09UX0RJUiIsImFyZ3MiLCJzcGF3biIsInN0ZGVyciIsIm9uIiwibm9vcCIsImVyciIsImNvbnNvbGUiLCJlcnJvciIsImNvbm5lY3QiLCJzdGRvdXQiLCJzdGRpbiIsInN0b3AiLCJkaXNjb25uZWN0UmVxdWVzdCIsInRoZW4iLCJjYXRjaCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUNBQSxNQUFNLENBQUNDLGNBQVAsQ0FBc0JDLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUVDLEVBQUFBLEtBQUssRUFBRTtBQUFULENBQTdDOztBQUNBLE1BQU1DLGVBQWUsR0FBR0MsT0FBTyxDQUFDLGVBQUQsQ0FBL0I7O0FBQ0EsTUFBTUMsSUFBSSxHQUFHRCxPQUFPLENBQUMsTUFBRCxDQUFwQjs7QUFDQSxNQUFNRSxpQ0FBaUMsR0FBR0YsT0FBTyxDQUFDLGlDQUFELENBQWpEOztBQUNBLE1BQU1HLFdBQVcsR0FBR0gsT0FBTyxDQUFDLCtCQUFELENBQTNCOztBQUNBLE1BQU1JLE1BQU0sR0FBR0osT0FBTyxDQUFDLGdDQUFELENBQXRCOztBQUNBLE1BQU1LLGFBQU4sU0FBNEJILGlDQUFpQyxDQUFDSSxXQUE5RCxDQUEwRTtBQUN0RUMsRUFBQUEsV0FBVyxDQUFDQyxVQUFELEVBQWFDLFNBQWIsRUFBd0JDLGlCQUF4QixFQUEyQ0MsWUFBM0MsRUFBeUQ7QUFDaEUsVUFBTSxNQUFOLEVBQWMsRUFBZCxFQUFrQkYsU0FBbEIsRUFBNkJFLFlBQTdCO0FBQ0EsU0FBS0gsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxTQUFLRSxpQkFBTCxHQUF5QkEsaUJBQXpCO0FBQ0EsU0FBS0MsWUFBTCxHQUFvQkEsWUFBcEI7O0FBQ0EsU0FBS0Msa0JBQUwsR0FBMEIsTUFBTTtBQUM1QixVQUFJLEtBQUtDLGNBQVQsRUFBeUI7QUFDckIsYUFBS0EsY0FBTCxDQUFvQkMsSUFBcEI7QUFDQSxhQUFLRCxjQUFMLEdBQXNCRSxTQUF0QjtBQUNIO0FBQ0osS0FMRDtBQU1IO0FBQ0Q7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDSUMsRUFBQUEsS0FBSyxDQUFDQyxJQUFELEVBQU87QUFDUixXQUFPLElBQUlDLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDcEMsWUFBTUMsT0FBTyxHQUFHcEIsSUFBSSxDQUFDcUIsSUFBTCxDQUFVbkIsV0FBVyxDQUFDb0Isa0JBQXRCLEVBQTBDLGNBQTFDLEVBQTBELE1BQTFELEVBQWtFLFVBQWxFLENBQWhCO0FBQ0EsWUFBTUMsSUFBSSxHQUFHLENBQUMsT0FBRCxFQUFVLGVBQVYsRUFBMkIsY0FBM0IsRUFBNEMsU0FBUSxLQUFLZCxpQkFBa0IsRUFBM0UsRUFBOEUsaUJBQTlFLEVBQWlHLEtBQUtGLFVBQXRHLENBQWI7QUFDQSxXQUFLSyxjQUFMLEdBQXNCZCxlQUFlLENBQUMwQixLQUFoQixDQUFzQkosT0FBdEIsRUFBK0JHLElBQS9CLEVBQXFDLEtBQUtiLFlBQTFDLENBQXRCO0FBQ0EsV0FBS0UsY0FBTCxDQUFvQmEsTUFBcEIsQ0FBMkJDLEVBQTNCLENBQThCLE1BQTlCLEVBQXNDdkIsTUFBTSxDQUFDd0IsSUFBN0M7QUFDQSxXQUFLZixjQUFMLENBQW9CYyxFQUFwQixDQUF1QixPQUF2QixFQUFpQ0UsR0FBRCxJQUFTO0FBQ3JDQyxRQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsR0FBZDtBQUNBVCxRQUFBQSxNQUFNLENBQUNTLEdBQUQsQ0FBTjtBQUNILE9BSEQ7QUFJQSxXQUFLaEIsY0FBTCxDQUFvQmMsRUFBcEIsQ0FBdUIsTUFBdkIsRUFBK0J2QixNQUFNLENBQUN3QixJQUF0QztBQUNBLFdBQUtJLE9BQUwsQ0FBYSxLQUFLbkIsY0FBTCxDQUFvQm9CLE1BQWpDLEVBQXlDLEtBQUtwQixjQUFMLENBQW9CcUIsS0FBN0Q7QUFDQWYsTUFBQUEsT0FBTztBQUNWLEtBWk0sQ0FBUDtBQWFIOztBQUNEZ0IsRUFBQUEsSUFBSSxHQUFHO0FBQ0gsV0FBTyxLQUFLQyxpQkFBTCxHQUF5QkMsSUFBekIsQ0FBOEIsS0FBS3pCLGtCQUFuQyxFQUF1RDBCLEtBQXZELENBQTZELEtBQUsxQixrQkFBbEUsQ0FBUDtBQUNIOztBQXBDcUU7O0FBc0MxRWYsT0FBTyxDQUFDUSxhQUFSLEdBQXdCQSxhQUF4QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuJ3VzZSBzdHJpY3QnO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY2hpbGRfcHJvY2Vzc18xID0gcmVxdWlyZShcImNoaWxkX3Byb2Nlc3NcIik7XG5jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG5jb25zdCB2c2NvZGVfZGVidWdhZGFwdGVyX3Rlc3RzdXBwb3J0XzEgPSByZXF1aXJlKFwidnNjb2RlLWRlYnVnYWRhcHRlci10ZXN0c3VwcG9ydFwiKTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9jb21tb24vY29uc3RhbnRzXCIpO1xuY29uc3QgbWlzY18xID0gcmVxdWlyZShcIi4uLy4uL2NsaWVudC9jb21tb24vdXRpbHMvbWlzY1wiKTtcbmNsYXNzIERlYnVnQ2xpZW50RXggZXh0ZW5kcyB2c2NvZGVfZGVidWdhZGFwdGVyX3Rlc3RzdXBwb3J0XzEuRGVidWdDbGllbnQge1xuICAgIGNvbnN0cnVjdG9yKGV4ZWN1dGFibGUsIGRlYnVnVHlwZSwgY292ZXJhZ2VEaXJlY3RvcnksIHNwYXduT3B0aW9ucykge1xuICAgICAgICBzdXBlcignbm9kZScsICcnLCBkZWJ1Z1R5cGUsIHNwYXduT3B0aW9ucyk7XG4gICAgICAgIHRoaXMuZXhlY3V0YWJsZSA9IGV4ZWN1dGFibGU7XG4gICAgICAgIHRoaXMuY292ZXJhZ2VEaXJlY3RvcnkgPSBjb3ZlcmFnZURpcmVjdG9yeTtcbiAgICAgICAgdGhpcy5zcGF3bk9wdGlvbnMgPSBzcGF3bk9wdGlvbnM7XG4gICAgICAgIHRoaXMuc3RvcEFkYXB0ZXJQcm9jZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuYWRhcHRlclByb2Nlc3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0ZXJQcm9jZXNzLmtpbGwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0ZXJQcm9jZXNzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdGFydHMgYSBuZXcgZGVidWcgYWRhcHRlciBhbmQgc2V0cyB1cCBjb21tdW5pY2F0aW9uIHZpYSBzdGRpbi9zdGRvdXQuXG4gICAgICogSWYgYSBwb3J0IG51bWJlciBpcyBzcGVjaWZpZWQgdGhlIGFkYXB0ZXIgaXMgbm90IGxhdW5jaGVkIGJ1dCBhIGNvbm5lY3Rpb24gdG9cbiAgICAgKiBhIGRlYnVnIGFkYXB0ZXIgcnVubmluZyBpbiBzZXJ2ZXIgbW9kZSBpcyBlc3RhYmxpc2hlZC4gVGhpcyBpcyB1c2VmdWwgZm9yIGRlYnVnZ2luZ1xuICAgICAqIHRoZSBhZGFwdGVyIHdoaWxlIHJ1bm5pbmcgdGVzdHMuIEZvciB0aGlzIHJlYXNvbiBhbGwgdGltZW91dHMgYXJlIGRpc2FibGVkIGluIHNlcnZlciBtb2RlLlxuICAgICAqL1xuICAgIHN0YXJ0KHBvcnQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJ1bnRpbWUgPSBwYXRoLmpvaW4oY29uc3RhbnRzXzEuRVhURU5TSU9OX1JPT1RfRElSLCAnbm9kZV9tb2R1bGVzJywgJy5iaW4nLCAnaXN0YW5idWwnKTtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBbJ2NvdmVyJywgJy0tcmVwb3J0PWpzb24nLCAnLS1wcmludD1ub25lJywgYC0tZGlyPSR7dGhpcy5jb3ZlcmFnZURpcmVjdG9yeX1gLCAnLS1oYW5kbGUtc2lnaW50JywgdGhpcy5leGVjdXRhYmxlXTtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlclByb2Nlc3MgPSBjaGlsZF9wcm9jZXNzXzEuc3Bhd24ocnVudGltZSwgYXJncywgdGhpcy5zcGF3bk9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyUHJvY2Vzcy5zdGRlcnIub24oJ2RhdGEnLCBtaXNjXzEubm9vcCk7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXJQcm9jZXNzLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYWRhcHRlclByb2Nlc3Mub24oJ2V4aXQnLCBtaXNjXzEubm9vcCk7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QodGhpcy5hZGFwdGVyUHJvY2Vzcy5zdGRvdXQsIHRoaXMuYWRhcHRlclByb2Nlc3Muc3RkaW4pO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3RvcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzY29ubmVjdFJlcXVlc3QoKS50aGVuKHRoaXMuc3RvcEFkYXB0ZXJQcm9jZXNzKS5jYXRjaCh0aGlzLnN0b3BBZGFwdGVyUHJvY2Vzcyk7XG4gICAgfVxufVxuZXhwb3J0cy5EZWJ1Z0NsaWVudEV4ID0gRGVidWdDbGllbnRFeDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlYnVnQ2xpZW50LmpzLm1hcCJdfQ==