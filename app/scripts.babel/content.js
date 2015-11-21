'use strict';

class FSAModule {
  constructor() {

    // const item = document.querySelector('.details .name');

    // const currentRestaurantName = item.innerHTML;
    // const currentTown = document.querySelector('#postcode').innerHTML;

    const currentRestaurantName = '^';
    const currentTown = Array.prototype.map.call(
        document.querySelectorAll('#street, #postcode'),
        (node) => { return node.textContent; });

    this.apiEndpoint = `http://ratings.food.gov.uk/search/en-gb/${currentRestaurantName}/${currentTown.join(', ')}/json`;
  }

  insertScores(rating) {
    let scoreNode = document.createElement('div');
    scoreNode.setAttribute('id', 'hygieneRating');
    let imageSrc = '/images/';
    let image = document.createElement('img');
    image.setAttribute('src', chrome.extension.getURL(imageSrc + `${rating}.jpg`));
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

  renderContent(node) {
    const ratingArea = document.querySelector('.ratings');
    ratingArea.appendChild(node);
  }

  query() {

    fetch(this.apiEndpoint)
      .then((result) => { return result.json(); })
      .then((body) => {
        const itemCount = parseInt(body.FHRSEstablishment.Header.ItemCount);
        if(itemCount === 1) {
          const result = body
            .FHRSEstablishment
            .EstablishmentCollection
            .EstablishmentDetail;

          this.insertScores(result.RatingKey, result.Scores);
        } else if(itemCount > 1) {
          const result = body
            .FHRSEstablishment
            .EstablishmentCollection
            .EstablishmentDetail[0];

          this.insertScores(result.RatingKey, result.Scores);
        } else {
          let warningNode = document.createElement('h3');
          warningNode.textContent = 'No food hygiene data available.';

          this.renderContent(warningNode);
        }
      })
      .catch((err) => {
        console.error(err);
      });

  }
}

const fsa = new FSAModule();
fsa.query();
