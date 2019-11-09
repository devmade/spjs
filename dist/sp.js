String.prototype.replaceAll = function(search, replacement) {
  return this.split(search).join(replacement);
};

let __prevScrollpos = window.pageYOffset;

const SP_DATA_COLORS  = ["green","teal","indigo","red","pink","purple","deeppurple","blue","skyblue","orange","brown","bluegrey","primary","warning","info","success","danger","black","white","yellow","steelblue","grey"];
const SP_DATA_LD = ["lighten1","lighten2","lighten3","lighten4","darken1","darken2","darken3","darken4"];

(function(root, factory) {

  "use strict";

  if(typeof module === "object" && typeof module.exports === "object"){
    module.exports = root.document ?
    factory(root, true) :
    w => {
      if (!w.document){
        throw new Error("Required a window with a documentElement");
      }
      return factory(w);
    };
  }
  else {
    factory(root);
  }
}(this, (w) => {

	const __sp_eventMap = {
	    click: "click",
	    mousedown: "mousedown",
	    mouseup: "mouseup",
	    mousemove: "mousemove"
	};

    let eventReplacement = {
        click: ["touchstart", "click"],
        mousedown: ["touchstart", "mousedown"],
        mouseup: ["touchend", "mouseup"],
        mousemove: ["touchmove", "mousemove"]
    };

    for (let i in eventReplacement) {
        if (typeof window["on" + eventReplacement[i][0]] === "object") {
            __sp_eventMap[i] = eventReplacement[i][0];
        } 
        else {
            __sp_eventMap[i] = eventReplacement[i][1];
        }
    }

	const SPprops = {
	  scrimCount: 0,
	  scrimCountBy: {
	    Waiting: 0,
	    Dialog: 0,
	    MaterialNav: 0,
	    Sheet: 0,
      ContextMenu: 0
	  },
	  scrimColors: [],
	  scrimListeners: [],
	  blockGoingBack: false,
	  blockCount: 0,
	  blockGoingBackBy: {
	      MaterialNav: 0,
	      Dialog: 0,
	      FSDialog: 0,
	      Waiting: 0,
        ContextMenu: 0
	  },
	  historySteps: 0,
	  widgetCount: {
	    Toast: 0,
	    Snackbar: 0,
	    Waiting: 0,
	    Dialog: 0,
	    Sheet: 0,
	    FSDialog: 0,
      ContextMenu: 0
	  },
	  Callback: {
	      Waiting: undefined
	  },
	  MaterialNav: false
	};

  // Function to stop going back
  function historyListener(){
    SPprops.historySteps++;
    history.pushState(null, document.title, location.href);
  }

  // Function to prevent default
  function preventDefault(e){
    e.preventDefault();
  }

    let SP = function(selector){
        let self = {};
        self.selector = selector;
        //now distinguish or classify the selector type
        //this is for array or nodes of elements
        //sType is selector type
        // e for element, d for document, s for css selected elements
        if (typeof self.selector === "object"){
          self.elements = self.selector;
          self.eleLength = 1;
          self.sType = "e";
        }
        //if selector is document object
        else if(self.selector === document){
          self.elements = document.documentElement;
          self.eleLength = 0;
          self.sType = "d";
        }
        //if selector is some CSS selector
        else if(typeof self.selector === "string" && self.selector.toLowerCase() === "body"){
          self.elements = document.body;
          self.eleLength = 1;
          self.sType = "e";
        }
        else if(typeof self.selector === "string" && self.selector.toLowerCase() === "html"){
          self.elements = document.body.parentElement;
          self.eleLength = 1;
          self.sType = "e";
        }
        else if(typeof self.selector === "string"){
          self.elements = document.querySelectorAll(self.selector);
          self.eleLength = self.elements.length;
          self.sType = "s";
        }
        else {
          self.selector = "html";
          self.eleLength = 1;
          self.sType = "h";
        }

        /*find max z value or assign it*/
        self.maxZ = () => {
			let z = [],
			eles = document.querySelectorAll("body *");
			eles.forEach(r => {
				let style = window.getComputedStyle(r);
				
				if(style.getPropertyValue("z-index")){
					z.push(style.getPropertyValue("z-index"));
				}
			});

			let largest= -999999;
			
			for (let i = 0; i <= z.length; i++){
				if (parseInt(z[i])>largest) {
					largest = parseInt(z[i]);
				}
			}
          
        	if(self.selector !== "none"){
				self.css({zIndex:largest+1});
				return self;
        	}
        	
        	else { return largest; }
        };

        /*create sp snackbar*/
        self.createSnackbar = (text, duration = 2.5, option = {}) => {
          SPprops.widgetCount.Snackbar++;

          let sb = document.createElement("div");
          sb.classList.add("sp-snackbar");

          let animType = option.animate || "translate";
          sb.style.background = option.background || "#000";
          sb.style.color = option.color || "#fff";
          sb.style.width = option.width || "100%";
          sb.style.maxWidth = option.maxWidth || "100%";
          sb.style.borderRadius = option.borderRadius || "0px";
          sb.style.boxShadow = option.boxShadow || "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)";
          
          sb.innerHTML = text;
          document.body.appendChild(sb);

          if (option.button) {
            let button = document.createElement("button");

            button.style.background = option.button.background || "#000";
            button.style.color = option.button.color || "#7e57c2";
            button.style.borderRadius = option.button.borderRadius || "2px";
            button.style.boxShadow = option.button.boxShadow || "none";
            button.innerHTML = option.button.text || "Button";

            sb.appendChild(button);

            if(option.button.callback && typeof option.button.callback === "function"){
              button.addEventListener("click", () => {
                option.button.callback();
                self.removeSnackbar();
              });
            }
          }

          if (option.swipeable === true) {
            $(".sp-snackbar").swipe("right", self.removeSnackbar);
          }

          if (animType === "translate"){
            sb.style.bottom = "-1000px";

            setTimeout(()=>{
              sb.style.bottom = option.bottom || 0;
            }, 300); 

            setTimeout(()=>{
              sb.style.bottom = "-58px";

              setTimeout(()=>{
                self.removeSnackbar();
              }, 300);

            }, duration*1000);
          }

          else {
            sb.style.opacity = 0;
            sb.style.bottom = option.bottom || 0;

            setTimeout(() => {
              sb.style.opacity = 1;
            }, 300);

            setTimeout(() => {
              sb.style.opacity = 0;

              setTimeout(() => {
                self.removeSnackbar();
              }, 300);

            }, duration*1000);
          }

          return self;
        };

        self.removeSnackbar = () => {
          let sb = document.querySelector("div.sp-snackbar");
          if(sb && SPprops.widgetCount.Snackbar > 0){
            sb.parentElement.removeChild(sb);
            SPprops.widgetCount.Snackbar--;

            return self;
          }
          else {
            return false;
          }
        };

        /*create sp toast (like snackbar but with no functionality)*/
        self.createToast = (text, duration = 1.5, options = {
              background: "#eee",
              color:"#000",
              bottom:"20px"
          }) => {
          SPprops.widgetCount.Toast++;

          let b = options.background || "#eee";
          let c = options.color || "#000";
          let _b = options.bottom || "20px";

          if(typeof _b === "number"){
            _b = _b + "px";
          }

          let toast = document.createElement("div");
          toast.innerHTML = text;
          toast.classList.add("sp-toast");
          $(toast).css({
            zIndex: self.maxZ() + 10,
            background:b,
            color:c,
            bottom:_b
          });

          document.body.appendChild(toast);

          setTimeout(() => {
            self.removeToast();
          }, duration*1000);

          return self;
        };

        self.removeToast = () => {
          let t = document.querySelector("div.sp-toast");
          if(t && SPprops.widgetCount.Toast > 0){
            t.parentElement.removeChild(t);
            SPprops.widgetCount.Toast--;

            return self;
          }
          else {
            return false;
          }
        };

        // create sp custom toast
        self.customToast = (domElement, duration = 2) => {
        	domElement.classList.add("sp-custom-toast");
        	document.body.appendChild(domElement);

        	setTimeout(() => {
          		self.removeCustomToast();
        	}, duration*1000);

        	return self;
        };

        self.removeCustomToast = () => {
          let ct = document.querySelector(".sp-custom-toast");
          if(ct){
            ct.parentElement.removeChild(ct);
            return self;
          }
          else {
            return false;
          }
        };

        // create sp action sheet (material-design)
        self.createSheet = (options) => {
          self.toggleNoScroll();

          SPprops.widgetCount.Sheet++;
          SPprops.scrimCountBy.Sheet++;
          SPprops.blockGoingBackBy.Waiting++;
          self.preventBackKey();
          self.createScrim();
          self.scrimAddListener("click", self.removeSheet);

          options = options || {title: "", content: "", background: "#fff", color: "#000"};

          let t = options.title || "";
          let cnt = options.content || "";
          let b = options.background || "#fff";
          let c = options.color || "#000";

          let d = document.createElement("div");

          d.innerHTML += `
          <div class="bottomsheet unselectable" unselectable="on" id="bottomsheet">
            <div class="header fixed bottomsheet-bar" id="bottomsheetBar" style="padding-left:72px;background:${b};color:${c}">
              <i class="material-icons left-icon ripple bottomsheet-close" id="bottomsheetClose">close</i>
              ${t}
            </div>
            <div class="container" style="padding-top:72px">
              ${cnt}
            </div>
          </div>
            `;

          document.body.appendChild(d);
          __sp_bottomsheet();

          return self;
        };

        self.removeSheet = () => {
          self.toggleNoScroll();

          let bs = document.getElementById("bottomsheet");
          if(bs && SPprops.widgetCount.Sheet > 0){
          	SPprops.widgetCount.Sheet--;
          	SPprops.scrimCountBy.Sheet--;
            SPprops.blockGoingBackBy.Waiting--;
            self.defaultBackKey();
          	self.scrimRemoveListener("click", self.removeSheet);
            self.removeScrim();
            bs.parentElement.removeChild(bs);

            return self;
          }
          else {
            return false;
          }
        };

        // create loading or waiting whatever you call it
        self.createWaiting = (options, callback) => {
          SPprops.widgetCount.Waiting++;
          SPprops.blockGoingBackBy.Waiting++;
          self.preventBackKey();

          SPprops.Callback.Waiting = callback;

          options = options || {loadingAnimation: true, title:"Loading", text: false};

          let loadingAnimation = options.loadingAnimation || true;
          let title = options.title || "Loading";
          let text = options.text || false;
          let timeout = options.timeout || undefined;
          let scrim = options.scrim || true;

          if(timeout){
            setTimeout(destroy, options.timeout*1000);
          }

          if(scrim){
            SPprops.scrimCountBy.Waiting++;
            self.createScrim();
          }

          if(document.querySelector(".sp-waiting")){
            document.body.removeChild(document.querySelector(".sp-waiting"));
          }

          let d = document.createElement("div");
          d.classList.add("sp-waiting", "shadow3");
          d.style.zIndex = self.maxZ() + 1;

          if(loadingAnimation){
            let _d = document.createElement("div");
            _d.classList.add("sp-waiting-anim");

            _d.innerHTML = `
              <div class="_sp_loader_showbox">
                <div class="_sp_loader_loader">
                  <svg class="_sp_loader_circular" viewBox="25 25 50 50">
                    <circle class="_sp_loader_path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
                  </svg>
                </div>
              </div>
              `;

            d.appendChild(_d);
          }

          let _t = document.createElement("div");
          _t.classList.add("sp-waiting-title");
          _t.innerHTML = title;

          d.appendChild(_t);

          if(text){
            let _text = document.createElement("div");
            _text.classList.add("sp-waiting-text");
            _text.innerHTML = text;

            d.appendChild(_text);
          }

          document.body.appendChild(d);

          function destroy(){
              self.removeWaiting(callback);
          }

          if(typeof timeout !== "undefined"){
            setTimeout(destroy, timeout*1000);
          }

          return self;
        };

        // to destroy the waiting process
        self.removeWaiting = (callback) => {
            if(SPprops.blockGoingBackBy.Waiting > 0){
              SPprops.blockGoingBackBy.Waiting--;
              self.defaultBackKey();
            }

            let w = document.querySelector(".sp-waiting");

            if(w && SPprops.widgetCount.Waiting > 0){
              document.body.removeChild(w);
              SPprops.widgetCount.Waiting--;

              if(SPprops.scrimCountBy.Waiting > 0){
                self.removeScrim();
                SPprops.scrimCountBy.Waiting--;
              }
            }

            if(typeof SPprops.Callback.Waiting === "function"){
                SPprops.Callback.Waiting();
            }
            else if (typeof callback === "function"){
                callback();
            }

            return self;
        };


        /*custom material dialog box*/
        self.createDialog = (options, dismissable = true, scrim = true, shadow = true) => {
            SPprops.widgetCount.Dialog++;
            SPprops.blockGoingBackBy.Dialog++;
            self.preventBackKey();
            self.toggleNoScroll();

            options = options || {};

            let cHTML = options.HTML;
            let cTitle = options.titleColor || "#000";
            let cText = options.textColor || "#000";
            let cContent = options.contentColor || "#000";
            let cBackground = options.background || "#fff";
            let cContentBorder = options.contentBorder || "1px solid #eee";
            let cScrim = options.scrimColor || "rgba(0,0,0,0.4)";
            let cBorderRadius = options.borderRadius || "4px";

            let _buttons = [];
            if(options.button && typeof options.button === "object"){
            	_buttons.push(options.button);
            }
            else if(options.buttons && Array.isArray(options.buttons)){
            	_buttons = options.buttons;
            }
            
            let ele = document.createElement("div");
            
            ele.classList.add("dialog");
            ele.style.borderRadius = cBorderRadius;
            ele.style.background = cBackground;

            if (shadow){
                ele.classList.add("shadow5");
            }

            document.body.appendChild(ele);

            // Make it on top of anything
            $(ele).maxZ();

            if (scrim){
                self.createScrim(cScrim);
                SPprops.scrimCountBy.Dialog++;
            }

        	// On Pressing back key, remove the dialog if dismissable === true
            if (dismissable === true){
            	if(scrim){
	                self.scrimAddListener("click", _delete);
            	}

                // self.onBackKey(self.removeDialog);
            }

            if (typeof cHTML === "undefined"){
                if (options.title){
                    let eTitle = document.createElement("div");
                    eTitle.classList.add("dialog-title");
                    eTitle.style.color = cTitle;
                    eTitle.innerHTML = options.title;
                    ele.appendChild(eTitle);
                }
                if (options.text){
                    let eText = document.createElement("div");
                    eText.classList.add("dialog-text");
                    eText.style.color = cText;
                    eText.innerHTML = options.text;
                    ele.appendChild(eText);
                }
                if (options.content){
                    let eContent = document.createElement("div");
                    eContent.classList.add("dialog-content");
                    eContent.style.color = cContent;
                    eContent.style.border = cContentBorder;

                    if(typeof options.content === "object"){
                    	eContent.appendChild(options.content);
                    }
                    else {
	                    eContent.innerHTML = options.content;
                    }

                    ele.appendChild(eContent);
                }

                if(Array.isArray(_buttons) && _buttons.length >= 1){
                	_buttons.forEach( data => {
                		if(typeof data === "object"){
	                		_add_listener(_make_btn(data), data.action);
                		}
                	});
	            }
            }
            else {
            	ele.appendChild(cHTML);
            }

            // functions to handle clicks
            function _make_btn(opts){
	            let btn = document.createElement("button");
	            btn.classList.add("dialog-btn", "ripple-dark");
	            
	            if(opts.class){
	            	btn.classList.add(opts.class);
	            }

	            if(opts.background){
	            	btn.style.background = opts.background;
	            }

	            if(opts.color){
	            	btn.style.color = opts.color;
	            }

	            if(!opts.class && !opts.background && !opts.color){
	            	btn.style.color = "#007bff";
	            }

	            btn.innerHTML = opts.text;
	            ele.appendChild(btn);

	            return btn;
            }

            function _add_listener(btn, action){
            	if (btn.innerText.toLowerCase() === "cancel" || (typeof action === "string" && action.toLowerCase() === "cancel")){
                    btn.addEventListener("click", _delete);
                }
                else if (typeof action === "function"){
                    btn.addEventListener("click", () => {
                    	_function(action);
                    });
                }
                else if(self.isURL(action)){
                    btn.addEventListener("click", () => {
                    	_visit(action);
                    });
                }
            }

            function _visit(action){
            	window.open(action, "_blank");
            	_delete();
            }

            function _function(action){
            	action(ele.querySelector(".dialog-content"));
            	_delete();
            }

            function _delete(){
                self.removeDialog();
            }

            return self;
        };

        self.removeDialog = () => {
            SPprops.widgetCount.Dialog--;
            $().toggleNoScroll();

            let d = document.querySelector(".dialog");
            if(d){
                document.body.removeChild(d);
            }

            if(SPprops.scrimCountBy.Dialog > 0){
                SPprops.scrimCountBy.Dialog--;
                self.removeScrim();
            }

            if(SPprops.blockGoingBackBy.Dialog > 0){
                SPprops.blockGoingBackBy.Dialog--;
                self.defaultBackKey();
                // self.removeOnBackKey(self.removeDialog);
            }
        };

        self.create = a => {
          if(typeof a !== undefined && typeof a === "string"){
              return document.createElement(a);
          }
          else{
              return document.createElement("div");
          }
        };

        self.createFullScreenDialog = (option = {}) => {
          SPprops.widgetCount.FSDialog++;
          SPprops.blockGoingBackBy.FSDialog++;
          self.preventBackKey();

          self.toggleNoScroll();

          // self.onBackKey(self.removeFullScreenDialog);

          let t = option.title || "";
          let bg = option.background || "#fff";
          let c = option.color || "#000";
          let b = option.button;
          let a = option.action;
          let cnt = option.content;
          
          let d = document.createElement("div");
          d.classList.add("fullscreendialog");
          d.style.zIndex = self.maxZ() + 10;

          let h = document.createElement("div");
          h.classList.add("header", "fixed", "shadow2");
          h.innerHTML = t;
          h.style = `background: ${bg}; color: ${c};`;
          
          let i = document.createElement("i");
          i.classList.add("material-icons", "left-icon");
          $(i).bindRipple();
          i.addEventListener("click",_delete);
          i.innerHTML = "close";
          h.appendChild(i);

          if (b && typeof b === "object"){
            let _t = b.text || "Button";
            let _b = b.background || bg;
            let _c = b.color || c;
            let _br = b.borderRadius || "none";
            let _s = b.boxShadow || "none";

            let btn = document.createElement("button");
            btn.classList.add("fsDialogBtn", "float-right", "btn", "shadow1");
            btn.style = `background: ${_b}; color: ${_c}; borderRadius: ${_br}; boxShadow: ${_s};`;
            btn.innerText = _t;
            btn.addEventListener("click", () => {
              _delete();
              if(a && typeof a === "function"){
                a(p);
              }
            });
            h.appendChild(btn);
          }

          d.appendChild(h);

          let p = document.createElement("div");
          p.classList.add("fsd-cnt");

          if(cnt){
              if (typeof cnt === "object"){
                  p.appendChild(cnt);
              }
              else {
                p.innerHTML = cnt;
              }    
          }

          d.appendChild(p);
          document.body.appendChild(d);

          function _delete(){
            self.removeFullScreenDialog();
          }

          return self;
        };

        self.removeFullScreenDialog = () => {
            self.toggleNoScroll();

            let d = document.querySelector(".fullscreendialog");
            // self.removeOnBackKey(self.removeFullScreenDialog);
            
            if(d && SPprops.widgetCount.FSDialog > 0){
                document.body.removeChild(d);
                SPprops.widgetCount.FSDialog--;
            }
            if(SPprops.blockGoingBackBy.FSDialog > 0){
                self.defaultBackKey();
                SPprops.blockGoingBackBy.FSDialog--;
            }
        };

        // create context menu or say just menu
        self.createContextMenu = (coords, data, options) => {
          if(SPprops.widgetCount.ContextMenu === 0){
            SPprops.widgetCount.ContextMenu++;
            SPprops.scrimCountBy.ContextMenu++;
            SPprops.blockGoingBackBy.ContextMenu++;

            self.preventBackKey();
            // self.onBackKey(self.removeContextMenu);
            self.toggleNoScroll();

            let scrimColor = "transparent";
            let color = "#000";
            let background = "#fff";
            let classNames = "";

            if(typeof options === "object"){
              scrimColor = options.scrimColor || "transparent";
              color = options.color || "#000";
              background = options.background || "#fff";
              classNames = options.class || "";
            }

            let menu = document.createElement("div");
            menu.classList.add("menu", "sp-menu");
            menu.className += classNames;

            let list = document.createElement("ul");

            if(Array.isArray(data)){
              data.forEach( el => {
                if(typeof el === "string" && el.toLowerCase() === "divider"){
                  let divider = document.createElement("div");
                  divider.classList.add("divider");
                  list.appendChild(divider);
                }
                else if (typeof el === "object"){
                  let li = document.createElement("li");
                  li.innerHTML = el.text;

                  if(typeof el.action === "function"){
                    li.addEventListener("click", () => {
                      self.removeContextMenu();
                      el.action();
                    });
                  }
                  else if(typeof el.action === "string" &&  self.isURL(el.action)){
                    let a = document.createElement("a");
                    a.href = el.action;
                    a.innerHTML = el.text;
                    li.innerHTML = "";
                    li.appendChild(a);
                  }
                  else if(typeof el.action === "string" && el.action.toLowerCase() === "disabled"){
                    li.classList.add("disabled");
                  }

                  list.appendChild(li);
                }
              });
            }

            menu.appendChild(list);
            document.body.appendChild(menu);

            let style = getComputedStyle(menu);
            let height = parseInt(style.getPropertyValue("height"));
            let width = parseInt(style.getPropertyValue("width"));

            if(typeof coords === "undefined" || (typeof coords === "string" && coords === "center")){
              menu.style.left = "50%";
              menu.style.top = "50%";
              menu.style.transform = "translate(-50%, -50%)";

              if(scrimColor === "transparent"){
                scrimColor = false;
              }
            }
            else {
              let _coords = {x: 0, y: 0};
              if(typeof coords === "object" && coords.x && coords.y){
                _coords = {x: coords.x, y: coords.y};
              }

              if(_coords.x + width > window.innerWidth){
                _coords.x -= width;
              }

              if(_coords.y + height > window.innerHeight){
                _coords.y -= height;
              }

              menu.style.left = _coords.x + "px";
              menu.style.top = _coords.y + "px";
            }

            self.createScrim(scrimColor);
            self.scrimAddListener("click", self.removeContextMenu);
            self.scrimAddListener("contextmenu", preventDefault);
          }
        };

        self.removeContextMenu = () => {
          if(SPprops.widgetCount.ContextMenu > 0){
            self.toggleNoScroll();

            SPprops.widgetCount.ContextMenu--;
            SPprops.scrimCountBy.ContextMenu--;
            SPprops.blockGoingBackBy.ContextMenu--;

            self.scrimRemoveListener("click", self.removeContextMenu);
            self.scrimRemoveListener("contextmenu", preventDefault);
            self.removeScrim();
            // self.removeOnBackKey(self.removeContextMenu);
            self.defaultBackKey();

            let m = document.querySelector(".sp-menu.menu");
            if(m && SPprops.widgetCount.ContextMenu === 0){
              document.body.removeChild(m);
            }
          }
        };

        // functions to create and remove scrim whenever you want
        self.createScrim = (color = false) => {
            SPprops.scrimCount++;
            SPprops.scrimColors.push(color);

            if(SPprops.scrimCount === 1){
                let d = document.createElement("div");
                d.classList.add("scrim", "sp-scrim");
                document.body.appendChild(d);

                if(color !== false){
                	d.style.background = color;
                }
            }
            else {
                // when there is already a scrim present
                let s = document.querySelector(".sp-scrim");
                if (s){ s.style.background = color; }
            }

            return self;
        };

        self.removeScrim = () => {
          if(SPprops.scrimCount > 0){
            SPprops.scrimCount--;
            SPprops.scrimColors.pop();
            
            let s = document.querySelector(".sp-scrim");

            if(s){
              if(SPprops.scrimCount === 0){
                  if (s){ s.parentElement.removeChild(s); }
              }
              else {
                s.style.background = SPprops.scrimColors[SPprops.scrimColors.length - 1];
              }
            }

            return self;
          }
        };

        self.isScrim = () => {
        	return !! document.querySelector(".sp-scrim");
        };

        self.scrimAddListener = (event, listener) => {
            if(SPprops.scrimCount > 0){
                document.querySelector(".sp-scrim").addEventListener(event, listener);
                SPprops.scrimListeners.push( { event, listener } );
            }
        };

        self.scrimRemoveListener = (event, listener) => {
            if(SPprops.scrimCount > 0){
                document.querySelector(".sp-scrim").removeEventListener(event, listener);

                let index = 0;
                SPprops.scrimListeners.forEach( (e, i) => {
                    if(e.event === event && e.listener === listener){
                        index = i;
                    }
                });

                SPprops.scrimListeners.splice(index, 1);
            }
        };

        // function to block back key event whenever necessary
        self.preventBackKey = () => {
            SPprops.blockCount++;

            if(SPprops.blockCount === 1){
                SPprops.blockGoingBack = true;
                history.pushState(null, document.title, location.href);
                window.addEventListener("popstate", historyListener, true);
            }

            return self;
        };

        self.defaultBackKey = () => {
            SPprops.blockCount--;

            if(SPprops.blockCount === 0){
                SPprops.blockGoingBack = false;
                window.removeEventListener("popstate", historyListener, true);
                history.go(-1);

                if(SPprops.historySteps > 0){
                  // history.go(1 - SPprops.historySteps);
                  SPprops.historySteps = 0;
                }
            }

            return self;
        };

        self.onBackKey = listener => {
          window.addEventListener("popstate", listener, true);
        };

        self.removeOnBackKey = listener => {
          window.removeEventListener("popstate", listener, true);
        };

        // event handlers
        self.click = callback => {
          if (self.sType === "e"){
            self.elements.addEventListener("click", callback);
            return self;
          }
          else if (self.sType === "s"){
            self.elements.forEach(r => {
              r.addEventListener("click", callback);
            });
            return self;
          }
          else {
            return false;
          }
        };

        self.rightclick = callback => {
          if (self.sType === "e"){
            self.elements.addEventListener("contextmenu", e => {
              e = e || window.event;
              e.preventDefault();

              callback(e);
            });

            return self;
          }
          else if (self.sType === "s"){
            self.elements.forEach(r => {
              r.addEventListener("contextmenu", e => {
                e = e || window.event;
                e.preventDefault();

                callback(e);
              });
            });
            return self;
          }
          else {
            return false;
          }
        };

        self.dblclick = (callback, timeout = 0.3) => {
          if (self.sType === "e"){
            let counts = 0;
            self.elements.addEventListener("click", () => {
              if(counts === 1){
                callback();
              }
              else {
                counts = 1;
                setTimeout(() => {counts = 0;}, timeout * 1000);
              }
            });

            return self;
          }

          else if (self.sType === "s"){
            self.elements.forEach( r => {
              let counts = 0;
              r.addEventListener("click", () => {
                if(counts === 1){
                  callback();
                }
                else {
                  counts = 1;
                  setTimeout(() => {counts = 0;}, timeout * 1000);
                }
            });
          });

            return self;
          }

          else {
            return false;
          }
        };

        self.longpress = (callback, time = 1) => {
        	let isPressed = false;

        	function handleStart(e){
            e.preventDefault();
        		isPressed = true;

        		setTimeout(() => {
        			if(isPressed){
        				callback();
        			}
        		}, time* 1000);
        	}

        	function handleEnd(e){
        		isPressed = false;
        	}

            if (self.sType === "s"){
                self.elements.forEach( r => {
                    if(__sp_eventMap.mousedown === "mousedown"){
                        r.addEventListener("mousedown",handleStart,false);
                        r.addEventListener("mouseup",handleEnd,false);
                    }
                    else {
                        r.addEventListener("touchstart",handleStart,false);
                        r.addEventListener("touchend",handleEnd,false);
                    }
                });
            }

            else if (self.sType === "e"){
                if(__sp_eventMap.mousedown === "mousedown"){
                    self.elements.addEventListener("mousedown",handleStart,false);
                    self.elements.addEventListener("mouseup",handleEnd,false);
                }
                else {
                    self.elements.addEventListener("touchstart",handleStart,false);
                    self.elements.addEventListener("touchend",handleEnd,false);
                }
            }
	        
	        return self;
        };

          self.on = self.addListener = (e, callback, options = {}) => {
            switch(e) {
                case "swipeleft":
                    self.swipe("left", callback, options);
                    break;
                case "swiperight":
                    self.swipe("right", callback, options);
                    break;
                case "swipedown":
                    self.swipe("down", callback, options);
                    break;
                case "swipeup":
                    self.swipe("up", callback, options);
                    break;
                case "swipe":
                	self.swipe("any", callback, options);
                	break;
                case "rightclick":
                    self.rightclick(callback);
                    break;
                case "dblclick":
                    self.dblclick(callback);
                    break;
                case "longpress":
                    self.longpress(callback, options);
                    break;
                default:
                    if (self.sType === "e"){
                        self.elements.addEventListener(e, callback);
                    }
                    else if (self.sType === "s"){
                        self.elements.forEach( r => {
                            r.addEventListener(e, callback);
                        });
                    }
            }

            return self;
        };

        // Remove Event Listener
        self.removeListener = (event, listener) => {
            if (self.sType === "e"){
                self.elements.removeEventListener(event, listener);
            }
            else if (self.sType === "s"){
                self.elements.forEach( r => {
                    r.removeEventListener(event, listener);
                });
            }

            return self;
        };
        
        self.swipe = (dir, callback, options) => {
            let ismousedown = false,
            xi, yi, xf, yf, x, y, direction, da1, da2, t1, t2, t, angle;

            options = options || {};

            let minLength = options.minLength || 150;
            let withSwipe = options.withSwipe;
            let onStart = options.onStart;

            function handleStart(e){
                e = e || window.event;
                ismousedown = true;
                da1 = new Date();
                t1 = da1.getTime();

                if(__sp_eventMap.mousedown === "mousedown"){
                    xi = e.clientX;
                    yi = e.clientY;
                }
                else {
                    xi = e.touches[0].clientX;
                    yi = e.touches[0].clientY;
                }
                if (typeof onStart === "function"){
                    onStart({x:xi,y:yi,time:t1});
                }

                // set final coordinates equal to initial
                xf = xi;
                yf = yi;
            }

            function handleMove(e){
                e = e || window.event;
                da2 = new Date();
                t2 = da2.getTime();

                if(ismousedown === true){
                  if(__sp_eventMap.mousedown === "mousedown"){
                    xf = e.clientX;
                    yf = e.clientY;
                  }
                  else {
                    xf = e.touches[0].clientX;
                    yf = e.touches[0].clientY;
                  }

                  if(typeof withSwipe === "function"){
                    x = xf-xi;
                    y = yf-yi;
                    angle = Math.atan2(y,x)*(180/Math.PI);
                    t = t2 - t1;
                    
                    //{initial:xi,final:xf,traveled:x},{initial:yi,final:yf,traveled:y},angle = -1*angle [it is because the origin or 0,0 is located at top left corner of screen and y is in downward],direction,t
                    withSwipe({x:{initial:xi,final:xf,traveled:x},y:{initial:yi,final:yf,traveled:y},angle:-1*angle,direction:direction,time:t});
                  }
                }
            }

            function handleEnd(e){
                e = e || window.event;
                ismousedown = false;
                da2 = new Date();
                t2 = da2.getTime();
                x = xf-xi;
                y = yf-yi;
                angle = Math.atan2(y,x)*(180/Math.PI);

                if(Math.abs(x) > minLength || Math.abs(y) > minLength){

                  if(Math.abs(x)>Math.abs(y)){
                    if(xf>xi){
                        direction="right";
                    }
                    else{
                        direction="left";
                    }
                  }

                  else{
                    if(yf>yi){
                        direction="down";
                    }
                    else{
                        direction="up";
                    }
                  }
                }

                else {
                    direction = undefined;
                }
        
                if(dir === direction || dir === "any"){
                    t = t2 - t1;
                    if (typeof callback === "function") {
                        callback({x:{initial:xi,final:xf,traveled:x},y:{initial:yi,final:yf,traveled:y},angle:-1*angle,direction:direction,time:t});
                    }
                }
            }

            if (self.sType === "s"){
                self.elements.forEach( r => {
                    if(__sp_eventMap.mousedown === "mousedown"){
                        r.addEventListener("mousedown",handleStart,false);
                        r.addEventListener("mousemove",handleMove,false);
                        r.addEventListener("mouseup",handleEnd,false);
                    }
                    else {
                        r.addEventListener("touchstart",handleStart,false);
                        r.addEventListener("touchmove",handleMove,false);
                        r.addEventListener("touchend",handleEnd,false);
                    }
                });

                return self;
            }

            else if (self.sType === "e"){
                if(__sp_eventMap.mousedown === "mousedown"){
                    self.elements.addEventListener("mousedown",handleStart,false);
                    self.elements.addEventListener("mousemove",handleMove,false);
                    self.elements.addEventListener("mouseup",handleEnd,false);
                }
                else {
                    self.elements.addEventListener("touchstart",handleStart,false);
                    self.elements.addEventListener("touchmove",handleMove,false);
                    self.elements.addEventListener("touchend",handleEnd,false);
                }

                return self;
            }

            else {
              return false;
            }
        };

        self.withSwipe = (change, callback, target) => {
            let t = (typeof target === "undefined") ? self.selector : target;
            let c = change;
            let _l = $(t).offset()[0][c];
            let l,xy;

            switch(c){
                case "left":
                    l = parseInt($(t).left());
                    xy = "x";
                    break;
                case "top":
                    l = parseInt($(t).top());
                    xy = "y";
                    break;
                case "right":
                    l = parseInt($(t).right());
                    xy = "x";
                    break;
                case "bottom":
                    l = parseInt($(t).bottom());
                    xy = "y";
                    break;
            }

            $(self.selector).swipe("any", result => {
                return false;
            }, {
                "withSwipe": r => {
                    callback(r);
                    $(t).css({c: _l + r[xy].traveled + "px"});
                },
                "onStart": r => {
                    switch(c){
                        case "left":
                            if (_l !== parseInt($(t).left())){
                            _l = parseInt($(t).left());
                            }
                            break;
                        case "top":
                            if (_l !== parseInt($(t).top())){
                            _l = parseInt($(t).top());
                            }
                            break;
                        case "right":
                            if (_l !== parseInt($(t).right())){
                            _l = parseInt($(t).right());
                            }
                            break;
                        case "bottom":
                            if (_l !== parseInt($(t).bottom())){
                            _l = parseInt($(t).bottom());
                            }
                            break;
                    }

                    $(t).css({c: _l + "px"});
                }
            });
        };

        /*End of swipe*/
        // sp ripple binding methods
        self.bindRipple = () => {
          if (self.sType === "s"){
            Array.prototype.forEach.call(self.elements, r => {
                r.addEventListener("click",_sp_rippleIt);
            });
          }

          else if (self.sType === "e"){
              self.elements.addEventListener("click",_sp_rippleIt);
          }

          return self;
        };

        self.bindDarkRipple = () => {
          if (self.sType === "s"){
            Array.prototype.forEach.call(self.elements, r => {
                r.addEventListener("click",_sp_rippleIt_dark);
            });
          }

          else if (self.sType === "e"){
              self.elements.addEventListener("click",_sp_rippleIt_dark);
          }

          return self;
        };

        self.bindAutoRipple = () => {
          if (self.sType === "s"){
            Array.prototype.forEach.call(self.elements, r => {
                r.addEventListener("click",_sp_rippleIt_auto);
            });
          }

          else if (self.sType === "e"){
            self.elements.addEventListener("click",_sp_rippleIt_auto);
          }

          return self;
        };

        // sp bind a method or a function to selector
        self.bind = (event, listener) => {
            if (self.sType === "s"){
              self.elements.forEach( r => {
                  r.addEventListener(event, listener);
              });
            }

            if (self.sType === "e"){
              self.elements.addEventListener(event, listener);
            }

            return self;
        };

        // innerhtml and innertext method
        self.html = a => {
            if (typeof a !== "undefined"){ 
                if(typeof a === "string" || typeof a === "number"){
                    if (self.sType === "s"){
                        self.elements.forEach( r => {
                            r.innerHTML = a;
                        });
                    }

                    else if (self.sType === "e"){
                        self.elements.innerHTML = a;
                    }
                }

                return self;
            }

            else {
                if (self.sType === "s"){
                    if (self.eleLength === 1){
                          return String(self.elements.forEach( r => {return r.innerHTML;} ) );
                    }
                    else {
                        let arr = [];
                        self.elements.forEach( r => {
                            arr.push(r.innerHTML);
                        });

                        return arr;
                    }
                }

                else if (self.sType === "e"){
                    return self.elements.innerHTML;
                }
            }
        };

        self.text = a => {
            if (typeof a !== "undefined"){
                if(typeof a === "string" || typeof a === "number"){
                    if (self.sType === "s"){
                        self.elements.forEach( r => {
                            r.innerText = a;
                        });
                    }

                    else if (self.sType === "e"){
                        self.elements.innerText = a;
                    }
                }

                return self;
            }

            else {
                if (self.sType === "s"){
                  if (self.eleLength === 1){
                    return String(self.elements.forEach( r => {return r.innerText;} ) );
                  }
                  else {
                    let arr = [];
                    self.elements.forEach( (r) => {
                        arr.push(r.innerText);
                    });

                    return arr;
                  }
                }

                else if (self.sType === "e"){
                    return self.elements.innerText;
                }
            }
        };

        self.appendHTML = a => {
            if(typeof a === "string" || typeof a === "number"){
              if (self.sType === "s"){
                self.elements.forEach( r => {
                  r.innerHTML += a;
                });
              }
              else if (self.sType === "e"){
                self.elements.innerHTML += a;
              }
            }

            return self;
        };

        self.appendText = a => {
            if(typeof a === "string" || typeof a === "number"){
              if (self.sType === "s"){
                self.elements.forEach( r => {
                  r.innerText += a;
                });
              }
              else if (self.sType === "e"){
                self.elements.innerText += a;
              }
            }

            return self;
        };

        self.prependHTML = a => {
            if(typeof a === "string" || typeof a === "number"){
              if (self.sType === "s"){
                self.elements.forEach( r => {
                    r.innerHTML = a + r.innerHTML;
                });
              }

              else if (self.sType === "e"){
                self.elements.innerHTML = a + self.elements.innerHTML;
              }
            }
            return self;
        };

        self.prependText = a => {
            if(typeof a === "string" || typeof a === "number"){
              if (self.sType === "s"){
                self.elements.forEach( r => {
                    r.innerText = a + r.innerText;
                });
              }
              else if (self.sType === "e"){
                self.elements.innerText = a + self.elements.innerText;
              }
            }
            
            return self;
        };

        // Returns offsets
        self.offset = ask => {
            let __sp__to_returnArray = [];

            if (self.sType === "s"){
                self.elements.forEach( r => {
                    let rect = r.getBoundingClientRect(),
                    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                    let objectis = {top: rect.top + scrollTop, left: rect.left + scrollLeft, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height};
                    
                    if(typeof ask === "undefined"){
                        __sp__to_returnArray.push(objectis);
                    }
                    
                    else {
                        __sp__to_returnArray.push(objectis[ask]);
                    }
                });

                return __sp__to_returnArray;
            }

            else if (self.sType === "e"){
                let rect = self.elements.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                let objectis = {top: rect.top + scrollTop, left: rect.left + scrollLeft, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height};
                
                if(typeof ask === "undefined"){
                    return objectis;
                }
                
                else {
                    return objectis[ask];
                }
            }

            else {
                return false;
            }
        };

        /*class methods*/
        self.toggleClass = cls => {
          if (self.sType === "s"){
            self.elements.forEach( r => {
                r.classList.toggle(cls);
            });

            return self;
          }

          else if (self.sType === "e"){
            self.elements.classList.toggle(cls);
            
            return self;
          }

          else {
            return false;
          }
        };

        self.addClass = cls => {
          if (self.sType === "s"){
            self.elements.forEach( r => {
              r.className += cls;
            });
            
            return self;
          }

          else if (self.sType === "e"){
            self.elements.className += cls;
            
            return self;
          }

          else {
            return false;
          }
        };

        self.removeClass = cls => {
          if (self.sType === "s"){
            self.elements.forEach( r => {
              let clsnames = cls.split(" ");
              r.classList.remove(...clsnames);
            });
            
            return self;
          }

          else if (self.sType === "e"){
            let clsnames = cls.split(" ");
            self.elements.classList.remove(...clsnames);
            
            return self;
          }

          else {
            return false;
          }
        };

        self.replaceClass = (a, b) => {
            self.addClass(b);
            self.removeClass(a);
        };

        self.hasClass = cls => {
          if (self.sType === "s"){
            let _count = 0;

            self.elements.forEach( r => {
      				let clsnames = cls.split(" ");
      				let count = 0;
      				
      				clsnames.forEach((x) => {
      					if(r.classList.contains(x)){ count++; }
              });
      				
      				if (count === clsnames.length){ _count++; }
            });

            if (_count === self.elements.length){ return true; }
            else { return false; }
          }

    			else if (self.sType === "e"){
    				if (cls.indexOf(" ") > -1){
    				    let clsnames = cls.split(" ");
    				    let count = 0;
    				    for(let x = 0; x < clsnames.length; x++){
    				    	if(self.elements.classList.contains(clsnames[x])){ count++; }
    				    }
    				    if (count === clsnames.length){ return true; }
    				    else { return false; }
    				}
    				else {
    			    	return self.elements.classList.contains(cls);
    				}
    			}
        };

        self.attr = (a, b) => {
          if (typeof b !== "undefined"){
            if (self.sType === "s"){
              self.elements.forEach( r => {
                  r.setAttribute(a,b);
              });

              return self;
            }

            else if (self.sType === "e"){
              self.elements.setAttribute(a,b);

              return self;
            }

            else {
              return false;
            }
          }

          else {
            if (self.sType === "s"){
              let arr = [];

              self.elements.forEach( r => {
                  arr.push(r.getAttribute(a));
              });

              return arr;
            }

            else if (self.sType === "e"){
              return self.elements.getAttribute(a);
            }

            else {
              return false;
            }
          }
        };

        self.removeAttr = a => {
          if (self.sType === "s"){
            	self.elements.forEach( r => {
                	r.removeAttribute(a);
            	});

            	return self;
            }

            else if (self.sType === "e"){
            	self.elements.removeAttribute(a);
              
            	return self;
            }

            else {
            	return false;
            }
        };

        self.val = () => {
              if (self.sType === "s"){
                let _v = [];
                self.elements.forEach( r => {
                  _v.push(r.value());
                });

                return _v;
              }

            else if (self.sType === "e"){
                return self.elements.value();
            }

            else {
                return false;
            }
        };

        self.toggleNoScroll = () => {
          document.body.classList.toggle("noscroll");
        };

        // function to generate random text
        self.getRandomString = (length = 5, type = "default") => {
            let text = "";
            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            switch (type) {
                case "caps":
                    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    break;
                case "smalls":
                    possible = "abcdefghijklmnopqrstuvwxyz";
                    break;
                case "both":
                    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                    break;
                case "numbers":
                    possible = "0123456789";
                    break;
                case "secretKey":
                    possible = possible+"!@$%^&*.";
                    break;
            }

            for (let i = 0; i < length; i++){
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        };

        // just connecton to console.log
        self.l = self.log = console.log;

        self.isURL = str => {
        	if(str){
	            let pattern = new RegExp("^(https?:\\/\\/)?"+"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|"+"((\\d{1,3}\\.){3}\\d{1,3}))"+"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*"+"(\\?[;&a-z\\d%_.~+=-]*)?"+"(\\#[-a-z\\d_]*)?$","i");
	            return pattern.test(str);	
        	}
        	else {
        		return false;
        	}
        };

        self.getcss = prop => {
            let style, val;
            if (self.sType === "s"){
                val = [];
                self.elements.forEach( r => {
                    style = window.getComputedStyle(r);
                    val.push(style.getPropertyValue(prop));
                });
            
                return val;
            }
            else if (self.sType === "e"){
                style = window.getComputedStyle(self.elements);
                val = style.getPropertyValue(prop);
            
                return val;
            }
            else {
                return false;
            }
        };

        self.scrollHeight = () => {
            if (self.sType === "s"){
                self.elements.forEach( r => {
                    return r.scrollHeight;
                });
            }
            else if (self.sType === "e"){
                return self.elements.scrollHeight;
            }
            else {return false;}
        };

        self.scrollWidth = () => {
            if (self.sType === "s"){
                self.elements.forEach( r => {
                    return r.scrollWidth;
                });
            }
            else if (self.sType === "e"){
                return self.elements.scrollWidth;
            }
            else {return false;}
        };

        self.fullscreen = () => {
            if(self.sType !== "d"){
                let r = document.querySelector(self.selector);
                if(r.requestFullscreen) {
                  r.requestFullscreen();
                } else if(r.mozRequestFullScreen) {
                  r.mozRequestFullScreen();
                } else if(r.webkitRequestFullscreen) {
                  r.webkitRequestFullscreen();
                } else if(r.msRequestFullscreen) {
                  r.msRequestFullscreen();
                }
            }
            else {
                if(document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen();
                } else if(document.documentElement.mozRequestFullScreen) {
                  document.documentElement.mozRequestFullScreen();
                } else if(document.documentElement.webkitRequestFullscreen) {
                  document.documentElement.webkitRequestFullscreen();
                } else if(document.documentElement.msRequestFullscreen) {
                  document.documentElement.msRequestFullscreen();
                }
            }
            return self;
        };

        self.exitfullscreen = () => {
            if(document.exitFullscreen) {
                document.exitFullscreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }

            return self;
        };

        self.width = w => {
            if(typeof w === "undefined"){
                return self.getcss("width");
            }
            else {
                self.css({"width": w});
                return self;
            }
        };

        self.height = w => {
            if(typeof w === "undefined"){
                return self.getcss("height");
            }
            else {
                self.css({"height": w});
                return self;
            }
        };

        self.position = w => {
            if(typeof w === "undefined"){
                return self.getcss("position");
            }
            else {
                self.css({"position": w});
                return self;
            }
        };

        self.background = w => {
            if(typeof w === "undefined"){
                return self.getcss("background");
            }
            else {
                self.css({"background": w});
                return self;
            }
        };

        self.color = w => {
            if(typeof w === "undefined"){
                return self.getcss("color");
            }
            else {
                self.css({"color": w});
                return self;
            }
        };

        self.left = x => {
            if(typeof x === "undefined"){
                return self.getcss("left");
            }
            else {
                self.css({"left": x + "px"});
                return self;
            }
        };

        self.top = y => {
            if(typeof y === "undefined"){
                return self.getcss("top");
            }
            else {
                self.css({"top": y + "px"});
                return self;
            }
        };

        self.right = x => {
            if(typeof x === "undefined"){
                return self.getcss("right");
            }
            else {
                self.css({"right": x + "px"});
                return self;
            }
        };

        self.bottom = y => {
            if(typeof y === "undefined"){
                return self.getcss("bottom");
            }
            else {
                self.css({"bottom": y + "px"});
                return self;
            }
        };

        self.display = w => {
            if(typeof w === "undefined"){
                return self.getcss("display");
            }
            else {
                self.css({"display": w});
                return self;
            }
        };

        self.vibrate = (t = [200, 30, 200]) => {
            if (typeof window.navigator.vibrate === "function"){
                window.navigator.vibrate(t);
                return self;
            }
            else {
                return false;
            }
        };

        /*child methods*/
        self.addChild = e => {
            if (self.sType === "s"){
                self.elements.forEach( r => {r.appendChild(e);});
                return self;
            }
            else if (self.sType === "e"){
                self.elements.appendChild(e);
                return self;
            }
            else {return false;}
        };

        self.removeChild = e => {
            if (self.sType === "s"){
                self.elements.forEach( r => {r.removeChild(e);});
                return self;
            }
            else if (self.sType === "e"){
                self.elements.removeChild(e);
                return self;
            }
            else {return false;}
        };

        self.toggleChild = e => {
            if (self.sType === "s"){
              self.elements.forEach( r => {
                if(r.contains(e)){
                  r.removeChild(e);
                }
                else {
                  r.addChild(e);
                }
              });
              return self;
            }
            else if (self.sType === "e"){
                if(self.elements.contains(e)){
                  self.elements.removeChild(e);
                }
                else {
                  self.elements.addChild(e);
                }
              return self;
            }
            else {return false;}
        };

        self.materialNav = () => {
            // this bool tells whether to make scrim or not
            if(document.querySelector(".material-nav")){
                if (SPprops.MaterialNav === false){
                  $(".material-nav").left(0);

                  SPprops.scrimCountBy.MaterialNav++;
                  SPprops.blockGoingBackBy.MaterialNav++;
                  self.createScrim();
                  self.preventBackKey();

                  self.scrimAddListener("click", self.materialNav);
                  // self.onBackKey(self.materialNav);

                  SPprops.MaterialNav = true;
                }
                else {
                    $(".material-nav").left(-290);

                    SPprops.scrimCountBy.MaterialNav--;
                    SPprops.blockGoingBackBy.MaterialNav--;

                    self.scrimRemoveListener("click", self.materialNav);
                    // self.removeOnBackKey(self.materialNav);

                    self.removeScrim();
                    self.defaultBackKey();

                    SPprops.MaterialNav = false;
                }

                return self;
            }
            else {
                return false;
            }
        };

        self.getSPprops = () => {return SPprops;};
      /*a few other basic utilities*/
        /*colors*/
        self.colors = {
            material: {
            "red": {
              "50": "#ffebee",
              "100": "#ffcdd2",
              "200": "#ef9a9a",
              "300": "#e57373",
              "400": "#ef5350",
              "500": "#f44336",
              "600": "#e53935",
              "700": "#d32f2f",
              "800": "#c62828",
              "900": "#b71c1c",
              "a100": "#ff8a80",
              "a200": "#ff5252",
              "a400": "#ff1744",
              "a700": "#d50000"
            },
            "pink": {
              "50": "#fce4ec",
              "100": "#f8bbd0",
              "200": "#f48fb1",
              "300": "#f06292",
              "400": "#ec407a",
              "500": "#e91e63",
              "600": "#d81b60",
              "700": "#c2185b",
              "800": "#ad1457",
              "900": "#880e4f",
              "a100": "#ff80ab",
              "a200": "#ff4081",
              "a400": "#f50057",
              "a700": "#c51162"
            },
            "purple": {
              "50": "#f3e5f5",
              "100": "#e1bee7",
              "200": "#ce93d8",
              "300": "#ba68c8",
              "400": "#ab47bc",
              "500": "#9c27b0",
              "600": "#8e24aa",
              "700": "#7b1fa2",
              "800": "#6a1b9a",
              "900": "#4a148c",
              "a100": "#ea80fc",
              "a200": "#e040fb",
              "a400": "#d500f9",
              "a700": "#aa00ff"
            },
            "deeppurple": {
              "50": "#ede7f6",
              "100": "#d1c4e9",
              "200": "#b39ddb",
              "300": "#9575cd",
              "400": "#7e57c2",
              "500": "#673ab7",
              "600": "#5e35b1",
              "700": "#512da8",
              "800": "#4527a0",
              "900": "#311b92",
              "a100": "#b388ff",
              "a200": "#7c4dff",
              "a400": "#651fff",
              "a700": "#6200ea"
            },
            "indigo": {
              "50": "#e8eaf6",
              "100": "#c5cae9",
              "200": "#9fa8da",
              "300": "#7986cb",
              "400": "#5c6bc0",
              "500": "#3f51b5",
              "600": "#3949ab",
              "700": "#303f9f",
              "800": "#283593",
              "900": "#1a237e",
              "a100": "#8c9eff",
              "a200": "#536dfe",
              "a400": "#3d5afe",
              "a700": "#304ffe"
            },
            "blue": {
              "50": "#e3f2fd",
              "100": "#bbdefb",
              "200": "#90caf9",
              "300": "#64b5f6",
              "400": "#42a5f5",
              "500": "#2196f3",
              "600": "#1e88e5",
              "700": "#1976d2",
              "800": "#1565c0",
              "900": "#0d47a1",
              "a100": "#82b1ff",
              "a200": "#448aff",
              "a400": "#2979ff",
              "a700": "#2962ff"
            },
            "lightblue": {
              "50": "#e1f5fe",
              "100": "#b3e5fc",
              "200": "#81d4fa",
              "300": "#4fc3f7",
              "400": "#29b6f6",
              "500": "#03a9f4",
              "600": "#039be5",
              "700": "#0288d1",
              "800": "#0277bd",
              "900": "#01579b",
              "a100": "#80d8ff",
              "a200": "#40c4ff",
              "a400": "#00b0ff",
              "a700": "#0091ea"
            },
            "cyan": {
              "50": "#e0f7fa",
              "100": "#b2ebf2",
              "200": "#80deea",
              "300": "#4dd0e1",
              "400": "#26c6da",
              "500": "#00bcd4",
              "600": "#00acc1",
              "700": "#0097a7",
              "800": "#00838f",
              "900": "#006064",
              "a100": "#84ffff",
              "a200": "#18ffff",
              "a400": "#00e5ff",
              "a700": "#00b8d4"
            },
            "teal": {
              "50": "#e0f2f1",
              "100": "#b2dfdb",
              "200": "#80cbc4",
              "300": "#4db6ac",
              "400": "#26a69a",
              "500": "#009688",
              "600": "#00897b",
              "700": "#00796b",
              "800": "#00695c",
              "900": "#004d40",
              "a100": "#a7ffeb",
              "a200": "#64ffda",
              "a400": "#1de9b6",
              "a700": "#00bfa5"
            },
            "green": {
              "50": "#e8f5e9",
              "100": "#c8e6c9",
              "200": "#a5d6a7",
              "300": "#81c784",
              "400": "#66bb6a",
              "500": "#4caf50",
              "600": "#43a047",
              "700": "#388e3c",
              "800": "#2e7d32",
              "900": "#1b5e20",
              "a100": "#b9f6ca",
              "a200": "#69f0ae",
              "a400": "#00e676",
              "a700": "#00c853"
            },
            "lightgreen": {
              "50": "#f1f8e9",
              "100": "#dcedc8",
              "200": "#c5e1a5",
              "300": "#aed581",
              "400": "#9ccc65",
              "500": "#8bc34a",
              "600": "#7cb342",
              "700": "#689f38",
              "800": "#558b2f",
              "900": "#33691e",
              "a100": "#ccff90",
              "a200": "#b2ff59",
              "a400": "#76ff03",
              "a700": "#64dd17"
            },
            "lime": {
              "50": "#f9fbe7",
              "100": "#f0f4c3",
              "200": "#e6ee9c",
              "300": "#dce775",
              "400": "#d4e157",
              "500": "#cddc39",
              "600": "#c0ca33",
              "700": "#afb42b",
              "800": "#9e9d24",
              "900": "#827717",
              "a100": "#f4ff81",
              "a200": "#eeff41",
              "a400": "#c6ff00",
              "a700": "#aeea00"
            },
            "yellow": {
              "50": "#fffde7",
              "100": "#fff9c4",
              "200": "#fff59d",
              "300": "#fff176",
              "400": "#ffee58",
              "500": "#ffeb3b",
              "600": "#fdd835",
              "700": "#fbc02d",
              "800": "#f9a825",
              "900": "#f57f17",
              "a100": "#ffff8d",
              "a200": "#ffff00",
              "a400": "#ffea00",
              "a700": "#ffd600"
            },
            "amber": {
              "50": "#fff8e1",
              "100": "#ffecb3",
              "200": "#ffe082",
              "300": "#ffd54f",
              "400": "#ffca28",
              "500": "#ffc107",
              "600": "#ffb300",
              "700": "#ffa000",
              "800": "#ff8f00",
              "900": "#ff6f00",
              "a100": "#ffe57f",
              "a200": "#ffd740",
              "a400": "#ffc400",
              "a700": "#ffab00"
            },
            "orange": {
              "50": "#fff3e0",
              "100": "#ffe0b2",
              "200": "#ffcc80",
              "300": "#ffb74d",
              "400": "#ffa726",
              "500": "#ff9800",
              "600": "#fb8c00",
              "700": "#f57c00",
              "800": "#ef6c00",
              "900": "#e65100",
              "a100": "#ffd180",
              "a200": "#ffab40",
              "a400": "#ff9100",
              "a700": "#ff6d00"
            },
            "deeporange": {
              "50": "#fbe9e7",
              "100": "#ffccbc",
              "200": "#ffab91",
              "300": "#ff8a65",
              "400": "#ff7043",
              "500": "#ff5722",
              "600": "#f4511e",
              "700": "#e64a19",
              "800": "#d84315",
              "900": "#bf360c",
              "a100": "#ff9e80",
              "a200": "#ff6e40",
              "a400": "#ff3d00",
              "a700": "#dd2c00"
            },
            "brown": {
              "50": "#efebe9",
              "100": "#d7ccc8",
              "200": "#bcaaa4",
              "300": "#a1887f",
              "400": "#8d6e63",
              "500": "#795548",
              "600": "#6d4c41",
              "700": "#5d4037",
              "800": "#4e342e",
              "900": "#3e2723"
            },
            "grey": {
              "50": "#fafafa",
              "100": "#f5f5f5",
              "200": "#eeeeee",
              "300": "#e0e0e0",
              "400": "#bdbdbd",
              "500": "#9e9e9e",
              "600": "#757575",
              "700": "#616161",
              "800": "#424242",
              "900": "#212121"
            },
            "bluegrey": {
              "50": "#eceff1",
              "100": "#cfd8dc",
              "200": "#b0bec5",
              "300": "#90a4ae",
              "400": "#78909c",
              "500": "#607d8b",
              "600": "#546e7a",
              "700": "#455a64",
              "800": "#37474f",
              "900": "#263238"
            }
            },
            aliceblue: "#f0f8ff",
            antiquewhite: "#faebd7",
            aqua: "#00ffff",
            aquamarine: "#7fffd4",
            azure: "#f0ffff",
            beige: "#f5f5dc",
            bisque: "#ffe4c4",
            black: "#000000",
            blanchedalmond: "#ffebcd",
            blue: "#0000ff",
            blueviolet: "#8a2be2",
            brown: "#a52a2a",
            burlywood: "#deb887",
            cadetblue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            cornflowerblue: "#6495ed",
            cornsilk: "#fff8dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkblue: "#00008b",
            darkcyan: "#008b8b",
            darkgoldenrod: "#b8860b",
            darkgray: "#a9a9a9",
            darkgreen: "#006400",
            darkkhaki: "#bdb76b",
            darkmagenta: "#8b008b",
            darkolivegreen: "#556b2f",
            darkorange: "#ff8c00",
            darkorchid: "#9932cc",
            darkred: "#8b0000",
            darksalmon: "#e9967a",
            darkseagreen: "#8fbc8f",
            darkslateblue: "#483d8b",
            darkslategray: "#2f4f4f",
            darkturquoise: "#00ced1",
            darkviolet: "#9400d3",
            deeppink: "#ff1493",
            deepskyblue: "#00bfff",
            dimgray: "#696969",
            dodgerblue: "#1e90ff",
            feldspar: "#d19275",
            firebrick: "#b22222",
            floralwhite: "#fffaf0",
            forestgreen: "#228b22",
            fuchsia: "#ff00ff",
            gainsboro: "#dcdcdc",
            ghostwhite: "#f8f8ff",
            gold: "#ffd700",
            goldenrod: "*daa520",
            gray: "#808080",
            green: "#008000",
            greenyellow: "#adff2f",
            honeydew: "#f0fff0",
            hotpink: "#ff69b4",
            indianred : "#cd5c5c",
            indigo : "#4b0082",
            ivory: "#fffff0",
            khaki: "#f0e68c",
            lavender: "#e6e6fa",
            lavenderblush: "#fff0f5",
            lawngreen: "#7cfc00",
            lemonchiffon: "#fffacd",
            lightblue: "#add8e6",
            lightcoral: "#f08080",
            lightcyan: "#e0ffff",
            lightgoldenrodyellow: "#fafad2",
            lightgrey: "#d3d3d3",
            lightgreen: "*90ee90",
            lightpink: "#ffb6c1",
            lightsalmon: "#ffa07a",
            lightseagreen: "#20b2aa",
            lightskyblue: "#87cefa",
            lightslateblue: "#8470ff",
            lightslategray: "#778899",
            lightsteelblue: "#b0c4de",
            lightyellow: "#ffffe0",
            lime: "#00ff00",
            limegreen: "#32cd32",
            linen: "#faf0e6",
            magenta: "#ff00ff",
            maroon: "#800000",
            mediumaquamarine: "#66cdaa",
            mediumblue: "#0000cd",
            mediumorchid: "#ba55d3",
            mediumpurple: "#9370d8",
            mediumseagreen: "#3cb371",
            mediumslateblue: "#7b68ee",
            mediumspringgreen: "#00fa9a",
            mediumturquoise: "#48d1cc",
            mediumvioletred: "#c71585",
            midnightblue: "#191970",
            mintcream: "#f5fffa",
            mistyrose: "#ffe4e1",
            moccasin: "#ffe4b5",
            navajowhite: "#ffdead",
            navy: "#000080",
            oldlace: "#fdf5e6",
            olive: "#808000",
            olivedrab: "#6b8e23",
            orange: "#ffa500",
            orangered: "#ff4500",
            orchid: "#da70d6",
            palegoldenrod: "#eee8aa",
            palegreen: "#98fb98",
            paleturquoise: "#afeeee",
            palevioletred: "#d87093",
            papayawhip: "#ffefd5",
            peachpuff: "ffdab9",
            peru: "#cd853f",
            pink: "#ffc0cb",
            plum: "#dda0dd",
            powderblue: "#b0e0e6",
            purple: "#800080",
            red: "#ff0000",
            rosybrown: "#bc8f8f",
            royalblue: "#4169e1",
            saddlebrown: "#8b4513",
            salmon: "#fa8072",
            sandybrown: "#f4a460",
            seagreen: "#2e8b57",
            seashell: "#fff5ee",
            sienna: "#a0522d",
            silver: "#c0c0c0",
            skyblue: "#87ceeb",
            slateblue: "#6a5acd",
            slategray: "#708090",
            snow: "#fffafa",
            springgreen: "#00ff7f",
            steelblue: "#4682b4",
            tan: "#d2b48c",
            teal: "#008080",
            thistle: "#d8bfd8",
            tomato: "#ff6347",
            turquoise: "#40e0d0",
            violet: "#ee82ee",
            violetred: "#d02090",
            wheat: "#f5deb3",
            white: "#ffffff",
            whitesmoke: "#f5f5f5",
            yellow: "#ffff00",
            yellowgreen: "#9acd32"
        };
        /*end of colors*/
        /*CSS*/

        self.css = o => {
            if(typeof o === "object"){
                if (self.sType === "s"){
                    self.elements.forEach( r => {
                        for(let prop in o){
                            let p = prop.replace(/-([a-z])/g, (m, w) => {
                                return w.toUpperCase();
                            });

                            if(o.hasOwnProperty(prop)){
                                r.style[p] = o[prop];
                            }
                        }
                    });

                    return self;
                }
                else if (self.sType === "e"){
                    for(let prop in o){
                        let p = prop.replace(/-([a-z])/g, (m, w) => {
                            return w.toUpperCase();
                        });

                        if(o.hasOwnProperty(prop)){
                            self.elements.style[p] = o[prop];
                        }
                    }

                    return self;
                }

                else {
                    return false;
                }
            }
            else {
                return false;
            }
        };
        /*End of CSS*/
        self.rgbToHex = rgb => {
          rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
          
          return (rgb && rgb.length === 4) ? "#" +
          ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : "";
        };

        /*lighten darken color*/
        self.ld = (col, amt) => {
            let color = col;
            let usePound = false;

            if(color[0] === "r"){
                color = self.rgbToHex(color);
            }

            if (color[0] === "#") {
                color = color.slice(1);
                usePound = true;
            }

            let num = parseInt(color,16);

            let r = (num >> 16) + amt;

            if (r > 255){ r = 255; }
            else if (r < 0){ r = 0; }

            let b = ((num >> 8) & 0x00FF) + amt;

            if (b > 255){ b = 255; }
            else if (b < 0){ b = 0; }

            let g = (num & 0x0000FF) + amt;

            if (g > 255){ g = 255;}
            else if (g < 0){ g = 0;}

            return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
        };

        self.get = () => {return self.elements;};

        return self;
    };

    window.SP = window.$ = SP;

    // Event handlers for stuff and blah blah
    window.addEventListener("DOMContentLoaded", () => {
      _sp_init();
      // Begin Fetching Data
      let _toLoad = document.querySelectorAll("[data-load]");
      Array.prototype.forEach.call(_toLoad, r => {
        fetch(r.getAttribute("data-load")).then( a => {return a.text();}).then( b => {r.innerHTML = b;});
      });

      // Bind Ripple event listeners
      let _toRipple = document.getElementsByClassName("ripple");
      let _toRipple_dark = document.getElementsByClassName("ripple-dark");
      let _toRipple_auto = document.getElementsByClassName("ripple-auto");
      
      Array.prototype.forEach.call(_toRipple, r => {
          r.addEventListener("click",_sp_rippleIt);
      });
      
      Array.prototype.forEach.call(_toRipple_dark, r => {
          r.addEventListener("click",_sp_rippleIt_dark);
      });
      
      Array.prototype.forEach.call(_toRipple_auto, r => {
          r.addEventListener("click",_sp_rippleIt_auto);
      });

      if(document.querySelector(".material-nav.autoopen") === null || window.innerWidth < 840){
          let _material_nav_opener_ = document.getElementsByClassName("material-nav_opener");
          
          Array.prototype.forEach.call(_material_nav_opener_, r => {
              r.addEventListener("click", () => {$().materialNav();});
          });
      }

      Array.prototype.forEach.call(document.querySelectorAll(".fab"), f => {
          let fc = f.querySelector(".fab-content");
          let fb = f.querySelector(".fab-btn");
          
          if (fc && fb){
            if (fb.classList.contains("fab-center")){
              fc.classList.add("center");
            }
            else if (fb.classList.contains("fab-top-left")){
              fc.classList.add("sp-fab-content-top-left");
            }
            else {
              fc.classList.add("sp-fab-content-default");
            }
          }
      });



    });

    window.addEventListener("load", () => {
      // Material Nav Bind Swipe Events
      let mnav = document.querySelector(".material-nav");

      if (mnav){
          let shallOpenNav = false;

          $(".material-nav").swipe("any", r => {
              if(Math.abs(r.x.traveled) > 50 && r.direction === "left" && r.time <= 1000){
                mnav.style.left = "-290px";

                SPprops.scrimCountBy.MaterialNav--;
                SPprops.blockGoingBackBy.MaterialNav--;

                $().scrimRemoveListener("click", $().materialNav);
                // $().removeOnBackKey($().materialNav);

                $().removeScrim();
                $().defaultBackKey();

                SPprops.MaterialNav = false;
              }
              else {
                mnav.style.left = "0px";
                document.querySelector(".sp-scrim").style.opacity = 1;
              }
          },{minLength: 1,
              withSwipe: r => {
                let t = r.x.traveled;

                mnav.style.left = parseInt($(mnav).left()) +  t + "px";

                let p = Math.floor(((290 - Math.abs(t))/290) * 100) / 100;
                document.querySelector(".sp-scrim").style.opacity = p;
              }
          });

          $("html").swipe("right", r => {
              if(r.x.initial <= 20 && r.x.traveled >= 15 && shallOpenNav === true && parseInt($(mnav).left()) !== 0 && r.direction === "right"){
                  mnav.style.left = "0px";
                  
                  SPprops.blockGoingBackBy.MaterialNav++;
                  $().preventBackKey();
                  // $().onBackKey($().materialNav);
                  
                  if(SPprops.scrimCount === 1){
                    document.querySelector(".sp-scrim").style.opacity = 1;
                  }
              }
              else {
                  if(r.x.initial <= 20){
                    mnav.style.left = "-290px";

                    $().scrimRemoveListener("click", $().materialNav);
                    $().removeScrim();
                    SPprops.scrimCountBy.MaterialNav--;
                  }
              }

              shallOpenNav = false;
          },{ minLength: 1,
              onStart: r => {
                  if(r.x <= 20 && parseInt($(".material-nav").left()) === -290){
                      shallOpenNav = true;

                      SPprops.MaterialNav = true;
                      SPprops.scrimCountBy.MaterialNav++;

                      $().createScrim();
                      $().scrimAddListener("click", $().materialNav);
                      
                      if(SPprops.scrimCount === 1){
                        document.querySelector(".sp-scrim").style.opacity = 0;
                      }
                  }
              },
              withSwipe: r => {
                  let t = r.x.traveled;
                  
                  if (r.x.initial <= 20 && t < 290 && shallOpenNav === true){
                      mnav.style.left = -290 + t +"px";

                      if(SPprops.scrimCount === 1){
                        let p = Math.floor(((Math.abs(t))/290) * 100) / 100;
                        document.querySelector(".sp-scrim").style.opacity = p;
                      }
                  }
              }
          });
      }
    });
}));
// end of sp declaration
// beginning of initiation function
function _sp_init(){
    let ct = document.querySelector(".container");
    let header = document.querySelector(".header");

    // If Header exists, give a top gap to page element
    if (header && !header.classList.contains("bottom")){
      let pageEle = document.querySelector(".page");
      if (pageEle){
          pageEle.style.position = "relative";
          pageEle.style.top = window.getComputedStyle(header).getPropertyValue("height");
      }
    }

    // If auto-open nav is present thenk hide the nav opener element
    if(document.querySelector(".material-nav.autoopen")!== null && window.innerWidth >= 840){        
      Array.prototype.forEach.call(document.getElementsByClassName("material-nav_opener"), r => {
          r.style.display = "none";
      });
      
      header.style.marginLeft = ct.style.marginLeft = "270px";
      header.style.width = ct.style.width = "calc(100% - 270px)";
      header.style.paddingLeft = "24px";
    }

    // Control Fab elements
    if(document.querySelector(".fab-btn")){
      $(".fab-btn").click(() => {
          if(document.querySelector(".fab-btn ~ .fab-content")){
            $(".fab-btn ~ .fab-content").toggle("active");
          }
      });
    }

    // Control Accordian Elements;
    Array.prototype.forEach.call(document.getElementsByClassName("collapse-btn"), c => {
        c.addEventListener("click", () => {
          let icon = this.querySelector(".material-icons");
          let panel = this.nextElementSibling;
          
          if (icon){
            icon.classList.toggle("rotate180");
          }
          
          if (panel.style.display === "block"){
            panel.style.maxHeight = "0px";
            setTimeout(() => {panel.style.display = "none";}, 200);
          }
          else {
            panel.style.display = "block";
            panel.style.maxHeight = panel.scrollHeight + "px";
          } 
        });
    });

    // Bind events to data hover, data active, data-click, data-press, data-right etc
    // data-hover [data-hover]
    _sp_init_hover();
    // data active [data-active]
    _sp_init_active();

    Array.prototype.forEach.call(document.querySelectorAll(".header"), ele => {
      if (ele.querySelector(".right-icon")){
        let elesIcon = ele.querySelectorAll(".right-icon");
        let numcount = 16 + (48 * elesIcon.length);
        
        ele.style.paddingRight = String(numcount) + "px";
      }
      
      if (ele.querySelector(".left-icon")){
        let elesIcon = ele.querySelectorAll(".left-icon");
        let numcount = 48 * (elesIcon.length - 1) + 72;
        
        ele.style.paddingLeft = String(numcount) + "px";
      }
      
      let st = window.getComputedStyle(ele);
      let val = parseInt(st.getPropertyValue("height"));
      
      if (val > 56){
        ele.style.paddingTop = 72 + "px";
        ele.style.paddingBottom = 28 + "px";
        ele.style.fontSize = "24px";
      }
    });

    if (document.querySelector(".bottom-navigation .wrapper")){
        let count_eles_bn = 0;
        let _bn = document.querySelector(".bottom-navigation .wrapper");
        let _bn_w = 0;
        let _bn_eles = _bn.querySelectorAll(".element");
        
        Array.prototype.forEach.call(_bn_eles, r => {
          count_eles_bn++;
          _bn_w += parseInt(window.getComputedStyle(r).getPropertyValue("width"));
        });
        
        _bn.style.width = _bn_w + "px";
    }

    // Miscellanious functions
    $(".fab-btn.animate").click( e => {
        e = e || window.event;
        e.target.classList.toggle("doanim");
    });

    $(".tab").click( e => {
        e = e || window.event;
        let i, tabcontent, tab;

        tabcontent = document.getElementsByClassName("tabcontent");

        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tab = document.getElementsByClassName("tab");
        
        for (i = 0; i < tab.length; i++) {
            tab[i].className = tab[i].className.replace(" active", "");
        }

        document.getElementById(e.target.getAttribute("data-tab")).style.display = "block";
        e.currentTarget.className += " active";
    });

    let __tab_default_ele = document.querySelectorAll(".tab[data-default=\"true\"]");
    if (typeof __tab_default_ele === "object"){
        Array.prototype.forEach.call(__tab_default_ele, r => {
            r.click();
        });
    }

    $(".chip .close").click( e => {
        e = e || window.event;
        e.target.parentElement.style.display = "none";
    });
}
//end of init function

/*sp ripple function*/
function _sp_rippleIt(e){
    e = e || window.event;
    let color;
    let cColor = e.target.getAttribute("data-ripple");
    if (cColor){
      if (cColor[0] !== "#"){
        color = "#" + cColor;
      }
      else {
        color = cColor;
      }
    }
    else {
      color = "rgba(255,255,255,0.9)";
    }

    _sp_create_ripple(e, color);
}

function _sp_rippleIt_dark(e){
  e = e || window.event;
  _sp_create_ripple(e, "rgba(0, 0, 0, .5)");
}

function _sp_rippleIt_auto(e){
  e = e || window.event;
  let style = window.getComputedStyle(e.target);
  let bg = style.getPropertyValue("background-color");
  let color = $().ld(bg, 90);

  _sp_create_ripple(e, color);
}

function _sp_create_ripple(e, color){
    e = e || window.event;
    let circle = document.createElement("span");
    e.target.appendChild(circle);

    let d, width = e.target.clientWidth, height = e.target.clientHeight;

    if(width >= height) {
        d = width;
    } else {
        d = height; 
    }

    circle.classList.add("sp-ripple");
    circle.style.backgroundColor = color;

    let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let coordX = scrollLeft + e.target.getBoundingClientRect().x;
    let coordY = scrollTop + e.target.getBoundingClientRect().y;
    let x = e.pageX - coordX - d / 2;
    let y = e.pageY - coordY - d / 2;

    circle.style.height = d+"px";
    circle.style.width = d+"px";
    circle.style.left = x + "px";
    circle.style.top = y + "px";
    
    setTimeout( () => {circle.style.display="none";}, 600);
}

function _sp_update_sticky_eles(){
    Array.prototype.forEach.call(document.querySelectorAll(".sticky"), r => {            
        if (window.pageYOffset >= r.offsetTop){
            r.classList.add("sp-sticky");
        }
        else {
            r.classList.remove("sp-sticky");
        }
    });
}

// Bind an event for sticky elements
window.addEventListener("scroll", _sp_update_sticky_eles);

window.addEventListener("scroll", () => {
    let autohideTopEles = document.getElementsByClassName("autohide-top");
    let autohideBottomEles = document.getElementsByClassName("autohide-bottom");

    if (autohideTopEles || autohideBottomEles) {
        let crntScrollPos = window.pageYOffset;
        
        if (__prevScrollpos > crntScrollPos){
            if (autohideTopEles){
                Array.prototype.forEach.call(autohideTopEles, r => {
                    r.style.top = "0";
                });
            }
            
            if (autohideBottomEles){
                Array.prototype.forEach.call(autohideBottomEles, r => {
                    if(r.classList.contains("fab-btn")){
                        r.style.bottom = "16px";
                    }
                    else {
                        r.style.bottom = "0";
                    }
                });
            }
        }
        else {
            if (autohideTopEles){
                Array.prototype.forEach.call(autohideTopEles, r => {
                    r.style.top = "-500px";
                });
            }
            if (autohideBottomEles){
                Array.prototype.forEach.call(autohideBottomEles, r => {
                    r.style.bottom = "-500px";
                });
            }
        }

        __prevScrollpos = crntScrollPos;
    }

    let extheader = document.querySelector(".header.extended");
    if (extheader){
        if(window.pageYOffset > 0){
            extheader.classList.remove("sp-h-state2");
            extheader.classList.add("sp-h-state1");
        }
        else {
            extheader.classList.remove("sp-h-state1");
            extheader.classList.add("sp-h-state2");
        }
    }
});

// function to control bottom sheet
function __sp_bottomsheet(){
    let s = document.querySelector(".bottomsheet");

    $(".bottomsheet").swipe("any", r => {
        document.querySelector(".sp-scrim").style.opacity = 1;

        if(r.direction === "up"){
          s.style.height = null;
          s.classList.add("extended");
        }
        else if(r.direction === "down"){
          let condition = Math.floor((r.y.traveled * 100)/window.innerHeight);
          
          if((condition >= 10 && r.time <= 1000) || (condition >= 20 && r.time > 1000)){
            $().removeSheet();
          }
          else if(s.classList.contains("extended")){
            s.style.height = "calc(100% - 56px)";
          }
        }
    }, {
        minLength: 15,
        withSwipe: r => {
          let t = r.y.traveled * -1;

          s.style.height = parseInt($(s).height()) + t + "px";
          let p = Math.floor(((290 - Math.abs(t))/290) * 100) / 100;
          document.querySelector(".sp-scrim").style.opacity = p;
        }
    });

    $("#bottomsheetClose").click($().removeSheet);
    $("#bottomsheetBar").click(() => {
      s.style.height = null;
      s.classList.add("extended");
    });
}

// Data Attribute Binding Functions
// [data-hover]
function _sp_init_hover(){
    let cnames = "";
    let cnames_replaced = [];
    let cnames_t_replaced = [];
    let cnames_ld_replaced = [];

    Array.prototype.forEach.call(document.querySelectorAll("[data-hover]"), r => {
        cnames = r.getAttribute("data-hover");
        let cnames_array = cnames.split(" ");

        r.addEventListener("mouseenter", () => {
            if (cnames.indexOf("bg-") > -1){
                for(let i in SP_DATA_COLORS){
                    if (r.classList.contains("bg-"+SP_DATA_COLORS[i])){
                        cnames_replaced.push(SP_DATA_COLORS[i]);
                        r.classList.remove("bg-"+SP_DATA_COLORS[i]);
                    }
                }
            }

            if (cnames.indexOf("text-") > -1){
                for(let i in SP_DATA_COLORS){
                    if (r.classList.contains("text-"+SP_DATA_COLORS[i])){
                        cnames_t_replaced.push(SP_DATA_COLORS[i]);
                        r.classList.remove("text-"+SP_DATA_COLORS[i]);
                    }
                }
            }

            if (cnames.indexOf("lighten") > -1 || cnames.indexOf("darken") > -1){
                for(let i in SP_DATA_LD){
                    if (r.classList.contains(SP_DATA_LD[i])){
                        cnames_ld_replaced.push(SP_DATA_LD[i]);
                        r.classList.remove(SP_DATA_LD[i]);
                    }
                }
            }

            for(let x = 0; x < cnames_array.length; x++){
                r.classList.add(cnames_array[x]);
            }
        });
    
        r.addEventListener("mouseleave", () => {
            for (let x = 0; x < cnames_array.length; x++){
                r.classList.remove(cnames_array[x]);
            }
                
            if (cnames_replaced.length > 0){
                for(let y = 0; y < cnames_replaced.length; y++){
                    r.classList.add("bg-"+cnames_replaced[y]);
                }
            }

            if (cnames_t_replaced.length > 0){
                for(let w = 0; w < cnames_t_replaced.length; w++){
                r.classList.add("text-"+cnames_t_replaced[w]);
                }
            }

            if (cnames_ld_replaced.length > 0){
                for(let z = 0; z < cnames_ld_replaced.length; z++){
                r.classList.add(cnames_ld_replaced[z]);
                }
            }
        });
    });
}
// [data-active]
function _sp_init_active(){
    let cnames = "";
    let cnames_replaced = [];
    let cnames_t_replaced = [];
    let cnames_ld_replaced = [];
    
    Array.prototype.forEach.call(document.querySelectorAll("[data-active]"), r => {
        cnames = r.getAttribute("data-active");
        let cnames_array = cnames.split(" ");

        r.addEventListener("mousedown", () => {
            if (cnames.indexOf("bg-") > -1){
                for(let i in SP_DATA_COLORS){
                    if (r.classList.contains("bg-"+SP_DATA_COLORS[i])){
                        cnames_replaced.push(SP_DATA_COLORS[i]);
                        r.classList.remove("bg-"+SP_DATA_COLORS[i]);
                    }
                }
            }

            if (cnames.indexOf("text-") > -1){
                for(let i in SP_DATA_COLORS){
                    if (r.classList.contains("text-"+SP_DATA_COLORS[i])){
                        cnames_t_replaced.push(SP_DATA_COLORS[i]);
                        r.classList.remove("text-"+SP_DATA_COLORS[i]);
                    }
                }
            }
            
            if (cnames.indexOf("lighten") > -1 || cnames.indexOf("darken") > -1){
                for(let i in SP_DATA_LD){
                    if (r.classList.contains(SP_DATA_LD[i])){
                        cnames_ld_replaced.push(SP_DATA_LD[i]);
                        r.classList.remove(SP_DATA_LD[i]);
                    }
                }
            }

            for(let x = 0; x < cnames_array.length; x++){
                r.classList.add(cnames_array[x]);
            }
        });

        r.addEventListener("mouseup", () => {
            for(let x = 0; x < cnames_array.length; x++){
                r.classList.remove(cnames_array[x]);
            }

            if (cnames_replaced.length > 0){
                for(let y = 0; y < cnames_replaced.length; y++){
                r.classList.add("bg-"+cnames_replaced[y]);
                }
            }
            
            if (cnames_t_replaced.length > 0){
                for(let w = 0; w < cnames_t_replaced.length; w++){
                r.classList.add("text-"+cnames_t_replaced[w]);
                }
            }
            
            if (cnames_ld_replaced.length > 0){
                for(let z = 0; z < cnames_ld_replaced.length; z++){
                r.classList.add(cnames_ld_replaced[z]);
                }
            }
        });
    });
}