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

const path = require("path");

const requestProgress = require("request-progress");

const vscode_1 = require("vscode");

const constants_1 = require("../common/constants");

const types_1 = require("../common/platform/types");

const types_2 = require("../common/types");

const async_1 = require("../common/utils/async");

const stopWatch_1 = require("../common/utils/stopWatch");

const telemetry_1 = require("../telemetry");

const constants_2 = require("../telemetry/constants");

const types_3 = require("./types"); // tslint:disable-next-line:no-require-imports no-var-requires


const StreamZip = require('node-stream-zip');

const downloadFileExtension = '.nupkg';

class LanguageServerDownloader {
  constructor(platformData, engineFolder, serviceContainer) {
    this.platformData = platformData;
    this.engineFolder = engineFolder;
    this.serviceContainer = serviceContainer;
    this.output = this.serviceContainer.get(types_2.IOutputChannel, constants_1.STANDARD_OUTPUT_CHANNEL);
    this.fs = this.serviceContainer.get(types_1.IFileSystem);
  }

  getDownloadInfo() {
    return __awaiter(this, void 0, void 0, function* () {
      const lsFolderService = this.serviceContainer.get(types_3.ILanguageServerFolderService);
      return lsFolderService.getLatestLanguageServerVersion().then(item => item);
    });
  }

  downloadLanguageServer(context) {
    return __awaiter(this, void 0, void 0, function* () {
      const downloadInfo = yield this.getDownloadInfo();
      const downloadUri = downloadInfo.uri;
      const lsVersion = downloadInfo.version.raw;
      const timer = new stopWatch_1.StopWatch();
      let success = true;
      let localTempFilePath = '';

      try {
        localTempFilePath = yield this.downloadFile(downloadUri, 'Downloading Microsoft Python Language Server... ');
      } catch (err) {
        this.output.appendLine('download failed.');
        this.output.appendLine(err);
        success = false;
        throw new Error(err);
      } finally {
        telemetry_1.sendTelemetryEvent(constants_2.PYTHON_LANGUAGE_SERVER_DOWNLOADED, timer.elapsedTime, {
          success,
          lsVersion
        });
      }

      timer.reset();

      try {
        yield this.unpackArchive(context.extensionPath, localTempFilePath);
      } catch (err) {
        this.output.appendLine('extraction failed.');
        this.output.appendLine(err);
        success = false;
        throw new Error(err);
      } finally {
        telemetry_1.sendTelemetryEvent(constants_2.PYTHON_LANGUAGE_SERVER_EXTRACTED, timer.elapsedTime, {
          success,
          lsVersion
        });
        yield this.fs.deleteFile(localTempFilePath);
      }
    });
  }

  downloadFile(uri, title) {
    return __awaiter(this, void 0, void 0, function* () {
      this.output.append(`Downloading ${uri}... `);
      const tempFile = yield this.fs.createTemporaryFile(downloadFileExtension);
      const deferred = async_1.createDeferred();
      const fileStream = this.fs.createWriteStream(tempFile.filePath);
      fileStream.on('finish', () => {
        fileStream.close();
      }).on('error', err => {
        tempFile.dispose();
        deferred.reject(err);
      });
      yield vscode_1.window.withProgress({
        location: vscode_1.ProgressLocation.Window
      }, progress => {
        const httpClient = this.serviceContainer.get(types_3.IHttpClient);
        requestProgress(httpClient.downloadFile(uri)).on('progress', state => {
          // https://www.npmjs.com/package/request-progress
          const received = Math.round(state.size.transferred / 1024);
          const total = Math.round(state.size.total / 1024);
          const percentage = Math.round(100 * state.percent);
          progress.report({
            message: `${title}${received} of ${total} KB (${percentage}%)`
          });
        }).on('error', err => {
          deferred.reject(err);
        }).on('end', () => {
          this.output.appendLine('complete.');
          deferred.resolve();
        }).pipe(fileStream);
        return deferred.promise;
      });
      return tempFile.filePath;
    });
  }

  unpackArchive(extensionPath, tempFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
      this.output.append('Unpacking archive... ');
      const installFolder = path.join(extensionPath, this.engineFolder);
      const deferred = async_1.createDeferred();
      const title = 'Extracting files... ';
      yield vscode_1.window.withProgress({
        location: vscode_1.ProgressLocation.Window
      }, progress => {
        const zip = new StreamZip({
          file: tempFilePath,
          storeEntries: true
        });
        let totalFiles = 0;
        let extractedFiles = 0;
        zip.on('ready', () => __awaiter(this, void 0, void 0, function* () {
          totalFiles = zip.entriesCount;

          if (!(yield this.fs.directoryExists(installFolder))) {
            yield this.fs.createDirectory(installFolder);
          }

          zip.extract(null, installFolder, err => {
            if (err) {
              deferred.reject(err);
            } else {
              deferred.resolve();
            }

            zip.close();
          });
        })).on('extract', () => {
          extractedFiles += 1;
          progress.report({
            message: `${title}${Math.round(100 * extractedFiles / totalFiles)}%`
          });
        }).on('error', e => {
          deferred.reject(e);
        });
        return deferred.promise;
      }); // Set file to executable (nothing happens in Windows, as chmod has no definition there)

      const executablePath = path.join(installFolder, this.platformData.getEngineExecutableName());
      yield this.fs.chmod(executablePath, '0764'); // -rwxrw-r--

      this.output.appendLine('done.');
    });
  }

}

exports.LanguageServerDownloader = LanguageServerDownloader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvd25sb2FkZXIuanMiXSwibmFtZXMiOlsiX19hd2FpdGVyIiwidGhpc0FyZyIsIl9hcmd1bWVudHMiLCJQIiwiZ2VuZXJhdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmdWxmaWxsZWQiLCJ2YWx1ZSIsInN0ZXAiLCJuZXh0IiwiZSIsInJlamVjdGVkIiwicmVzdWx0IiwiZG9uZSIsInRoZW4iLCJhcHBseSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInBhdGgiLCJyZXF1aXJlIiwicmVxdWVzdFByb2dyZXNzIiwidnNjb2RlXzEiLCJjb25zdGFudHNfMSIsInR5cGVzXzEiLCJ0eXBlc18yIiwiYXN5bmNfMSIsInN0b3BXYXRjaF8xIiwidGVsZW1ldHJ5XzEiLCJjb25zdGFudHNfMiIsInR5cGVzXzMiLCJTdHJlYW1aaXAiLCJkb3dubG9hZEZpbGVFeHRlbnNpb24iLCJMYW5ndWFnZVNlcnZlckRvd25sb2FkZXIiLCJjb25zdHJ1Y3RvciIsInBsYXRmb3JtRGF0YSIsImVuZ2luZUZvbGRlciIsInNlcnZpY2VDb250YWluZXIiLCJvdXRwdXQiLCJnZXQiLCJJT3V0cHV0Q2hhbm5lbCIsIlNUQU5EQVJEX09VVFBVVF9DSEFOTkVMIiwiZnMiLCJJRmlsZVN5c3RlbSIsImdldERvd25sb2FkSW5mbyIsImxzRm9sZGVyU2VydmljZSIsIklMYW5ndWFnZVNlcnZlckZvbGRlclNlcnZpY2UiLCJnZXRMYXRlc3RMYW5ndWFnZVNlcnZlclZlcnNpb24iLCJpdGVtIiwiZG93bmxvYWRMYW5ndWFnZVNlcnZlciIsImNvbnRleHQiLCJkb3dubG9hZEluZm8iLCJkb3dubG9hZFVyaSIsInVyaSIsImxzVmVyc2lvbiIsInZlcnNpb24iLCJyYXciLCJ0aW1lciIsIlN0b3BXYXRjaCIsInN1Y2Nlc3MiLCJsb2NhbFRlbXBGaWxlUGF0aCIsImRvd25sb2FkRmlsZSIsImVyciIsImFwcGVuZExpbmUiLCJFcnJvciIsInNlbmRUZWxlbWV0cnlFdmVudCIsIlBZVEhPTl9MQU5HVUFHRV9TRVJWRVJfRE9XTkxPQURFRCIsImVsYXBzZWRUaW1lIiwicmVzZXQiLCJ1bnBhY2tBcmNoaXZlIiwiZXh0ZW5zaW9uUGF0aCIsIlBZVEhPTl9MQU5HVUFHRV9TRVJWRVJfRVhUUkFDVEVEIiwiZGVsZXRlRmlsZSIsInRpdGxlIiwiYXBwZW5kIiwidGVtcEZpbGUiLCJjcmVhdGVUZW1wb3JhcnlGaWxlIiwiZGVmZXJyZWQiLCJjcmVhdGVEZWZlcnJlZCIsImZpbGVTdHJlYW0iLCJjcmVhdGVXcml0ZVN0cmVhbSIsImZpbGVQYXRoIiwib24iLCJjbG9zZSIsImRpc3Bvc2UiLCJ3aW5kb3ciLCJ3aXRoUHJvZ3Jlc3MiLCJsb2NhdGlvbiIsIlByb2dyZXNzTG9jYXRpb24iLCJXaW5kb3ciLCJwcm9ncmVzcyIsImh0dHBDbGllbnQiLCJJSHR0cENsaWVudCIsInN0YXRlIiwicmVjZWl2ZWQiLCJNYXRoIiwicm91bmQiLCJzaXplIiwidHJhbnNmZXJyZWQiLCJ0b3RhbCIsInBlcmNlbnRhZ2UiLCJwZXJjZW50IiwicmVwb3J0IiwibWVzc2FnZSIsInBpcGUiLCJwcm9taXNlIiwidGVtcEZpbGVQYXRoIiwiaW5zdGFsbEZvbGRlciIsImpvaW4iLCJ6aXAiLCJmaWxlIiwic3RvcmVFbnRyaWVzIiwidG90YWxGaWxlcyIsImV4dHJhY3RlZEZpbGVzIiwiZW50cmllc0NvdW50IiwiZGlyZWN0b3J5RXhpc3RzIiwiY3JlYXRlRGlyZWN0b3J5IiwiZXh0cmFjdCIsImV4ZWN1dGFibGVQYXRoIiwiZ2V0RW5naW5lRXhlY3V0YWJsZU5hbWUiLCJjaG1vZCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUNBLElBQUlBLFNBQVMsR0FBSSxVQUFRLFNBQUtBLFNBQWQsSUFBNEIsVUFBVUMsT0FBVixFQUFtQkMsVUFBbkIsRUFBK0JDLENBQS9CLEVBQWtDQyxTQUFsQyxFQUE2QztBQUNyRixTQUFPLEtBQUtELENBQUMsS0FBS0EsQ0FBQyxHQUFHRSxPQUFULENBQU4s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LEVBakJILENBaUJNLE9BakJOLEVBaUJleEUsQ0FBQyxJQUFJO0FBQ2hCbUUsVUFBQUEsUUFBUSxDQUFDeEUsTUFBVCxDQUFnQkssQ0FBaEI7QUFDSCxTQW5CRDtBQW9CQSxlQUFPbUUsUUFBUSxDQUFDNEIsT0FBaEI7QUFDSCxPQTlCSyxDQUFOLENBTGdELENBb0NoRDs7QUFDQSxZQUFNYSxjQUFjLEdBQUduRyxJQUFJLENBQUN5RixJQUFMLENBQVVELGFBQVYsRUFBeUIsS0FBS3hFLFlBQUwsQ0FBa0JvRix1QkFBbEIsRUFBekIsQ0FBdkI7QUFDQSxZQUFNLEtBQUs3RSxFQUFMLENBQVE4RSxLQUFSLENBQWNGLGNBQWQsRUFBOEIsTUFBOUIsQ0FBTixDQXRDZ0QsQ0FzQ0g7O0FBQzdDLFdBQUtoRixNQUFMLENBQVl5QixVQUFaLENBQXVCLE9BQXZCO0FBQ0gsS0F4Q2UsQ0FBaEI7QUF5Q0g7O0FBbkkwQjs7QUFxSS9CN0MsT0FBTyxDQUFDZSx3QkFBUixHQUFtQ0Esd0JBQW5DIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4ndXNlIHN0cmljdCc7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcbmNvbnN0IHJlcXVlc3RQcm9ncmVzcyA9IHJlcXVpcmUoXCJyZXF1ZXN0LXByb2dyZXNzXCIpO1xuY29uc3QgdnNjb2RlXzEgPSByZXF1aXJlKFwidnNjb2RlXCIpO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vY29tbW9uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vY29tbW9uL3BsYXRmb3JtL3R5cGVzXCIpO1xuY29uc3QgdHlwZXNfMiA9IHJlcXVpcmUoXCIuLi9jb21tb24vdHlwZXNcIik7XG5jb25zdCBhc3luY18xID0gcmVxdWlyZShcIi4uL2NvbW1vbi91dGlscy9hc3luY1wiKTtcbmNvbnN0IHN0b3BXYXRjaF8xID0gcmVxdWlyZShcIi4uL2NvbW1vbi91dGlscy9zdG9wV2F0Y2hcIik7XG5jb25zdCB0ZWxlbWV0cnlfMSA9IHJlcXVpcmUoXCIuLi90ZWxlbWV0cnlcIik7XG5jb25zdCBjb25zdGFudHNfMiA9IHJlcXVpcmUoXCIuLi90ZWxlbWV0cnkvY29uc3RhbnRzXCIpO1xuY29uc3QgdHlwZXNfMyA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXJlcXVpcmUtaW1wb3J0cyBuby12YXItcmVxdWlyZXNcbmNvbnN0IFN0cmVhbVppcCA9IHJlcXVpcmUoJ25vZGUtc3RyZWFtLXppcCcpO1xuY29uc3QgZG93bmxvYWRGaWxlRXh0ZW5zaW9uID0gJy5udXBrZyc7XG5jbGFzcyBMYW5ndWFnZVNlcnZlckRvd25sb2FkZXIge1xuICAgIGNvbnN0cnVjdG9yKHBsYXRmb3JtRGF0YSwgZW5naW5lRm9sZGVyLCBzZXJ2aWNlQ29udGFpbmVyKSB7XG4gICAgICAgIHRoaXMucGxhdGZvcm1EYXRhID0gcGxhdGZvcm1EYXRhO1xuICAgICAgICB0aGlzLmVuZ2luZUZvbGRlciA9IGVuZ2luZUZvbGRlcjtcbiAgICAgICAgdGhpcy5zZXJ2aWNlQ29udGFpbmVyID0gc2VydmljZUNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5vdXRwdXQgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzIuSU91dHB1dENoYW5uZWwsIGNvbnN0YW50c18xLlNUQU5EQVJEX09VVFBVVF9DSEFOTkVMKTtcbiAgICAgICAgdGhpcy5mcyA9IHRoaXMuc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMS5JRmlsZVN5c3RlbSk7XG4gICAgfVxuICAgIGdldERvd25sb2FkSW5mbygpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGxzRm9sZGVyU2VydmljZSA9IHRoaXMuc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMy5JTGFuZ3VhZ2VTZXJ2ZXJGb2xkZXJTZXJ2aWNlKTtcbiAgICAgICAgICAgIHJldHVybiBsc0ZvbGRlclNlcnZpY2UuZ2V0TGF0ZXN0TGFuZ3VhZ2VTZXJ2ZXJWZXJzaW9uKCkudGhlbihpdGVtID0+IGl0ZW0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZG93bmxvYWRMYW5ndWFnZVNlcnZlcihjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkb3dubG9hZEluZm8gPSB5aWVsZCB0aGlzLmdldERvd25sb2FkSW5mbygpO1xuICAgICAgICAgICAgY29uc3QgZG93bmxvYWRVcmkgPSBkb3dubG9hZEluZm8udXJpO1xuICAgICAgICAgICAgY29uc3QgbHNWZXJzaW9uID0gZG93bmxvYWRJbmZvLnZlcnNpb24ucmF3O1xuICAgICAgICAgICAgY29uc3QgdGltZXIgPSBuZXcgc3RvcFdhdGNoXzEuU3RvcFdhdGNoKCk7XG4gICAgICAgICAgICBsZXQgc3VjY2VzcyA9IHRydWU7XG4gICAgICAgICAgICBsZXQgbG9jYWxUZW1wRmlsZVBhdGggPSAnJztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9jYWxUZW1wRmlsZVBhdGggPSB5aWVsZCB0aGlzLmRvd25sb2FkRmlsZShkb3dubG9hZFVyaSwgJ0Rvd25sb2FkaW5nIE1pY3Jvc29mdCBQeXRob24gTGFuZ3VhZ2UgU2VydmVyLi4uICcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0LmFwcGVuZExpbmUoJ2Rvd25sb2FkIGZhaWxlZC4nKTtcbiAgICAgICAgICAgICAgICB0aGlzLm91dHB1dC5hcHBlbmRMaW5lKGVycik7XG4gICAgICAgICAgICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgdGVsZW1ldHJ5XzEuc2VuZFRlbGVtZXRyeUV2ZW50KGNvbnN0YW50c18yLlBZVEhPTl9MQU5HVUFHRV9TRVJWRVJfRE9XTkxPQURFRCwgdGltZXIuZWxhcHNlZFRpbWUsIHsgc3VjY2VzcywgbHNWZXJzaW9uIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGltZXIucmVzZXQoKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgeWllbGQgdGhpcy51bnBhY2tBcmNoaXZlKGNvbnRleHQuZXh0ZW5zaW9uUGF0aCwgbG9jYWxUZW1wRmlsZVBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0LmFwcGVuZExpbmUoJ2V4dHJhY3Rpb24gZmFpbGVkLicpO1xuICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0LmFwcGVuZExpbmUoZXJyKTtcbiAgICAgICAgICAgICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB0ZWxlbWV0cnlfMS5zZW5kVGVsZW1ldHJ5RXZlbnQoY29uc3RhbnRzXzIuUFlUSE9OX0xBTkdVQUdFX1NFUlZFUl9FWFRSQUNURUQsIHRpbWVyLmVsYXBzZWRUaW1lLCB7IHN1Y2Nlc3MsIGxzVmVyc2lvbiB9KTtcbiAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLmZzLmRlbGV0ZUZpbGUobG9jYWxUZW1wRmlsZVBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZG93bmxvYWRGaWxlKHVyaSwgdGl0bGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMub3V0cHV0LmFwcGVuZChgRG93bmxvYWRpbmcgJHt1cml9Li4uIGApO1xuICAgICAgICAgICAgY29uc3QgdGVtcEZpbGUgPSB5aWVsZCB0aGlzLmZzLmNyZWF0ZVRlbXBvcmFyeUZpbGUoZG93bmxvYWRGaWxlRXh0ZW5zaW9uKTtcbiAgICAgICAgICAgIGNvbnN0IGRlZmVycmVkID0gYXN5bmNfMS5jcmVhdGVEZWZlcnJlZCgpO1xuICAgICAgICAgICAgY29uc3QgZmlsZVN0cmVhbSA9IHRoaXMuZnMuY3JlYXRlV3JpdGVTdHJlYW0odGVtcEZpbGUuZmlsZVBhdGgpO1xuICAgICAgICAgICAgZmlsZVN0cmVhbS5vbignZmluaXNoJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGZpbGVTdHJlYW0uY2xvc2UoKTtcbiAgICAgICAgICAgIH0pLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0ZW1wRmlsZS5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHlpZWxkIHZzY29kZV8xLndpbmRvdy53aXRoUHJvZ3Jlc3Moe1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiB2c2NvZGVfMS5Qcm9ncmVzc0xvY2F0aW9uLldpbmRvd1xuICAgICAgICAgICAgfSwgKHByb2dyZXNzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaHR0cENsaWVudCA9IHRoaXMuc2VydmljZUNvbnRhaW5lci5nZXQodHlwZXNfMy5JSHR0cENsaWVudCk7XG4gICAgICAgICAgICAgICAgcmVxdWVzdFByb2dyZXNzKGh0dHBDbGllbnQuZG93bmxvYWRGaWxlKHVyaSkpXG4gICAgICAgICAgICAgICAgICAgIC5vbigncHJvZ3Jlc3MnLCAoc3RhdGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvcmVxdWVzdC1wcm9ncmVzc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWNlaXZlZCA9IE1hdGgucm91bmQoc3RhdGUuc2l6ZS50cmFuc2ZlcnJlZCAvIDEwMjQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3RhbCA9IE1hdGgucm91bmQoc3RhdGUuc2l6ZS50b3RhbCAvIDEwMjQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gTWF0aC5yb3VuZCgxMDAgKiBzdGF0ZS5wZXJjZW50KTtcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3MucmVwb3J0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGAke3RpdGxlfSR7cmVjZWl2ZWR9IG9mICR7dG90YWx9IEtCICgke3BlcmNlbnRhZ2V9JSlgXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dC5hcHBlbmRMaW5lKCdjb21wbGV0ZS4nKTtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5waXBlKGZpbGVTdHJlYW0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGVtcEZpbGUuZmlsZVBhdGg7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB1bnBhY2tBcmNoaXZlKGV4dGVuc2lvblBhdGgsIHRlbXBGaWxlUGF0aCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5vdXRwdXQuYXBwZW5kKCdVbnBhY2tpbmcgYXJjaGl2ZS4uLiAnKTtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbGxGb2xkZXIgPSBwYXRoLmpvaW4oZXh0ZW5zaW9uUGF0aCwgdGhpcy5lbmdpbmVGb2xkZXIpO1xuICAgICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSBhc3luY18xLmNyZWF0ZURlZmVycmVkKCk7XG4gICAgICAgICAgICBjb25zdCB0aXRsZSA9ICdFeHRyYWN0aW5nIGZpbGVzLi4uICc7XG4gICAgICAgICAgICB5aWVsZCB2c2NvZGVfMS53aW5kb3cud2l0aFByb2dyZXNzKHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbjogdnNjb2RlXzEuUHJvZ3Jlc3NMb2NhdGlvbi5XaW5kb3dcbiAgICAgICAgICAgIH0sIChwcm9ncmVzcykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHppcCA9IG5ldyBTdHJlYW1aaXAoe1xuICAgICAgICAgICAgICAgICAgICBmaWxlOiB0ZW1wRmlsZVBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlRW50cmllczogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxldCB0b3RhbEZpbGVzID0gMDtcbiAgICAgICAgICAgICAgICBsZXQgZXh0cmFjdGVkRmlsZXMgPSAwO1xuICAgICAgICAgICAgICAgIHppcC5vbigncmVhZHknLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsRmlsZXMgPSB6aXAuZW50cmllc0NvdW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAoISh5aWVsZCB0aGlzLmZzLmRpcmVjdG9yeUV4aXN0cyhpbnN0YWxsRm9sZGVyKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMuZnMuY3JlYXRlRGlyZWN0b3J5KGluc3RhbGxGb2xkZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHppcC5leHRyYWN0KG51bGwsIGluc3RhbGxGb2xkZXIsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHppcC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KSkub24oJ2V4dHJhY3QnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGV4dHJhY3RlZEZpbGVzICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzLnJlcG9ydCh7IG1lc3NhZ2U6IGAke3RpdGxlfSR7TWF0aC5yb3VuZCgxMDAgKiBleHRyYWN0ZWRGaWxlcyAvIHRvdGFsRmlsZXMpfSVgIH0pO1xuICAgICAgICAgICAgICAgIH0pLm9uKCdlcnJvcicsIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIFNldCBmaWxlIHRvIGV4ZWN1dGFibGUgKG5vdGhpbmcgaGFwcGVucyBpbiBXaW5kb3dzLCBhcyBjaG1vZCBoYXMgbm8gZGVmaW5pdGlvbiB0aGVyZSlcbiAgICAgICAgICAgIGNvbnN0IGV4ZWN1dGFibGVQYXRoID0gcGF0aC5qb2luKGluc3RhbGxGb2xkZXIsIHRoaXMucGxhdGZvcm1EYXRhLmdldEVuZ2luZUV4ZWN1dGFibGVOYW1lKCkpO1xuICAgICAgICAgICAgeWllbGQgdGhpcy5mcy5jaG1vZChleGVjdXRhYmxlUGF0aCwgJzA3NjQnKTsgLy8gLXJ3eHJ3LXItLVxuICAgICAgICAgICAgdGhpcy5vdXRwdXQuYXBwZW5kTGluZSgnZG9uZS4nKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5MYW5ndWFnZVNlcnZlckRvd25sb2FkZXIgPSBMYW5ndWFnZVNlcnZlckRvd25sb2FkZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kb3dubG9hZGVyLmpzLm1hcCJdfQ==