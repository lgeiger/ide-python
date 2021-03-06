// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

class TextRangeCollection {
  constructor(items) {
    this.items = items;
  }

  get start() {
    return this.items.length > 0 ? this.items[0].start : 0;
  }

  get end() {
    return this.items.length > 0 ? this.items[this.items.length - 1].end : 0;
  }

  get length() {
    return this.end - this.start;
  }

  get count() {
    return this.items.length;
  }

  contains(position) {
    return position >= this.start && position < this.end;
  }

  getItemAt(index) {
    if (index < 0 || index >= this.items.length) {
      throw new Error('index is out of range');
    }

    return this.items[index];
  }

  getItemAtPosition(position) {
    if (this.count === 0) {
      return -1;
    }

    if (position < this.start) {
      return -1;
    }

    if (position >= this.end) {
      return -1;
    }

    let min = 0;
    let max = this.count - 1;

    while (min <= max) {
      const mid = Math.floor(min + (max - min) / 2);
      const item = this.items[mid];

      if (item.start === position) {
        return mid;
      }

      if (position < item.start) {
        max = mid - 1;
      } else {
        min = mid + 1;
      }
    }

    return -1;
  }

  getItemContaining(position) {
    if (this.count === 0) {
      return -1;
    }

    if (position < this.start) {
      return -1;
    }

    if (position > this.end) {
      return -1;
    }

    let min = 0;
    let max = this.count - 1;

    while (min <= max) {
      const mid = Math.floor(min + (max - min) / 2);
      const item = this.items[mid];

      if (item.contains(position)) {
        return mid;
      }

      if (mid < this.count - 1 && item.end <= position && position < this.items[mid + 1].start) {
        return -1;
      }

      if (position < item.start) {
        max = mid - 1;
      } else {
        min = mid + 1;
      }
    }

    return -1;
  }

}

exports.TextRangeCollection = TextRangeCollection;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRleHRSYW5nZUNvbGxlY3Rpb24uanMiXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJUZXh0UmFuZ2VDb2xsZWN0aW9uIiwiY29uc3RydWN0b3IiLCJpdGVtcyIsInN0YXJ0IiwibGVuZ3RoIiwiZW5kIiwiY291bnQiLCJjb250YWlucyIsInBvc2l0aW9uIiwiZ2V0SXRlbUF0IiwiaW5kZXgiLCJFcnJvciIsImdldEl0ZW1BdFBvc2l0aW9uIiwibWluIiwibWF4IiwibWlkIiwiTWF0aCIsImZsb29yIiwiaXRlbSIsImdldEl0ZW1Db250YWluaW5nIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBQ0FBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQkMsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRUMsRUFBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7O0FBQ0EsTUFBTUMsbUJBQU4sQ0FBMEI7QUFDdEJDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2YsU0FBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0g7O0FBQ1EsTUFBTEMsS0FBSyxHQUFHO0FBQ1IsV0FBTyxLQUFLRCxLQUFMLENBQVdFLE1BQVgsR0FBb0IsQ0FBcEIsR0FBd0IsS0FBS0YsS0FBTCxDQUFXLENBQVgsRUFBY0MsS0FBdEMsR0FBOEMsQ0FBckQ7QUFDSDs7QUFDTSxNQUFIRSxHQUFHLEdBQUc7QUFDTixXQUFPLEtBQUtILEtBQUwsQ0FBV0UsTUFBWCxHQUFvQixDQUFwQixHQUF3QixLQUFLRixLQUFMLENBQVcsS0FBS0EsS0FBTCxDQUFXRSxNQUFYLEdBQW9CLENBQS9CLEVBQWtDQyxHQUExRCxHQUFnRSxDQUF2RTtBQUNIOztBQUNTLE1BQU5ELE1BQU0sR0FBRztBQUNULFdBQU8sS0FBS0MsR0FBTCxHQUFXLEtBQUtGLEtBQXZCO0FBQ0g7O0FBQ1EsTUFBTEcsS0FBSyxHQUFHO0FBQ1IsV0FBTyxLQUFLSixLQUFMLENBQVdF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LFFBQUFBLEdBQUcsR0FBR0MsR0FBRyxHQUFHLENBQVo7QUFDSCxPQUZELE1BR0s7QUFDREYsUUFBQUEsR0FBRyxHQUFHRSxHQUFHLEdBQUcsQ0FBWjtBQUNIO0FBQ0o7O0FBQ0QsV0FBTyxDQUFDLENBQVI7QUFDSDs7QUFqRnFCOztBQW1GMUJqQixPQUFPLENBQUNFLG1CQUFSLEdBQThCQSxtQkFBOUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbid1c2Ugc3RyaWN0Jztcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIFRleHRSYW5nZUNvbGxlY3Rpb24ge1xuICAgIGNvbnN0cnVjdG9yKGl0ZW1zKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBpdGVtcztcbiAgICB9XG4gICAgZ2V0IHN0YXJ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGggPiAwID8gdGhpcy5pdGVtc1swXS5zdGFydCA6IDA7XG4gICAgfVxuICAgIGdldCBlbmQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aCA+IDAgPyB0aGlzLml0ZW1zW3RoaXMuaXRlbXMubGVuZ3RoIC0gMV0uZW5kIDogMDtcbiAgICB9XG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5kIC0gdGhpcy5zdGFydDtcbiAgICB9XG4gICAgZ2V0IGNvdW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGg7XG4gICAgfVxuICAgIGNvbnRhaW5zKHBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBwb3NpdGlvbiA+PSB0aGlzLnN0YXJ0ICYmIHBvc2l0aW9uIDwgdGhpcy5lbmQ7XG4gICAgfVxuICAgIGdldEl0ZW1BdChpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2luZGV4IGlzIG91dCBvZiByYW5nZScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zW2luZGV4XTtcbiAgICB9XG4gICAgZ2V0SXRlbUF0UG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHRoaXMuY291bnQgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9zaXRpb24gPCB0aGlzLnN0YXJ0KSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvc2l0aW9uID49IHRoaXMuZW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1pbiA9IDA7XG4gICAgICAgIGxldCBtYXggPSB0aGlzLmNvdW50IC0gMTtcbiAgICAgICAgd2hpbGUgKG1pbiA8PSBtYXgpIHtcbiAgICAgICAgICAgIGNvbnN0IG1pZCA9IE1hdGguZmxvb3IobWluICsgKG1heCAtIG1pbikgLyAyKTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW21pZF07XG4gICAgICAgICAgICBpZiAoaXRlbS5zdGFydCA9PT0gcG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uIDwgaXRlbS5zdGFydCkge1xuICAgICAgICAgICAgICAgIG1heCA9IG1pZCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBtaW4gPSBtaWQgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgZ2V0SXRlbUNvbnRhaW5pbmcocG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHRoaXMuY291bnQgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9zaXRpb24gPCB0aGlzLnN0YXJ0KSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvc2l0aW9uID4gdGhpcy5lbmQpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWluID0gMDtcbiAgICAgICAgbGV0IG1heCA9IHRoaXMuY291bnQgLSAxO1xuICAgICAgICB3aGlsZSAobWluIDw9IG1heCkge1xuICAgICAgICAgICAgY29uc3QgbWlkID0gTWF0aC5mbG9vcihtaW4gKyAobWF4IC0gbWluKSAvIDIpO1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbXNbbWlkXTtcbiAgICAgICAgICAgIGlmIChpdGVtLmNvbnRhaW5zKHBvc2l0aW9uKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWlkIDwgdGhpcy5jb3VudCAtIDEgJiYgaXRlbS5lbmQgPD0gcG9zaXRpb24gJiYgcG9zaXRpb24gPCB0aGlzLml0ZW1zW21pZCArIDFdLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uIDwgaXRlbS5zdGFydCkge1xuICAgICAgICAgICAgICAgIG1heCA9IG1pZCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBtaW4gPSBtaWQgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG59XG5leHBvcnRzLlRleHRSYW5nZUNvbGxlY3Rpb24gPSBUZXh0UmFuZ2VDb2xsZWN0aW9uO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGV4dFJhbmdlQ29sbGVjdGlvbi5qcy5tYXAiXX0=