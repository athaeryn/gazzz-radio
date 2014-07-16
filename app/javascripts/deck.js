;(function(window, $, undefined) {

  var FADE_TIME = 6000;
  var START_FADE_TIME = 20;

  var Deck = function(deckId) {

    this.deckId = deckId;
    this.$elm = $('#deck-' + deckId);
    this.ready = false;
    this.playing = false;
    this.track = {};
    this.trackLength = 0;
    this.fadeInterval = null;
    this.timeInterval = null;

    this._player = new window.YT.Player('deck-' + deckId, {
      height: '100%',
      width: '100%',
      playerVars: {
        playerapiid: deckId,
        autoplay: 0,
        controls: 0,
        enablejsapi: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0
      },
      events: {
        'onReady': $.proxy(this._onPlayerReady, this),
        'onStateChange': $.proxy(this._onStateChange, this)
      }
    });
  };

  Deck.prototype.loadVinyl = function(track) {
    this.track = track;
    this._player.setVolume(0);
    this._player.loadVideoById(track.videoId);
    this._player.pauseVideo();
  };

  Deck.prototype.fadeIn = function() {
    window.clearInterval(this.fadeInterval);
    var self = this;
    var vol = 0;
    this._player.setVolume(vol);
    this.$elm.css('opacity', vol / 100);
    this._player.playVideo();
    this.fadeInterval = window.setInterval(function() {
      vol++;
      //console.log('FADING IN ' + self.deckId + ': ', vol);
      if(vol > 100) {
        window.clearInterval(self.fadeInterval);
      } else {
        self._player.setVolume(vol);
        self.$elm.css('opacity', vol / 100);
      }
    }, FADE_TIME / 100);
    $(this).trigger('deckStart');
  };

  Deck.prototype.fadeOut = function() {
    window.clearInterval(this.fadeInterval);
    var self = this;
    var vol = 100;
    this._player.setVolume(vol);
    this.$elm.css('opacity', vol / 100);
    this.fadeInterval = window.setInterval(function() {
      vol--;
      //console.log('FADING OUT ' + self.deckId + ': ', vol);
      if(vol < 0) {
        window.clearInterval(self.fadeInterval);
        self._player.pauseVideo();
        $(self).trigger('deckStop');
      } else {
        self._player.setVolume(vol);
        self.$elm.css('opacity', vol / 100);
      }
    }, FADE_TIME / 100);
  };

  Deck.prototype.pause = function() {
    this._player.pauseVideo();
  };

  Deck.prototype.play = function() {
    this._player.playVideo();
  };

  Deck.prototype._onPlayerReady = function(e) {
    this._player.setVolume(0);
    this.$elm = $('#deck-' + this.deckId);
    this.ready = true;
    $(this).trigger('deckReady', this.deckId);
  };

  Deck.prototype._onStateChange = function(e) {
    switch(e.data) {
      case -1:
        // Unstarted
        window.clearInterval(this.timeInterval);
      break;
      case 0:
        // Ended
        window.clearInterval(this.timeInterval);
      break;
      case 1:
        // Playing
        var self = this;
        this.trackLength = this._player.getDuration();
        this.timeInterval = window.setInterval(function() {
          var current = self._player.getCurrentTime();
          //console.log((self.trackLength - current));
          if((self.trackLength - current) < START_FADE_TIME) {
            window.clearInterval(self.timeInterval);
            $(self).trigger('deckEnding');
          }
        }, 1000);
      break;
      case 2:
        // Paused
        window.clearInterval(this.timeInterval);
        //console.log('DECK ' + this.deckId + ' PAUSED');
      break;
      case 3:
        // Buffering
      break;
      case 5:
        // Video Cued
      break;
      default:
      break;
    }
  };

  window.Deck = Deck;

}(window, jQuery));
