/*
 * Javascript Diff Algorithm for Strings that might contain Chinese or other multi byte chacacters not separated by spaces.
 * Author: Brian van Damme
 * Date: March 10, 2015
 *
 * 这个库是基于原作者Brian van Damme的diffChinese根据业务需求进行改动的版本
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.diffChinese = factory();
  }
}(this, function () {
  // ESCAPE CHARS
  function escape(s) {
    var n = s;
    n = n.replace(/&/g, "&amp;");
    n = n.replace(/</g, "&lt;");
    n = n.replace(/>/g, "&gt;");
    n = n.replace(/"/g, "&quot;");
    return n;
  }

  // GET ALL THE SEPARATORS
  function getSpaces(s) {
    var ret = s.split(/[\u0000-\uffff]/);
    if (ret == null) {
      ret = ["\n"];
    } else {
      ret.push("\n");
    }
    return ret;
  }

  // FIND THE DIFFERENCES BETWEEN 2 ARRAYS OF WORDS. CREDIT GOES TO JOHN RESIG
  function diff(o, n) {
    var ns = new Object();
    var os = new Object();

    for (var i = 0; i < n.length; i++) {
      if (ns[n[i]] == null)
        ns[n[i]] = { rows: new Array(), o: null };
      ns[n[i]].rows.push(i);
    }

    for (var i = 0; i < o.length; i++) {
      if (os[o[i]] == null)
        os[o[i]] = { rows: new Array(), n: null };
      os[o[i]].rows.push(i);
    }

    for (var i in ns) {
      if (ns[i].rows.length == 1 && typeof (os[i]) != "undefined" && os[i].rows.length == 1) {
        n[ns[i].rows[0]] = { text: n[ns[i].rows[0]], row: os[i].rows[0] };
        o[os[i].rows[0]] = { text: o[os[i].rows[0]], row: ns[i].rows[0] };
      }
    }

    for (var i = 0; i < n.length - 1; i++) {
      if (n[i].text != null && n[i + 1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null &&
        n[i + 1] == o[n[i].row + 1]) {
        n[i + 1] = { text: n[i + 1], row: n[i].row + 1 };
        o[n[i].row + 1] = { text: o[n[i].row + 1], row: i + 1 };
      }
    }

    for (var i = n.length - 1; i > 0; i--) {
      if (n[i].text != null && n[i - 1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null &&
        n[i - 1] == o[n[i].row - 1]) {
        n[i - 1] = { text: n[i - 1], row: n[i].row - 1 };
        o[n[i].row - 1] = { text: o[n[i].row - 1], row: i - 1 };
      }
    }

    return { o: o, n: n };
  }

  // This example returns an object, but the module
  // can return a function as the exported value.
  return function (o, n, point) {

    // TRIM 去除两端空格
    o = o.replace(/\s+$/, '');
    n = n.replace(/\s+$/, '');

    // GET ALL THE WORDS IN THE STRING. SPLIT BY SPACE. SPLIT BY CHARACTER FOR CHINESE
    // 字符串转数组传参
    var out = diff(o == "" ? [] : o.match(/[\u0000-\uffff]/g), n == "" ? [] : n.match(/[\u0000-\uffff]/g));

    // GET ALL THE IN BETWEEN STUFF
    var oSpace = getSpaces(o);
    var nSpace = getSpaces(n);

    // 分析重复占比  新文本和旧文本的差异率 count
    var count = 0;
    for (var i = 0; i < out.n.length; i++) {
      if (out.n[i].text == null) {
        count++
      }
    }
    count = count / out.n.length

    // 如果差异率大于设定的point百分比值，将不再对文本进行高亮
    if (point != undefined && count > point) {
      return { before: o, after: n };
    } else {
      // REBUILD ORIGINAL STRING
      var os = "";
      for (var i = 0; i < out.o.length; i++) {
        if (out.o[i].text != null) {
          os += oSpace[i];
          os += escape(out.o[i].text);
        } else {
          // WRAP IN <DEL> TAG IF REMOVED
          os += "<span class='del-text'>" + oSpace[i] + escape(out.o[i]) + "</span>";
        }
      }

      // REBUILD NEW STRING
      var ns = "";
      for (var i = 0; i < out.n.length; i++) {
        if (out.n[i].text != null) {
          ns += nSpace[i];
          ns += escape(out.n[i].text);
        } else {
          // WRAP IN <INS> TAG IF NEW
          ns += "<span class='new-text'>" + nSpace[i] + escape(out.n[i]) + "</span>";
        }
      }
    }
    return { before: os, after: ns };
  };
}));