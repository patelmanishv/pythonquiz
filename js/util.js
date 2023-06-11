const checkOS = function () {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.indexOf('windows nt') > -1) {
    return 'windows';
  }
  if (ua.indexOf('android') > -1) {
    return 'android';
  }
  if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1) {
    return 'iOS';
  }
  if (ua.indexOf('macintosh') > -1 && 'ontouchend' in document) {
    return 'iPadOS'
  }
  if (ua.indexOf('mac os x') > -1) {
    return 'macOS';
  }
}

const isWindows = function () {
  return checkOS() === 'windows';
}

const isAndroid = function () {
  return checkOS() === 'android';
}

const isIOS = function () {
  return checkOS() === 'iOS';
}

const isIPadOS = function () {
  return checkOS() === 'iPadOS';
}

const isMacOS = function () {
  return checkOS() === 'macOS';
}

const checkBrowser = function () {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.indexOf('msie') > -1 || ua.indexOf('trident') > -1) {
    return 'ie';
  }
  if (ua.indexOf('edge') > -1) {
    return 'edge';
  }
  if (ua.indexOf('chrome') > -1) {
    return 'chrome';
  }
  if (ua.indexOf('safari') > -1) {
    return 'safari';
  }
  if (ua.indexOf('firefox') > -1) {
    return 'firefox';
  }
}

const isIE = function () {
  return checkBrowser() === 'ie';
}

const isEdge = function () {
  return checkBrowser() === 'edge';
}

const isChrome = function () {
  return checkBrowser() === 'chrome';
}

const isSafari = function () {
  return checkBrowser() === 'safari';
}

const isFirefox = function () {
  return checkBrowser() === 'firefox';
}

function htmlspecialchars(escape) {
  if (typeof escape === 'string') {
    escape = escape.replace(/&/g, '&amp;');
    escape = escape.replace(/</g, '&lt;');
    escape = escape.replace(/>/g, '&gt;');
    escape = escape.replace(/"/g, '&quot;');
    escape = escape.replace(/'/g, '&#39;');
  }
  return escape;
}

function h(escape) {
  return htmlspecialchars(escape);
}

function htmlspecialchars_decode(string, quote_style) {
  //       discuss at: http://phpjs.org/functions/htmlspecialchars_decode/
  //      original by: Mirek Slugen
  //      improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //      bugfixed by: Mateusz "loonquawl" Zalega
  //      bugfixed by: Onno Marsman
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //         input by: ReverseSyntax
  //         input by: Slawomir Kaniecki
  //         input by: Scott Cariss
  //         input by: Francois
  //         input by: Ratheous
  //         input by: Mailfaker (http://www.weedem.fr/)
  //       revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //        example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES');
  //        returns 1: '<p>this -> &quot;</p>'
  //        example 2: htmlspecialchars_decode("&amp;quot;");
  //        returns 2: '&quot;'

  let optTemp = 0;
  let i = 0;
  let noquotes = false;
  if (typeof quote_style === 'undefined') {
    quote_style = 2;
  }
  string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const OPTS = {
    ENT_NOQUOTES: 0,
    ENT_HTML_QUOTE_SINGLE: 1,
    ENT_HTML_QUOTE_DOUBLE: 2,
    ENT_COMPAT: 2,
    ENT_QUOTES: 3,
    ENT_IGNORE: 4,
  };
  if (quote_style === 0) {
    noquotes = true;
  }
  if (typeof quote_style !== 'number') {
    // Allow for a single string or an array of string flags
    quote_style = [].concat(quote_style);
    for (i = 0; i < quote_style.length; i++) {
      // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
      if (OPTS[quote_style[i]] === 0) {
        noquotes = true;
      } else if (OPTS[quote_style[i]]) {
        optTemp |= OPTS[quote_style[i]];
      }
    }
    quote_style = optTemp;
  }
  if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
    string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
    // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
  }
  if (!noquotes) {
    string = string.replace(/&quot;/g, '"');
  }
  // Put this in last place to avoid escape being double-decoded
  string = string.replace(/&amp;/g, '&');

  return string;
}

// uuidv4.min.js - https://github.com/uuidjs/uuid
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).uuidv4=e()}(this,(function(){"use strict";var t,e=new Uint8Array(16);function o(){if(!t&&!(t="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return t(e)}var n=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;function r(t){return"string"==typeof t&&n.test(t)}for(var i=[],u=0;u<256;++u)i.push((u+256).toString(16).substr(1));return function(t,e,n){var u=(t=t||{}).random||(t.rng||o)();if(u[6]=15&u[6]|64,u[8]=63&u[8]|128,e){n=n||0;for(var f=0;f<16;++f)e[n+f]=u[f];return e}return function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,o=(i[t[e+0]]+i[t[e+1]]+i[t[e+2]]+i[t[e+3]]+"-"+i[t[e+4]]+i[t[e+5]]+"-"+i[t[e+6]]+i[t[e+7]]+"-"+i[t[e+8]]+i[t[e+9]]+"-"+i[t[e+10]]+i[t[e+11]]+i[t[e+12]]+i[t[e+13]]+i[t[e+14]]+i[t[e+15]]).toLowerCase();if(!r(o))throw TypeError("Stringified UUID is invalid");return o}(u)}}));
