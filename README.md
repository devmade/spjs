# SP.js - Material Design UI library

Not everyone needs a complete framework like Vuetify or Angular for little stuffs. This is just a 44kb (.min.js) and 117kb (.min.css)
This library is made with a lot of widget components. To name a few snackbar, dialog, waiting, context menu etc.

This is a lightweight library made with complete accordance with official material design principles. A lot of UI stuff can only be done with class names and data-attributes.

## Highlights
1. Basic material components like header, ripples, buttons, list, table, form etc.
2. Material color palettes
3. Javascript controlled material design based widgets like Dialog, Context menu, snackbar etc.
4. DOM handler with "$" function
5. Included normalize.css
6. Many more little things which make the library beautiful

## Getting started
For details you might want to visit [my portfolio](https://devsaurabh.com/sp/)
A note to remember is whenever duration is to be set in any widget, it must be in seconds and not milliseconds. So write 1 and not 1000 (or you may if you want to show it for 1000 seconds).
### Widgets
Probably the only thing you have come here for :)
I have made 9 widgets which can be totally controlled and customised with Javascript.
#### 1. `createSnackbar()` Material Design Snackbar
Text argument is required, else undefined is shown.
```javascript
$().createSnackbar(text, duration, options)
```
Duration is set to 2.5 seconds if not passed
The "options" argument must be an object. Below is what default options object looks like.
```javascript
{
  animate: "translate",
  background: "#000",
  color: "#fff",
  width: "100%"
  maxWidth: "100%",
  borderRadius: "0px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  swipeable: false,
  button: {
	  background: "#000",
	  color: "#7e57c2",
	  borderRadius: "2px",
	  boxShadow: "none",
	  text: "Button",
	  callback: function_name
  }
}
```
The snackbar is destroyed when the duration ends or if button is defined and is clicked.
Manually, snackbar can be destroyed with
```javascript
$().removeSnackbar()
```

#### 2. `createToast()` Material Design Toast
Text argument is necessary.
```javascript
$().createToast(text, duration, options)
```
Duration is set to 1.5 seconds if not passed.
The "options" argument must be an object. Below is what default options object looks like.
```javascript
{
  background: "#eee",
  color:"#000",
  bottom:"20px"
}
```
The toast is destroyed when the duration ends.
Manually, toast can be destroyed with
```javascript
$().removeToast()
```

#### 3. `customToast()` Custom Toast Message
First argument must be an HTML DOM Object.
```javascript
$().customToast(element, duration)
```
Duration is set to 2 seconds if not passed.
Note: Custom toast have no predefined CSS styling. You must style them yourself.

The custom toast is destroyed when the duration ends.
Manually, it can be destroyed with
```javascript
$().removeCustomToast()
```

#### 4. `createSheet()` Material Design Action Sheet
If the options argument is not passed an empty white sheet will be created.
```javascript
$().createSheet(options);
```
Argument must be an object. Here's the default one.
```javascript
{
 title: "",
 content: "",
 background: "#fff",
 color: "#000"
}
```
The action sheet/ bottom sheet can be expanded with either of the following options.
1. Clicking on the header (title element)
2. Swiping up

The action sheet/ bottom sheet can be destroyed with either of the following options.
1. Swiping down
2. Clicking of the "close" icon in header
3. Clicking on scrim element outside the sheet.
3. Calling `$().removeSheet()`

#### 5. `createWaiting()` Material Design Loading/Progress/Waiting Dialog
```javascript
$().createWaiting(options, callback)
```
Argument "options" must be an Object. It may look like this.
```javascript
{
 loadingAnimation: true,
 title: "Loading",
 text: false,
 timeout: undefined,
 scrim: true
}
```
Second argument must be an function which is called when the Waiting is destroyed.
The text element in "options" object must be an string.
If timeout in optins argument is not defined, the widget will keep going on forever, unless dismissed manually.

The widget can be destroyed by either defining timeout (in seconds) in options argument or calling `$().removeWaiting()`

#### 6. `createDialog()` Material Design Dialog
```javascript
$().createDialog(options, isDismissable, showScrim, showShadow)
```
Default values for 2nd, 3rd and 4th arguments is `true`
"isDismissable" argument tells whether to dismiss dialog when clicked outside on scrim. Must be boolean.
"showScrim" argument tells whether to show scrim or not. Must be boolean.
"showShadow" argument tells whether to show box-shadow of dialog element. Must be boolean.

"options" argument must be an object. Below is what it looks like if not defined.
```javascript
{
  // main properties
  HTML: undefined,
  title: undefined,
  text: undefined,
  content: undefined,
  
  // styling related properties
  titleColor: "#000",
  textColor: "#000",
  contentColor: "#000",
  background: "#fff",
  contentBorder: "1px solid #eee",
  scrimColor: "rgba(0,0,0,0.4)",
  borderRadius: "4px",
  
  // button properties
  button: undefined, // can be an object
  buttons: undefined // can be an array of objects
}
```
If HTML is defined all other properties don't matter.
HTML must be an HTML DOM Object. It becomes direct child of the dialog box.
If it isn't defined we get to make stuff.
Title must be string, so should be text and content.
Use case scenario for content: Suppose you want to show a few checkboxes or input. You might do that here.

You can only define either `button` or `buttons` property. The dialog widget can have 3 buttons at most.
If you want to define buttons, it must be an array of button.
```javascript
{
  buttons: [
    button, button, button
  ]
}
```
button object's structure may look like
```javascript
{
  button: {
    text: undefined, // must be string
    action: // look below for possible action values,
    background: undefined, // any possible CSS value
    color: undefined, // any possible CSS value
    class: undefined // must be string
  }
}
```
The "action" may hold any of the listed values
1. "cancel"
If button's text or action is "cancel", clicking on the button dismisses dialog
2. URL
If action's value is string and is an valid URL (checked by $().isURL(url)), clicking on button dismisses dialog and opens the link in new tab
3. callback function
If action's value is typeof function, on clicking the button dismisses dialog and calls the callback function with the element ".dialog-content" as argument. (In case you had a form in dialog).

To dismiss or destroy, you may do any of the following.
1. Click on any of the buttons.
2. Click outside of dialog box on the scrim, if you didn't set the showScrim argument to false.
3. You my call `$().removeDialog()`

#### 7. `createFullScreenDialog()` Material Design Full Screen Dialog
```javascript
$().createFullScreenDialog(options)
```
Argument "options" must be an object. Here's how it looks
```javascript
{
 title: "",
 background: "#fff",
 color: "#000",
 button: {
  text: "Button",
  background: "#fff", // defaults to parent
  color: "#000", // defaults to parent
  borderRadius: "none"m
  boxShadow: "none"
 },
 action: callback_function
 content: // see below
}
```
"content" can be
1. String
2. HTML DOM Element

callback is passed an argument which is an HTML DOM Element of content.

It can be dismissed by
1. Clicking "close" icon in header
2. Clicking action button, if defined
3. Calling `$().removeFullScreenDialog()`

#### 8. `createContextMenu()` Material Design Context Menu
```javascript
$().createContextMenu(coords, data, options)
```
Argument "coords" can either be a string with value "center" or an Javascript object with keys "x" and "y". It may also be event object passed down by an event listener.

Argument "data" must be an array of objects or string with value "divider", which creates an divider. Each Object is an list item in the menu. It can look like this
```javascript
[
  {
    text: String,
    action: // see below
  },
  "divider"
]
```
"action" can be either a URL string (checked with $().isURL()), callback function or string with value "disabled".

Argument "options" must be an Object and can look like this
```javascript
{
  background: "#fff",
  color: "#000",
  class: undefined, // can be string
  scrimColor: "transparent" // you can't see scrim
}
```

It can be dismissed or destroyed by
1. Clicking on invisible (if scrimColor is not defined), scrim outside the menu.
2. Calling `$().removeContextMenu()`

#### 9. `createScrim()` Make Scrim
```javascript
$().createScrim(color)
```
Default value of color is "rgba(0,0,0,0.4)".
You may add event listeners to the scrim using `$().scrimAddListener(event, listener)`
You may remove event listeners to the scrim using `$().scrimRemoveListener(event, listener)`, where listener must be an defined function. (Named function)
You may use `$().isScrim()` to check if there are any scrim present currently in DOM

You may dismiss the scrim by calling `$().removeScrim()`

### `$().method()` Methods. No selector required

`maxZ()` - Returns largest zIndex

`create(?elementName)` - makes and returns element. Doesn't append. If name not passed, makes a 'div'

`getSPprops()` - Returns SP properties object which holds data regarding state of widgets.

`preventBackKey()` - Blocks going back to any page in browser

`defaultBackKey()` - Removes block to going back in history

`onBackKey(listener)` - Adds event listener to window's popstate event

`removeOnBackKey(listener)` - Removes event listener from window's popstate event

`html()` - returns innerHTML. If used querySelector, returns an array of innerHTML
`text()` - returns innerText. If used querySelector, returns an array of innerText

`offset(?dimension)` - Returns offset. Dimension maybe (top, left, right, bottom, width, height). May return object when element is passed as selector without dimension and with dimension may return numeric value. If querySelector is used it may return array of objects if no dimension or may return array of numeric values if dimension is passed.

`val()` - returns value or array of value

`toggleNoScroll()` - toggles "noscroll" class name to the body element.

`getRandomString(length = 5, type = default)` - type in (caps, smalls, both, numbers, secretKey)

`l()` = `log()` = console.log()

`isURL()` - checks if it is URL

`getcss(property)`

`scrollHeight()`
`scrollWidth()`

`fullscreen()`
`exitfullscreen()`

`vibrate(time_array)` - Argument must be an array of time pattern for SOS and other stuff. Search for Mozilla Docs for more

`materialNav()` - Toggles Material Navigation bar, if you have one

`colors` - it is a property not method. Returns an huge object of colors and material palettes.

`rgbToHex(rgb)`
`ld(color, amount)` - Lighten or Darken the shades of a color

### `$(selector).method()` Methods. Selector required
"selector" can either be HTML DOM Object, query selector string or document.

`get()` - returns selected elements

`maxZ()` - Sets largest available zIndex + 1

`click(callback)`

`rightclick(callback)`

`dblclick(callback, timeout = 0.3)` - The clicks must be within timeout

`longpress(callback, timeout = 1)` - Tap/click and hold

`on(event, callback, options)` - swipe, swipe + (left, right, up, down), rightclick, dblclick, longpress + other events

`removeEventListener(event, listener)` - Removes event listener from all selector elements

#### Swipe Event Handler
`swipe(direction, callback, options)`
Argument `direction` can be either of the followings.
1. "any"
2. "left"
3. "right"
4. "up"
5. "down"

Argument `callback` is called after the event is dismissed or ended. It gets an object argument "result", which contains following data.
```javascript
function callback(result){
  // do something with the data
}
```
The object "result" may look like. "time" is in milliseconds.
```javascript
result = {
  x : {
    initial,
    final,
    traveled
  },
  y : {
    initial,
    final,
    traveled
  },
  angle,
  direction,
  time
}
```

Argument `options` must be an object and has three properties.
1. minLength - Minimum length condition which must be satisfied before the callback is called. If minLength is not satisfied and event ends, callback is not called.

2. onStart - It must be a function. It is called when the swipe starts. It gets an argument which looks like.
```javascript
{
  x, y, time  
}
```
x and y are initial coordinates, while time is initial timestamp.

3. withSwipe - It must be a function. It is called everytime the coordinates change. It gets an argument which looks exactly same as that of callback. Take a look above.


If any element with class "ripple" is created by Javascript, it must be binded manually for the ripples to form. 

`bindRipple()`

`bindDarkRipple()`

`bindAutoRipple()`

Argument `data` must be string.

`html(data)` - DOM Not supported. Rather use addChild for DOM Element

`text(data)`

Argument `data` must be an string.

`appendHTML(data)`

`appendText(data)`

`prependHTML(data)`

`prependText(data)`

Argument `className` must be an string and not an array of strings.

`toggleClass(className)`

`addClass(className)`

`removeClass(className)`

`replaceclass(className)`

`hasClass(className)`

`attr(attribute, ?value)` - If value not given it returns attribute value. Else sets

`removeAttr(attribute)`

If argument is not passed, they return values. If selector is query string, they return array of values for all the selected elements.

`width(?width)`

`height(?height)`

`position(?position)`

`background(?background)`

`color(?color)`

`left(?left)`

`top(?top)`

`right(?right)`

`bottom(?bottom)`

`display(?display)`

DOM is HTML DOM Object element. Can either be document.createElement() or document.getElementById()

`addChild(DOM)`

`removeChild(DOM)`

`toggleChild(DOM)`

`css(Object)` - Property names must be in camelCase like zIndex (not z-index, sure you'd know). Sets CSS values

## CSS styling and Classes
You don't have to touch CSS. That was the beginning idea behind this library. I have predefined hundreds of CSS class names, which in combination can create thousands of different styles. No two sites must look same if made with same library.
Unfortunately it is time consuming to describe all of the class names, I will list them.

I use Bootstrap's grid.

Before that, this library includes `normalize.css` and includes material icon font.

### HTML Starter template
Here is basic HTML structure for CSS styling.
You may find the complete material-nav template in Material Nav Class section.
```HTML
<body>
  <div class="material-nav" id="material-nav"></div>
  <div class="container">
    <div class="header fixed">
      <i class="left-icon material-icons material-nav_opener">menu</i>
      SP.JS
    </div>
    <div class="page">
      
    </div>
  </div>
</body>
```

### Available colors
The colors are
1. yellow
2. white
3. black
4. green
5. teal
6. indigo
7. red
8. steelblue
9. pink
10. purple
11. deeppurple
12. blue
13. skyblue
14. orange
15. brown
16. bluegrey
17. primary
18. warning
19. info
20. success
21. danger
22. grey

These colors are used in a lot of class names.
You may add them like `bg-`, `text-`, `btn-`, `badge-`, `outline-` + color name.

For example  `class="bg-green"`, `class="text-blue"`, `class="btn btn-red"` ("btn" is requirement), `class="badge badge-black"` ("badge" is requirement) etc.

Or you may use them with other classes like form input elements `material-input`, `material-radio`, `toggle`, `input slider`, `border` etc.

For example `class="material-input yellow"`, `class="material-radio purple"`, `class="toggle pink"`, `class="input-slider brown"` etc.

### Predefined or available class names
Below are available class names or simple and complex elements.
Complex elements like FAB.
Simple elements like button.

#### Button Class
All buttons must have `btn` class name as a initiation point.
1. text-btn
2. toggle-btn
3. btn-lg
4. clickable - Adds a little animation on the button when clicked
5. btn-(any color name, see above for reference), like btn-indigo

Example
```HTML
<button class="btn btn-red clickable">Click me</button>
<button class="btn bg-blue">Click me</button>
```

#### Ripple Class
You may add these class names to any element and they'll have ripple effects. Remember if you added the class name or created element with Javascript, you need to bind ripple effect using `$(selector).bindRipple`. See above section for reference.
1. ripple
2. ripple-dark
3. ripple-auto
4. cssripple (100% CSS only effect)

Example
```HTML
<button class="ripple btn bg-blue">Click me</button>
<button class="ripple btn btn-red" data-ripple="#00fe00">Click me</button> (See HTML Attributes section for more reference)
```

#### Badge Class
Must have `badge` class name as a initiation point.
1. badge-rect
2. badge-up (adds badge on top)
3. badge-lg
4. badge-overlap
5. badge-(any color name)
6. badge-nocolor

Example
```HTML
<button class="btn bg-blue badge badge-white" data-badge="10">Messages</button>
```

#### Box Shadow Class
You may add class `inset` to reverse the shadow effect.
1. shadow1
2. shadow2
3. shadow3
4. shadow4
5. shadow5

Example
```HTML
<button class="shadow4 inset btn bg-blue">Inset Shadow Level 4</button>
<button class="shadow2 btn bg-white text-blue">Shadow Level 2</button>
```

#### FAB Button Class
Container element should have `fab` class. It will have two children elements.
FAB is shown on bottom right of the page.

1. `fab-btn` class
  It may have class names
  1. fab-center (bottom center)
  2. fab-extended
  3. fab-top-left
  4. fab-mini
  5. btn-(any color name)
2. `fab-content` class

Example
```HTML
<div class="fab">
  <button class="fab-btn fab-center btn-red fab-extended shadow2">
    <i class="material-icons">edit</i> Write something?
  </button>
  <div class="fab-content">
    <button class="btn btn-green shadow2">
      <i class="material-icons">edit</i> Write something?
    </button>
  </div>
</div>
````

#### Material Nav Class
The skeleton looks something like this

```HTML
<div class="material-nav" id="nav">
  <div class="material-nav_header">
    <img class="material-nav_cover" src="cover.jpg" />
    <img class="material-nav_avatar" src="avatar.png" />
    <div class="material-nav_title">
      Hello World
    </div>
  </div>
  <div class="material-nav_content">
    You can put your stuff here. Like list?
  </div>
</div>
```
You can also add a class `autoopen` to the material-nav element to auto show the nav when screen width exceeds 840px.
Don't worry, other stuff like header and page update themselves. However since all this is achieved with Javascript, only resizing window might not help, you may need to refresh the browser window.

#### Material Input Class
Example
```HTML
<div class="material-input blue">
  <input type="text" required />
  <label>Input</label>
  <span class="bar"></span>
</div>
<div class="material-input green">
  <textarea required></textarea>
  <label>Textarea</label>
  <span class="bar"></span>
</div>
```
You need to have `required` attribute, else the effect does not exists. The label will always be in active state.
Also you may use any color name with `material-input` class.
If it isn't working, check if you have a valid type property, required property and correct order (label is after).

#### Material Radio Buttons Class
Example
```HTML
<div>
  Are you a human?
  <div class="material-radio red">
    <input type="radio" id="yes" name="human" />
    <label for="yes">Yes</label>
  </div>
  <div class="material-radio red">
    <input type="radio" id="no" name="human" />
    <label for="no">No</label>
  </div>
</div>
```
You may use any color name with `material-radio` class.
Remember to use attributes `id` and `for` in input and label respectively.

#### Material Checkbox Class
Example
```HTML
<label class="material-checkbox red">
  <input type="checkbox" />
  <span>Dogs</span>
</label>

<label class="material-checkbox yellow">
  <input type="checkbox" />
  <span>Cats</span>
</label>
```
You may use any color name with `material-checkbox` class.

#### Custom Form Class
You can put `form` class on a form container element. It doesn't do much, just a little padding.
Inputs and Textarea.
```HTML
<input class="input" type="text" />
<textarea class="input"></textarea>
```

Toggle buttons
```HTML
<input type="checkbox" class="toggle" />&nbsp;
<input type="checkbox" class="toggle green" />
```
You can use any color with `toggle` class.

Range sliders
```HTML
<input type="range" class="slider blue bg-grey" min="0" max="100" value="25">
```
You may use any color with `slider` class.

#### Tooltip Class
Tooltips can be triggered with little hover event. Here's an example for in sentence tooltip.
```HTML
Over the centuries,
<div class="tooltip tooltip-top">
  <div class="tooltiptext">Hello!</div>
  Hover me, 
</div>
mankind has been dead.
```
Other class names are `tooptip-bottom`, `tooptip-right` and `tooptip-left`.
If you want to add tooltip to a block level element, add `block` class to `tooltip` element. Since tooltip is inline-block by default.

#### Chip Class
Example
```HTML
<span class="chip bg-blue">
  <i class="material-icons chip-icon">add</i>
  chip
  <i class="material-icons close">close</i>
</span>
```

#### Breadcrumb Class
Example
```HTML
<ul class="breadcrumb">
  <li>home</li>
  <li>articles</li>
  <li>trend</li>
</ul>
```

#### Header Class
Make `header` the first child of `container` class.
You may use `fixed` and shadow classes.
You can also send header into bottom. Just use `bottom` class.
Or you may extend the size of header. Use `extended` class.

Examples
```HTML
<div class="header">Hello World</div>
<div class="header fixed bottom">Hello World</div>
<div class="header extended">Hello World</div>
<div class="header extended bg-red shadow1">Hello World</div>
<div class="header fixed shadow2">Hello World</div>
<div class="header fixed shadow2 bottom bg-green">Hello World</div>
<div class="header bg-indigo shadow2 autohide-top">Hello World</div>
```

You may use header children elements like `left-icon`, `left-item`, `right-icon`, `right-item` etc. for complexity.
```HTML
<div class="header bg-blue shadow2 fixed">
  <i class="left-icon material-icons material-nav_opener ripple">menu</i>
  Hello World!
  <i class="right-icon material-icons ripple">search</i>
</div>
```

You may need more than one items on both side. You can use `second`, `third`, `fourth` classes with `left-icon` or `right-icon`.
Take this for example
```HTML
<div class="header bg-blue shadow2 fixed">
  <i class="left-icon material-icons material-nav_opener ripple">menu</i>
  Hello World!
  <i class="right-icon material-icons ripple">search</i>
	<i class="right-icon second material-icons ripple">photo</i>
</div>
```
You may also use classes `autohide-top` to hide the header when scrolling down, and `autohide-bottom` for scrolling up.

#### Youtube Class
Sometimes IFrame given by Youtube to embed video ruins up the styling. For that, put the IFrame in a `youtube-video` class element.
Example
```HTML
<div class="youtube-video">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/8tlBy8-ucKs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
```

#### Table Class
```HTML
<table class="table borderless striped responsive hover">
  <tr>
    <td>one</td>
    <td>two</td>
    <td>three</td>
  </tr>
  <tr>
    <td>four</td>
    <td>five</td>
    <td>six</td>
  </tr>
  <tr>
    <td>seven</td>
    <td>eight</td>
    <td>nine</td>
  </tr>
</table>
```
If you don't use `responsive` class, it will take full width.
Use `hover` class to change background color when you hover over element.
Use `striped` class to change background color of every second row.
Use `borderless` to remove all borders.
Use `bordered` to have border all around the `<td>` element.
If none of `borderless` or `bordered` class is uses, border between each row is visible.

#### Material Table Class
```HTML
<table class="material-table bordered">
  <tr>
    <td>one</td>
    <td>two</td>
    <td>three</td>
  </tr>
  <tr>
    <td>four</td>
    <td>five</td>
    <td>six</td>
  </tr>
  <tr>
    <td>seven</td>
    <td>eight</td>
    <td>nine</td>
  </tr>
</table>
```
Well that is it, no more in material table.

#### List Class
```HTML
<ul class="list">
  <li class="list-item">
    One
  </li>
  <li class="list-item active">
    Two
  </li>
  <li class="list-item disabled">
    Three
  </li>
  <li class="list-item">
    Four
  </li>
</ul>
```

#### Material List
Use `<div>` instead of `<ul>` or `<li>`
Basic structure
```HTML
<div class="material-list">
  <div class="list-item">
    <div class="item-text">
      One Item
    </div>
  </div>
</div>
```

Now, you need to put one more class to the list container or `material-list` class element.
One from
1. `one-line-list`
2. `two-line-list`
3. `three-line-list`

and one or null from (no more than 1, will ruin the style)
1. `icon-list`
2. `avatar-list`
3. `thumbnail-list`
4. `large-thumbnail-list`
5. `overline-list` (only for two or three line list)

You may add `divider-list` to add divider after every list item.

Example
```HTML
<div class="material-list one-line-list icon-list divider-list">
  <div class="list-item">
    <i class="material-icons">alarm</i>
    <div class="item-text">
      Alarm
    </div>
  </div>
  <div class="list-item">
    <i class="material-icons">build</i>
    <div class="item-text">
      Build
    </div>
  </div>
  <div class="list-item">
    <i class="material-icons">dns</i>
    <div class="item-text">
      DNS
    </div>
  </div>
  <div class="list-item">
    <i class="material-icons">code</i>
    <div class="item-text">
      Code
    </div>
  </div>
</div>
```
Similarly when using avatar or thumbnail or large thumbnail list, replace icon code with image one. For example
```HTML
<div class="material-list one-line-list avatar-list divider-list">
  <div class="list-item">
    <img src="avatar.png">
    <div class="item-text">
      Alarm
    </div>
  </div>
  <div class="list-item">
    <img src="user.jpg">
    <div class="item-text">
      Build
    </div>
  </div>
  <div class="list-item">
    <img src="avatar.png">
    <div class="item-text">
      DNS
    </div>
  </div>
  <div class="list-item">
    <img src="user.jpg">
    <div class="item-text">
      Code
    </div>
  </div>
</div>
```

In two and three line lists, you can use `<div class="secondary-text"></div>` inside `item-text` element to add a small text line.
Example
```HTML
<div class="material-list icon-list two-line-list">
  <div class="list-item">
    <i class="material-icons">code</i>
    <div class="item-text">
      This is item text
      <div class="secondary-text">
        Secondary text
      </div>
    </div>
  </div>
</div>
```

With two and three line lists, you can use `overline-list` class to have an overline text element. Remember, you can't use other kinds of list with overline list. For example you can't use `icon-list` with `overline-list`.
```HTML
<div class="material-list two-line-list overline-list">
  <div class="list-item">
    <div class="item-text">
      <div class="overline-text">
        Overline text
      </div>
      This is item text
      <div class="secondary-text">
        Secondary text
      </div>
    </div>
  </div>
</div>
```

#### Dropdown Class
```HTML
<div class="dropdown">
  <button class="btn bg-white shadow1 ripple-dark text-blue">Dropdown</button>
  <div class="dropdown-content">
    <ul class="list">
      <li class="active list-item">Item</li>
      <li class="list-item">Item</li>
      <li class="list-item">Item</li>
      <li class="list-item">Item</li>
    </ul>
  </div>
</div>
```

#### Collapsible/Accordian Class
```HTML
<div class="collapsible shadow1">
  <button class="collapse-btn">
    Collapse
    <i class="material-icons">keyboard_arrow_down</i>
  </button>
  
  <div class="collapsed">
    Lorem ipsum doler mit amet... blah blah
  </div>
</div>
```
Code tells pretty much itself.

#### Border Class
You can make a lot of border combinations.
Must use `border` and then add any direction class
1. top
2. bottom
3. right
4. left
5. all

Use any border width class. It ranges from `w1` to `w10`, where w1 is 1px and w10 is 10px wide.
Use any border style class.
1. dashed
2. solid
3. dotted
4. doubled

Use any of the color class names to change border color.

Examples
```HTML
<div class="border left top w3 red dotted">
  Blah Blah Blah
</div>
<div class="border all w7 pink doubled">
  Blah Blah Blah
</div>
```

#### Outline Class
```HTML
<div class="outline-danger border w1 solid all">
  ...
</div>
```
This class changes color and border color.
Use `outline-` + any color name given above.

#### Background Class
Add background colors in any element.
Use `bg-` + any color name given above.
Every color has 9 shades. You can use shades by using any of the following class.
1. lighten1 to lighten4
2. darken1 to darken4

Examples
```HTML
<div class="bg-red">
  Blah Blah Blah
</div>
<div class="bg-green darken4">
  Blah Blah Blah
</div>
<div class="bg-black lighten2">
  Blah Blah Blah
</div>
```

#### Text Class
Available classes are
1. text-center
2. text-right
3. text-left
4. text-shadow
5. text-shadow_white
6. text-shadow_black
7. text-disabled

You can change text color by adding classes like `text-` + any color name.

Examples
```HTML
<h1 class="text-right text-shadow text-purple bg-red">Hello World</h1>
<h1 class="text-center text-green">Hello World</h1>
```

#### Font Class
1. You can change font-size by using classes like
font-10 (10px), font-20 (20px), font-2x, font-3x, font-4x and font-5x
2. You can change font-weight by using classes like
font-100, font-200, ..., font-900

#### Miscellaneous Class
1. Z-Index : z1, z2, ..., z10
2. Float : float-left, float-right
3. Border-radius : curved, no-curved, circle
4. Margin : no-margin, no-margin-top
5. Width & Height : full-width, full-height
6. Position : left, right, bottom, top
7. Others : pull-right, pull-left, no-shadow, no-text-shadow, center, parent-center, visible, hidden, block, inline-block, inline, list-style-none, margin, padding, vertical-margin, overline, underline, line-through, absolute, relative, fixed etc.

### HTML data attributes
1. data-ripple
Use this to customize ripple color of the element. Must be hex value.

2. data-hover
Add or replace classes when mouse moves over the element. Remove or replace again when mouse leaves.

3. data-active
Add or replace classes when mouse is clicked and hold over the element. Remove or replace again when mouse leaves hold.

4. data-target
Use it on `.material-nav_opener`. Value must be the id of material nav element.

5. data-load
Fetches content with AJAX and replaces the innerHTML with the fetched data. Value must be valid URL.
