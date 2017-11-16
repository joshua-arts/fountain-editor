// The code here was written by Josh Arts, but based off of code
// included in the fountain.js sample app written but Matt Dalay.

(function(){

  var $workspace = $('#workspace');
  var $header    = $workspace.find('header');
  var $save      = $('#save');
  var $github    = $('#github');
  var $script    = $('#script').addClass('us-letter').addClass('dpi72');
  var $title     = $('#script-title');
  var $editor    = $('#editor');
  var $input     = $('#input');

  var msg = "Add a fountain script on the left to begin."

  var intro = `Title:
	_**Hey there!**_
Credit: Welcome to Fountain Editor!
Author: Drag a Fountain file to the left to open it! See <a href='fountain.io'>fountain.io</a> for Fountain syntax!
Source: Fountain Editor lets you open, live edit, preview and save Fountain screenplays, all in your browser! Check Fountain Editor out on <a href='www.github.com/joshua-arts/fountain-editor'>Github</a>!
Contact:
	Fountain by Nima Yousefi.
	fountain.js by Matt Daly.
	Fountain Editor by Josh Arts.

EXT. PARK - DAY

A gorgeous sunny day.  JOSH, developer of FOUNTAIN EDITOR, is sitting anxiously on a bench under a tree.

JOSH hops up off the BENCH just as YOU run by, out on an evening jog.

JOSH
Hey you! Go check out Fountain Editor!

YOU
Of course! What was I thinking?
`;

  var resizeSections = function(){
    h = $(window).height() - $header.height() - 20;
    $script.height(h);
    $editor.height(h);
    w = $(window).width() - $script.width() - 40;
    $editor.width(w);
  }

  var page = function(html, isTitlePage){
    var $output = $(document.createElement('div')).addClass('page').html(html);

    if (isTitlePage) {
      $output.addClass('title-page');
    } else {
      $output.children('div.dialogue.dual').each(function() {
        dual = $(this).prev('div.dialogue');
        $(this).wrap($(document.createElement('div')).addClass('dual-dialogue'));
        dual.prependTo($(this).parent());
      });
    }

    return $output;
  };

  var update = function(){
    $script.empty();

    fountain.parse($input.val() || msg, function (result) {
      if (result) {
        if (result.title && result.html.title_page) {
          $script.append(page(result.html.title_page, true));
          $title.html(result.title || 'Untitled');
        }
        $script.append(page(result.html.script));
      }
    });
  }

  var save = function(){
    var blob = new Blob([$input.val()], {"type": "text/plain"});
    var a = document.createElement("a");
    a.download = $title.text().toLowerCase().replace(' ', '_');
    a.href = URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    text.value = "";
    input.value = "";
    button.disabled = true;
    document.body.removeChild(a);
  }

  /*
  var dragOver = function(e){
    e.preventDefault();
    e.stopPropagation();
    // Do some style effect.
  }

  var dragLeave = function(e){
    e.preventDefault();
    e.stopPropagation();
    // Do some style effect.
  } */

  var loadScript = function(e){
    e.preventDefault();
    e.stopPropagation();
    e = e.originalEvent;

    var file = e.dataTransfer.files[0];
    var reader = new FileReader();

    if (file){
      reader.onload = function(evt){
        txt = evt.target.result;
        $input.val(txt);
        update();
      }

      reader.readAsText(file);
    }
  }

  // Initial resize of the sections.
  resizeSections();
  // Resize when window height changes.
  window.addEventListener('resize', resizeSections);
  // Update the pages when the text changes.
  $input.bind('input propertychange', update);
  // Setup drag events.
  $editor.on('drop', loadScript);//.on('dragleave', dragLeave).on('dragover', dragOver)
  // Setup header buttons.
  $save.click(save);
  $github.click(function(){ window.open('www.github.com/joshua-arts/fountain-editor', '_blank') });
  // Add hover events.
  $save.mouseenter(function(){ $save.css('color', 'red') });
  $save.mouseleave(function(){ $save.css('color', 'white') });
  $github.mouseenter(function(){ $github.css('color', 'red') });
  $github.mouseleave(function(){ $github.css('color', 'white') });
  // Open the intro file.
  $input.val(intro);
  update();
})();
