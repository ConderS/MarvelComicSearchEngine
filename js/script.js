const PUBLIC = 'e2ffbd228400b493187c70c06bee9e35';
const PRIVATE = '4742aacfec7c49699f9280b9c4d1f6055ff8c3d0';
const BASE_URI = `https://gateway.marvel.com/v1/public/comics`;

var showingComics = false;
var charactersMap = new Map();
var page = 0;

function removePageElements() {
  $(".char").remove();
  $(".no-result-container").remove();
  $(".buttons-container").remove();
  $(".loading").remove();
  $(".loading-container").hide();

  $(".submit-button").removeAttr("disabled");
}

function showError(msg) {
  removePageElements();
  charactersMap.clear();

  var noResultMsg =
  `<div class="no-result-container">
    <p class="no-result server-error mdl-card__title-text">
      ${msg}
    </p>
   </div>`;
  $("#results").append(noResultMsg);
}

function createComicPromise(comics) {
  const comicPromiseIDsWithCharacters = comics.filter(comic => {
    if (comic.characters.available > 0) {
      return true;
    }
    return false;
  }).map(comic => {
    return new Promise((resolve, reject) => {
      const ts = Date.now().toString();
      const hash = md5(ts+PRIVATE+PUBLIC);
      $.ajax({
        url: `${BASE_URI}/${comic.id}/characters?apikey=${PUBLIC}&ts=${ts}&hash=${hash}`,
        type: "get",
        success: function(response) {

          charArray = response.data.results;

          for(var i = 0; i < response.data.results.length; i++) {
            const character = charArray[i];

            if (charactersMap.has(character.name)) {
              continue;
            }

            const characterInfo = {
              name: character.name,
              description: character.description
            }

            if ("path" in character.thumbnail && character.thumbnail.path !== "") {
              characterInfo.thumbnail = character.thumbnail.path;
              characterInfo.thumbnailExt = character.thumbnail.extension;
            } else {
              characterInfo.thumbnail = "";
              characterInfo.thumbnailExt = "";
            }

            charactersMap.set(character.name, characterInfo);
          }
          resolve(charactersMap); // doesn't actually matter what we resolve with here
        },
        error: function(error) {
          showError("A server error has occurred. Please reload the page and try again.");
        }
      })
    });
  });

  return comicPromiseIDsWithCharacters;
}

function showComics() {
  removePageElements();

  const charsArr = Array.from(charactersMap).sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  console.log(charsArr);

  // Render buttons
  var buttons =
    `<div class="buttons-container">
        <button id="back" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
          <i class="material-icons">arrow_back</i>
        </button>

        <button id="forward" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
          <i class="material-icons">arrow_forward</i>
        </button>
      </div>`;

  $("#results").before(buttons);

  addListenerToButtons();

  // Render results
  for(var i = (page * 10); i < charsArr.length; i++) {
    if (i >= (page*10 + 10)) {
      continue;
    }
     const character = charsArr[i][1];

     var description =
      character.description ?
      character.description : "No description available";

     var characterCard =
     `<div class="char mdl-cell mdl-cell--2-col">
       <div class="demo-card-square mdl-card mdl-shadow--2dp">
         <div class="mdl-card__title mdl-card--expand">
          <img class="char-img char-img-${i}" src="img/image-not-found.png" />
         </div>
         <div class="char-img-text-container">
          <h2 class="char-img-text mdl-card__title-text">${character.name}</h2>
         </div>
         <div class="char-supporting-text mdl-card__supporting-text">
           ${description}
         </div>
       </div>
     </div>`;
     $("#results").append(characterCard);

     if (character.thumbnail !== "") {
       const path =
        character.thumbnail +
        "/landscape_large" +
        "." + character.thumbnailExt;

       // $(`.char-img-${i}`).css('background-image', 'url(' + path + ')');
       $(`.char-img-${i}`).attr("src", path);
     } else {
       // $(`.char-img-${i}`).css('background-image', 'url(img/image-not-found.png)');
       $(`.char-img-${i}`).attr("src", "img/image-not-found.png");
     }
  }

  // if (!showingComics) {
  //   showingComics = true;
  // }
}
function getComics(query){
  console.log("Query sent...");
   $.ajax({
      url: query,
      type: "get",
      success: function(response) {
        console.log("Response: ", response);
        const comics = response.data.results;

        const comicPromiseIDsWithCharacters = createComicPromise(comics);

        Promise.all(comicPromiseIDsWithCharacters).then(charactersArr => {
          console.log("Characters Arr: ", charactersMap);

          // $(".char").remove();
          // $(".no-result-container").remove();
          // $(".buttons-container").remove();
          page = 0;

          if (charactersMap.size === 0) {
            showError("No characters found! Try a different search.");
            return;
          }
          $(".submit-button").removeAttr("disabled");
          showComics();
        });
     },
     error: function(error) {
       console.log(error);
       showError("A server error has occurred. Please reload the page and try again.");
     }
   });
}

function addListenerToButtons() {
  document.getElementById('forward').click(function () {
    console.log("Paginating forward");

    if (page < charactersMap.size()) {
      page++;
    } else {
      removePageElements();
      showError("No more characters to show! Go back to previous pages or start a new search.");
    }

    showComics();
  });
}

function showLoading() {
  removePageElements();

  $(".loading-container").show();
}

$(document).ready(function() {
  $(".loading-container").hide();

  document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const ts = Date.now().toString();
    const hash = md5(ts+PRIVATE+PUBLIC);

    const COMICS_BASE_URI = `https://gateway.marvel.com/v1/public/comics?apikey=${PUBLIC}`;

    var query = `${COMICS_BASE_URI}&ts=${ts}&hash=${hash}`;
    const title = document.getElementById('title-input').value;
    const titleStartsWith = document.getElementById('titlestartwith-input').value;
    const startYear = document.getElementById('startyear-field').value;
    const format = document.getElementById('startyear-field').value;
    if (title) {
      query += `&title=${title}`;
    }

    if (titleStartsWith) {
      query += `&titleStartsWith=${titleStartsWith}`;
    }

    if (startYear) {
      query += `&startYear=${startYear}`;
    }

    if (format) {
      query += `&format=${format}`;
    }

    charactersMap.clear();
    showLoading();
    $(".submit-button").attr("disabled", "disabled");
    getComics(query);
}, false);
});
