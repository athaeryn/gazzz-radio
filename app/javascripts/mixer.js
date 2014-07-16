;(function(window, $, undefined) {

  var Mixer = function(elementId) {
    this.$elm = $('#' + elementId);
    this.decks = [];
  };

  Mixer.prototype.addDeck = function() {
    var deckId = this.decks.length;

    var $deck = $('<div id="deck-' + deckId + '" class="inner-wrapper deck"></div>');
    this.$elm.append($deck);

    var deck = new window.Deck(deckId);
    $(deck).on('deckReady', $.proxy(this._onDeckReady, this));
    $(deck).on('deckStart', $.proxy(this._onDeckStart, this));
    $(deck).on('deckStop', $.proxy(this._onDeckStop, this));
    $(deck).on('deckEnding', $.proxy(this._onDeckEnding, this));

    this.decks.push({
      deckId: deckId,
      deck: deck
    });
  };

  Mixer.prototype.spinIt = function() {
    var self = this;
    randomTrack(function(track) {
      self.decks[0].deck.loadVinyl(track);
      self.decks[0].deck.fadeIn();
      self._updateSidebar(track);
      self._setLoading(false);
      randomTrack(function(track) {
        self.decks[1].deck.loadVinyl(track);
      });
    });
  };

  Mixer.prototype.crossfade = function(fromIdx, toIdx) {
    //console.log('CROSSFADE FROM ' + fromIdx + ' TO ' + toIdx);
    this.decks[fromIdx].deck.fadeOut();
    this.decks[toIdx].deck.fadeIn();
  };

  Mixer.prototype._updateSidebar = function(track) {
    var parts = track.title.split(' - ');
    var info = '<span class="ital">' + parts[0] + '</span> - ' + parts[1];
    $('div.track-info p').html(info);
  };

  Mixer.prototype._setLoading = function(loading) {
    if(loading) {
      this.$elm.addClass('loading');
    } else {
      this.$elm.removeClass('loading');
    }
  };

  Mixer.prototype._onDeckReady = function(e, data) {
    //console.log('DECK READY', data);
    var decksReady = true;
    $.each(this.decks, function(idx, obj) {
      if(!obj.deck.ready) decksReady = false;
    });

    if(decksReady) {
      $(this).trigger('mixerReady');
    }
  };

  Mixer.prototype._onDeckStart = function(e) {
    //console.log(e.target);
    this._updateSidebar(e.target.track);
  };

  Mixer.prototype._onDeckStop = function(e) {
    //console.log(e.target);
    var self = this;
    randomTrack(function(track) {
      self.decks[e.target.deckId].deck.loadVinyl(track);
    });
  };

  Mixer.prototype._onDeckEnding = function(e) {
    var fromIdx = e.target.deckId;
    var toIdx = (fromIdx == (this.decks.length - 1)) ? 0 : (fromIdx + 1);
    this.crossfade(fromIdx, toIdx);
  };

  window.Mixer = Mixer;

  function randomTrack(callback) {
    $.getJSON('/api/tracks/random', function(data) {
      callback(data);
    });
  }

}(window, jQuery));
