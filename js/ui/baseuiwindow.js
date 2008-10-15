var UIWindow = new Class({
  Implements: [Events],
  initialize: function(parentObject, client, type, name, identifier) {
    this.parentObject = parentObject;
    this.type = type;
    this.name = name;
    this.active = false;
    this.client = client;
    this.identifier = identifier;
    this.hilighted = false;
    this.scrolltimer = null;
    this.commandhistory = this.parentObject.commandhistory;
    this.scrolleddown = false;
    //new CommandHistory();
  },
  updateNickList: function(nicks) {
  },
  updateTopic: function(topic)  {
  },
  close: function() {
    if($defined(this.scrolltimer)) {
      $clear(this.scrolltimer);
      this.scrolltimer = null;
    }

    this.parentObject.__closed(this);
    this.fireEvent("close", this);
  },
  select: function() {
    this.active = true;
    this.parentObject.__setActiveWindow(this);
    if(this.hilighted)
      this.setHilighted(false);
    if(this.scrolleddown)
      this.__scrollToBottom();
  },
  deselect: function() {
    if(!this.parentObject.singleWindow)
      this.scrolleddown = this.__scrolledDown();
    if($defined(this.scrolltimer)) {
      $clear(this.scrolltimer);
      this.scrolltimer = null;
    }

    this.active = false;
  },
  addLine: function(type, line, colour, element, parent, scrollparent) {
    if(!this.active && !this.hilighted)
      this.setHilighted(true);
    
    if(type)
      line = this.parentObject.theme.message(type, line);
    
    Colourise(IRCTimestamp(new Date()) + " " + line, element);
    
    this.scrollAdd(element);
  },
  errorMessage: function(message) {
    this.addLine("", message, "red");
  },
  setHilighted: function(state) {
    this.hilighted = state;
  },
  __scrolledDown: function() {
    if(this.scrolltimer)
      return true;
      
    var parent = this.lines;
    
    var prev = parent.getScroll();
    var prevbottom = parent.getScrollSize().y;
    var prevsize = parent.getSize();
    //alert("1: " + (prev.y + prevsize.y) + " 2:" + prevbottom);
    return prev.y + prevsize.y == prevbottom;
  },
  __scrollToBottom: function() {
    var parent = this.lines;
    var scrollparent = parent;

    if($defined(this.scroller))
      scrollparent = this.scroller;
      
    scrollparent.scrollTo(parent.getScroll().x, parent.getScrollSize().y);
  },
  scrollAdd: function(element) {
    var parent = this.lines;
    
    /* scroll in bursts, else the browser gets really slow */
    if($defined(element)) {
      var sd = this.__scrolledDown();
      parent.appendChild(element);
      if(sd) {
        if(this.scrolltimer)
          $clear(this.scrolltimer);
        this.scrolltimer = this.scrollAdd.delay(50, this, [null]);
      }
    } else {
      this.__scrollToBottom();
      this.scrolltimer = null;
    }
  },
  historyExec: function(line) {
    this.commandhistory.addLine(line);
    this.client.exec(line);
  }
});
