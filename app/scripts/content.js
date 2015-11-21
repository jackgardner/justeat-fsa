'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FSAModule = (function () {
  function FSAModule() {
    _classCallCheck(this, FSAModule);

    // const item = document.querySelector('.details .name');

    // const currentRestaurantName = item.innerHTML;
    // const currentTown = document.querySelector('#postcode').innerHTML;

    var currentRestaurantName = '^';
    var currentTown = Array.prototype.map.call(document.querySelectorAll('#street, #postcode'), function (node) {
      return node.textContent;
    });

    this.apiEndpoint = 'http://ratings.food.gov.uk/search/en-gb/' + currentRestaurantName + '/' + currentTown.join(', ') + '/json';
  }

  _createClass(FSAModule, [{
    key: 'insertScores',
    value: function insertScores(rating) {
      var scoreNode = document.createElement('div');
      scoreNode.setAttribute('id', 'hygieneRating');
      var imageSrc = '/images/';
      var image = document.createElement('img');
      image.setAttribute('src', chrome.extension.getURL(imageSrc + (rating + '.jpg')));
      image.setAttribute('style', 'float:right');

      // for(let score in scores) {
      //   let statWrap = document.createElement('div');
      //
      //   let statKey = document.createElement('span');
      //   let statValue = document.createElement('span');
      //
      //   statKey.textContent = score;
      //   statValue.textContent = scores[score];
      //
      //   statWrap.appendChild(statKey);
      //   statWrap.appendChild(statValue);
      //
      //   scoreNode.appendChild(statWrap);
      // }
      scoreNode.appendChild(image);

      this.renderContent(scoreNode);
    }
  }, {
    key: 'renderContent',
    value: function renderContent(node) {
      var ratingArea = document.querySelector('.ratings');
      ratingArea.appendChild(node);
    }
  }, {
    key: 'query',
    value: function query() {
      var _this = this;

      fetch(this.apiEndpoint).then(function (result) {
        return result.json();
      }).then(function (body) {
        var itemCount = parseInt(body.FHRSEstablishment.Header.ItemCount);
        if (itemCount === 1) {
          var result = body.FHRSEstablishment.EstablishmentCollection.EstablishmentDetail;

          _this.insertScores(result.RatingKey, result.Scores);
        } else if (itemCount > 1) {
          var result = body.FHRSEstablishment.EstablishmentCollection.EstablishmentDetail[0];

          _this.insertScores(result.RatingKey, result.Scores);
        } else {
          var warningNode = document.createElement('h3');
          warningNode.textContent = 'No food hygiene data available.';

          _this.renderContent(warningNode);
        }
      }).catch(function (err) {
        console.error(err);
      });
    }
  }]);

  return FSAModule;
})();

var fsa = new FSAModule();
fsa.query();
//# sourceMappingURL=content.js.map
