"use strict";

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

require("../common/extensions");

const types_1 = require("../common/types");

const baseLinter_1 = require("./baseLinter");

const types_2 = require("./types");

const REGEX = '(?<file>.py):(?<line>\\d+):(?<column>\\d+): \\[(?<type>\\w+)\\] (?<code>\\w\\d+):? (?<message>.*)\\r?(\\n|$)';
const COLUMN_OFF_SET = 1;

class PyLama extends baseLinter_1.BaseLinter {
  constructor(outputChannel, serviceContainer) {
    super(types_1.Product.pylama, outputChannel, serviceContainer, COLUMN_OFF_SET);
  }

  runLinter(document, cancellation) {
    return __awaiter(this, void 0, void 0, function* () {
      const messages = yield this.run(['--format=parsable', document.uri.fsPath], document, cancellation, REGEX); // All messages in pylama are treated as warnings for now.

      messages.forEach(msg => {
        msg.severity = types_2.LintMessageSeverity.Warning;
      });
      return messages;
    });
  }

}

exports.PyLama = PyLama;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInB5bGFtYS5qcyJdLCJuYW1lcyI6WyJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwicmVxdWlyZSIsInR5cGVzXzEiLCJiYXNlTGludGVyXzEiLCJ0eXBlc18yIiwiUkVHRVgiLCJDT0xVTU5fT0ZGX1NFVCIsIlB5TGFtYSIsIkJhc2VMaW50ZXIiLCJjb25zdHJ1Y3RvciIsIm91dHB1dENoYW5uZWwiLCJzZXJ2aWNlQ29udGFpbmVyIiwiUHJvZHVjdCIsInB5bGFtYSIsInJ1bkxpbnRlciIsImRvY3VtZW50IiwiY2FuY2VsbGF0aW9uIiwibWVzc2FnZXMiLCJydW4iLCJ1cmkiLCJmc1BhdGgiLCJmb3JFYWNoIiwibXNnIiwic2V2ZXJpdHkiLCJMaW50TWVzc2FnZVNldmVyaXR5IiwiV2FybmluZyJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0EsSUFBSUEsU0FBUyxHQUFJLFVBQVEsU0FBS0EsU0FBZCxJQUE0QixVQUFVQyxPQUFWLEVBQW1CQyxVQUFuQixFQUErQkMsQ0FBL0IsRUFBa0NDLFNBQWxDLEVBQTZDO0FBQ3JGLFNBQU8sS0FBS0QsQ0FBQyxLQUFLQSxDQUFDLEdBQUdFLE9BQVQsQ0FBTixFQUF5QixVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUN2RCxhQUFTQyxTQUFULENBQW1CQyxLQUFuQixFQUEwQjtBQUFFLFVBQUk7QUFBRUMsUUFBQUEsSUFBSSxDQUFDTixTQUFTLENBQUNPLElBQVYsQ0FBZUYsS0FBZixDQUFELENBQUo7QUFBOEIsT0FBcEMsQ0FBcUMsT0FBT0csQ0FBUCxFQUFVO0FBQUVMLFFBQUFBLE1BQU0sQ0FBQ0ssQ0FBRCxDQUFOO0FBQVk7QUFBRTs7QUFDM0YsYUFBU0MsUUFBVCxDQUFrQkosS0FBbEIsRUFBeUI7QUFBRSxVQUFJO0FBQUVDLFFBQUFBLElBQUksQ0FBQ04sU0FBUyxDQUFDLE9BQUQsQ0FBVCxDQUFtQkssS0FBbkIsQ0FBRCxDQUFKO0FBQWtDLE9BQXhDLENBQXlDLE9BQU9HLENBQVAsRUFBVTtBQUFFTCxRQUFBQSxNQUFNLENBQUNLLENBQUQsQ0FBTjtBQUFZO0FBQUU7O0FBQzlGLGFBQVNGLElBQVQsQ0FBY0ksTUFBZCxFQUFzQjtBQUFFQSxNQUFBQSxNQUFNLENBQUNDLElBQVAsR0FBY1QsT0FBTyxDQUFDUSxNQUFNLENBQUNMLEtBQVIsQ0FBckIsR0FBc0MsSUFBSU4sQ0FBSixDQUFNLFVBQVVHLE9BQVYsRUFBbUI7QUFBRUEsUUFBQUEsT0FBTyxDQUFDUSxNQUFNLENBQUNMLEtBQVIsQ0FBUDtBQUF3QixPQUFuRCxFQUFxRE8sSUFBckQsQ0FBMERSLFNBQTFELEVBQXFFSyxRQUFyRSxDQUF0QztBQUF1SDs7QUFDL0lILElBQUFBLElBQUksQ0FBQyxDQUFDTixTQUFTLEdBQUdBLFNBQVMsQ0FBQ2EsS0FBVixDQUFnQmhCLE9BQWhCLEVBQXlCQyxVQUFVLElBQUksRUFBdkMsQ0FBYixFQUF5RFMsSUFBekQsRUFBRCxDQUFKO0FBQ0gsR0FMTSxDQUFQO0FBTUgsQ0FQRDs7QUFRQU8sTUFBTSxDQUFDQyxjQUFQLENBQXNCQyxPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFWCxFQUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3Qzs7QUFDQVksT0FBTyxDQUFDLHNCQUFELENBQVA7O0FBQ0EsTUFBTUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsaUJBQUQsQ0FBdkI7O0FBQ0EsTUFBTUUsWUFBWSxHQUFHRixPQUFPLENBQUMsY0FBRCxDQUE1Qjs7QUFDQSxNQUFNRyxPQUFPLEdBQUdILE9BQU8sQ0FBQyxTQUFELENBQXZCOztBQUNBLE1BQU1JLEtBQUssR0FBRyw4R0FBZDtBQUNBLE1BQU1DLGNBQWMsR0FBRyxDQUF2Qjs7QUFDQSxNQUFNQyxNQUFOLFNBQXFCSixZQUFZLENBQUNLLFVBQWxDLENBQTZDO0FBQ3pDQyxFQUFBQSxXQUFXLENBQUNDLGFBQUQsRUFBZ0JDLGdCQUFoQixFQUFrQztBQUN6QyxVQUFNVCxPQUFPLENBQUNVLE9BQVIsQ0FBZ0JDLE1BQXRCLEVBQThCSCxhQUE5QixFQUE2Q0MsZ0JBQTdDLEVBQStETCxjQUEvRDtBQUNIOztBQUNEUSxFQUFBQSxTQUFTLENBQUNDLFFBQUQsRUFBV0MsWUFBWCxFQUF5QjtBQUM5QixXQUFPcEMsU0FBUyxDQUFDLElBQUQsRUFBTyxLQUFLLENBQVosRUFBZSxLQUFLLENBQXBCLEVBQXVCLGFBQWE7QUFDaEQsWUFBTXFDLFFBQVEsR0FBRyxNQUFNLEtBQUtDLEdBQUwsQ0FBUyxDQUFDLG1CQUFELEVBQXNCSCxRQUFRLENBQUNJLEdBQVQsQ0FBYUMsTUFBbkMsQ0FBVCxFQUFxREwsUUFBckQsRUFBK0RDLFlBQS9ELEVBQTZFWCxLQUE3RSxDQUF2QixDQURnRCxDQUVoRDs7QUFDQVksTUFBQUEsUUFBUSxDQUFDSSxPQUFULENBQWlCQyxHQUFHLElBQUk7QUFDcEJBLFFBQUFBLEdBQUcsQ0FBQ0MsUUFBSixHQUFlbkIsT0FBTyxDQUFDb0IsbUJBQVIsQ0FBNEJDLE9BQTNDO0FBQ0gsT0FGRDtBQUdBLGFBQU9SLFFBQVA7QUFDSCxLQVBlLENBQWhCO0FBUUg7O0FBYndDOztBQWU3Q2pCLE9BQU8sQ0FBQ08sTUFBUixHQUFpQkEsTUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xucmVxdWlyZShcIi4uL2NvbW1vbi9leHRlbnNpb25zXCIpO1xuY29uc3QgdHlwZXNfMSA9IHJlcXVpcmUoXCIuLi9jb21tb24vdHlwZXNcIik7XG5jb25zdCBiYXNlTGludGVyXzEgPSByZXF1aXJlKFwiLi9iYXNlTGludGVyXCIpO1xuY29uc3QgdHlwZXNfMiA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xuY29uc3QgUkVHRVggPSAnKD88ZmlsZT4ucHkpOig/PGxpbmU+XFxcXGQrKTooPzxjb2x1bW4+XFxcXGQrKTogXFxcXFsoPzx0eXBlPlxcXFx3KylcXFxcXSAoPzxjb2RlPlxcXFx3XFxcXGQrKTo/ICg/PG1lc3NhZ2U+LiopXFxcXHI/KFxcXFxufCQpJztcbmNvbnN0IENPTFVNTl9PRkZfU0VUID0gMTtcbmNsYXNzIFB5TGFtYSBleHRlbmRzIGJhc2VMaW50ZXJfMS5CYXNlTGludGVyIHtcbiAgICBjb25zdHJ1Y3RvcihvdXRwdXRDaGFubmVsLCBzZXJ2aWNlQ29udGFpbmVyKSB7XG4gICAgICAgIHN1cGVyKHR5cGVzXzEuUHJvZHVjdC5weWxhbWEsIG91dHB1dENoYW5uZWwsIHNlcnZpY2VDb250YWluZXIsIENPTFVNTl9PRkZfU0VUKTtcbiAgICB9XG4gICAgcnVuTGludGVyKGRvY3VtZW50LCBjYW5jZWxsYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VzID0geWllbGQgdGhpcy5ydW4oWyctLWZvcm1hdD1wYXJzYWJsZScsIGRvY3VtZW50LnVyaS5mc1BhdGhdLCBkb2N1bWVudCwgY2FuY2VsbGF0aW9uLCBSRUdFWCk7XG4gICAgICAgICAgICAvLyBBbGwgbWVzc2FnZXMgaW4gcHlsYW1hIGFyZSB0cmVhdGVkIGFzIHdhcm5pbmdzIGZvciBub3cuXG4gICAgICAgICAgICBtZXNzYWdlcy5mb3JFYWNoKG1zZyA9PiB7XG4gICAgICAgICAgICAgICAgbXNnLnNldmVyaXR5ID0gdHlwZXNfMi5MaW50TWVzc2FnZVNldmVyaXR5Lldhcm5pbmc7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBtZXNzYWdlcztcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5QeUxhbWEgPSBQeUxhbWE7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1weWxhbWEuanMubWFwIl19