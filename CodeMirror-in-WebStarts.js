/*
  CodeMirror_in_WebStarts.js by theawesomecoder61
  version 1.4
  - - - - -
  Compatible with:
   - Tampermonkey
   - Greasemonkey
   - any Javascript-injecting browser extensions
  - - - - -
  File compatibility:
   - .html (HTML)
   - .htm (also HTML)
   - .css (CSS)
   - .js (Javascript)
   - .txt (Plain text)
   - .svg (SVG)
   - .xml (XML)
  - - - - -
  Note:
   - Please be sure to add "http://www.webstarts.com/cadmin/dashboard/editor/*" (without quotes) in the whitelist or included/allowed webpages of the browser extension.
  - - - - -
  Version 1.4:
   - added support for XML files
  Version 1.3:
   - toggle comment on a selection by pushing Ctrl/Cmd + Forward-slash (/))
   - push F11 while editing will make the editor go in fullscreen, Escape closes out
   - removed a key shortcut that wasn't useful
   - cleaned up the script
  Version 1.2:
   - added back some of the formatting buttons
   - small fixes
   - coming soon: image, table, and hyperlink buttons will be functional
  Version 1.1:
   - cleaned up the script
   - removed jQuery
   - added code folding
   - added file detection, the syntax-highlighting now adjusts based on the file type
  Version 1.0:
   - initial version
*/

// ==UserScript==
// @name        CodeMirror in WebStarts
// @namespace   cminwebstarts
// @description Adds the CodeMirror text editor within WebStarts
// @include     http://www.webstarts.com/cadmin/dashboard/editor/*
// @version     1
// @grant       none
// ==/UserScript==

console.log("CodeMirror_in_WebStarts.js (version 1.4) by theawesomecoder61\nAdding in CodeMirror dependencies...");

var editor;

// add in some styles first
var css = ".CodeMirror { text-align: left; } #btn_Insert, #btn_Image, #btn_Table, #btn_Hyperlink, #btn_SplitView { display: none; }";
var style = document.createElement("style");
style.type = "text/css";
if(style.styleSheet) {
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}
document.getElementsByTagName("head")[0].appendChild(style);

// remove all sessionstorage items
var i = sessionStorage.length;
while(i--) {
  var key = sessionStorage.key(i);
  if(/foo/.test(key)) {
    sessionStorage.removeItem(key);
  }
}
sessionStorage.setItem("cmmode", "text/plain");

// create a textarea for CodeMirror
var ta = document.createElement("textarea");
ta.id = "tatocm";
ta.style.width = "98%";
ta.style.height = "182px";
document.getElementById("edit-area-html").appendChild(ta);

// add important files
addStyle("http://codemirror.net/lib/codemirror.css");
addStyle("http://codemirror.net/addon/fold/foldgutter.css");
addStyle("http://codemirror.net/addon/display/fullscreen.css");
// requirements
addScript("http://codemirror.net/lib/codemirror.js", function() {
  // modes
  addScript("http://codemirror.net/mode/xml/xml.js", function() {
    addScript("http://codemirror.net/mode/css/css.js", function() {
      addScript("http://codemirror.net/mode/javascript/javascript.js", function() {
        addScript("http://codemirror.net/mode/vbscript/vbscript.js", function() {
          addScript("http://codemirror.net/mode/htmlmixed/htmlmixed.js", function() {
            // code folding
            addScript("http://codemirror.net/addon/fold/foldcode.js", function() {
              addScript("http://codemirror.net/addon/fold/foldgutter.js", function() {
                addScript("http://codemirror.net/addon/fold/brace-fold.js", function() {
                  addScript("http://codemirror.net/addon/fold/xml-fold.js", function() {
                    addScript("http://codemirror.net/addon/fold/comment-fold.js", function() {
                      // comments
                      addScript("http://codemirror.net/addon/comment/comment.js", function() {
                        // fullscreen
                        addScript("http://codemirror.net/addon/display/fullscreen.js", function() {
                          console.log("Finished loading dependencies"); 
                        });
                      });
                    });
                  });
                });
              });
            });      
          });
        });
      });
    });
  });
});

// when the page loads
window.onload = function() {
  // create a CodeMirror instance
  editor = CodeMirror.fromTextArea(document.getElementById("tatocm"), {
    mode: "text/plain",
    lineNumbers: true,
    lineWrapping: true,
    extraKeys: {
      "F11": function(cm) {
        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
      },
      "Esc": function(cm) {
        if(cm.getOption("fullScreen")) {
          cm.setOption("fullScreen", false);
        }
      },
      "Ctrl-/": "toggleComment",
      "Cmd-/": "toggleComment"
    },
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
  });
  setupCM();
  console.log("Set up CodeMirror!");
  
  // hide the main textarea
  document.getElementById("contentEditor").style.display = "none";
  detectMode();

  // override the formatting buttons & menus
  // undo
  document.getElementById("btn_Undo").onclick = function() {
    editor.undo();
  }
  // redo
  document.getElementById("btn_Redo").onclick = function() {
    editor.redo();
  }
  // bold
  document.getElementById("btn_Bold").onclick = function() {
    editor.focus();
    editor.replaceSelection("<strong></strong>");
    var crsr = editor.getCursor();
    editor.setCursor({line: crsr.line, ch: crsr.ch-9});
  }
  // italics
  document.getElementById("btn_Italic").onclick = function() {
    editor.focus();
    editor.replaceSelection("<i></i>");
    var crsr = editor.getCursor();
    editor.setCursor({line: crsr.line, ch: crsr.ch-4});
  }
  // underline
  document.getElementById("btn_Underline").onclick = function() {
    editor.focus();
    editor.replaceSelection("<u></u>");
    var crsr = editor.getCursor();
    editor.setCursor({line: crsr.line, ch: crsr.ch-4});
  }
  // lists
  // justify
  document.querySelectorAll("#Menu_7 a")[0].onclick = function(e) {
    e.preventDefault();
    editor.focus();
    editor.replaceSelection("<div align=\"justify\"></div>");
    var crsr = editor.getCursor();
    editor.setCursor({line: crsr.line, ch: crsr.ch-6});
  }
  // left
  document.querySelectorAll("#Menu_7 a")[1].onclick = function(e) {
    e.preventDefault();
    editor.focus();
    editor.replaceSelection("<div align=\"left\"></div>");
    var crsr = editor.getCursor();
    editor.setCursor({line: crsr.line, ch: crsr.ch-6});
  }
  // center
  document.querySelectorAll("#Menu_7 a")[2].onclick = function(e) {
    e.preventDefault();
    editor.focus();
    editor.replaceSelection("<div align=\"center\"></div>");
    var crsr = editor.getCursor();
    editor.setCursor({line: crsr.line, ch: crsr.ch-6});
  }
  // right
  document.querySelectorAll("#Menu_7 a")[3].onclick = function(e) {
    e.preventDefault();
    editor.focus();
    editor.replaceSelection("<div align=\"right\"></div>");
    var crsr = editor.getCursor();
    editor.setCursor({line: crsr.line, ch: crsr.ch-6});
  }
  // lists
  // list (unordered)
  document.querySelectorAll("#Menu_8 a")[0].onclick = function(e) {
    e.preventDefault();
    editor.focus();
    editor.replaceSelection("\n<UL>\n <li>Item 1</li>\n <li>Item 2</li>\n <li>Item 3</li>\n</UL>");
    var crsr = editor.getCursor();
    editor.setCursor({line: crsr.line-5, ch: 0});
  }
  // numbered
  document.querySelectorAll("#Menu_8 a")[1].onclick = function(e) {
    e.preventDefault();
    editor.focus();
    editor.replaceSelection("\n<OL>\n <li>Item 1</li>\n <li>Item 2</li>\n <li>Item 3</li>\n</OL>");
    var crsr = editor.getCursor();
    editor.setCursor({line: crsr.line-5, ch: 0});
  }
  
  // update the editor when the user selects another file
  var allfiles = document.querySelectorAll(".dTreeNode a");
  for(var i=0;i<allfiles.length;i++) {
    allfiles[i].addEventListener('click', function() {
      setTimeout(function() {
        detectMode();
        setupCM();
      }, 1000);
    });
  }
}

// detect which CodeMirror language to use
function detectMode() {
  var fName = document.querySelector("#pagelink a").innerText; // document.getElementById("currentName").innerText;
  var fType = fName.split(".").pop(); // html/htm, css, js, txt
  console.log("File extension is '" + fType + "'");

  if(fType.toLowerCase() == "html" || fType.toLowerCase == "htm") {
    sessionStorage.setItem("cmmode", "mixedMode");
  } else if(fType.toLowerCase() == "css") {
    sessionStorage.setItem("cmmode", "text/css");
  } else if(fType.toLowerCase() == "js") {
    sessionStorage.setItem("cmmode", "text/javascript");
  } else if(fType.toLowerCase() == "txt") {
    sessionStorage.setItem("cmmode", "text/plain");
  } else if(fType.toLowerCase() == "svg" || fType.toLowerCase() == "xml") {
    sessionStorage.setItem("cmmode", "text/html");
  }
}

function setupCM() {
  var mixedMode = {
    name: "htmlmixed",
    scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
                   mode: null},
                  {matches: /(text|application)\/(x-)?vb(a|script)/i,
                   mode: "vbscript"}]
  };  

  // set the size
  editor.setSize("100%", "100%");

  // set the CodeMirror's value to the original textarea's value
  editor.setValue(document.getElementById("contentEditor").value);

  // load mode
  if(sessionStorage.getItem("cmmode") == "mixedMode") {
    editor.setOption("mode", mixedMode);
  } else {
    editor.setOption("mode", sessionStorage.getItem("cmmode"));
  }

  // send the CodeMirror's value back to the original textarea
  editor.on("change", function(cm, change) {
    document.getElementById("contentEditor").value = "";
    document.getElementById("contentEditor").value = cm.getValue();
    cm.save();
  });

  // wait and load the mode
  setTimeout(function(ed) {
    if(sessionStorage.getItem("cmmode") == "mixedMode") {
      ed.setOption("mode", mixedMode);
    } else {
      ed.setOption("mode", sessionStorage.getItem("cmmode"));
    }
  }, 100, editor);
  
  // the original textarea auto-focuses on itself, so we're fixing that
  setInterval(function(ed) {
    ed.focus();
  }, 2000, editor);
}

// helper functions
function addStyle(sl) {
  var s = document.createElement("link");
  s.rel = "stylesheet";
  s.href = sl;
  document.getElementsByTagName("head")[0].appendChild(s);
}

function addScript(sl, ac) {
  var s = document.createElement("script");
  s.src = sl;
  s.onload = ac;
  document.getElementsByTagName("head")[0].appendChild(s);
}
