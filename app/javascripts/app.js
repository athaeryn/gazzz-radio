;(function(window, $, undefined) {

  var mixer;

  window.onYouTubeIframeAPIReady = function() {
    mixer = new window.Mixer('mixer');
    mixer.addDeck();
    mixer.addDeck();

    $(mixer).on('mixerReady', onMixerReady);
  };

  function onMixerReady() {
    mixer.spinIt();
  }

}(window, jQuery));
