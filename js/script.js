// const PUBLIC = 'e2ffbd228400b493187c70c06bee9e35';
// const PRIVATE = '4742aacfec7c49699f9280b9c4d1f6055ff8c3d0';
const PUBLIC = '4a59100a08492e87335d1e3c5dcfa5f9';
const PRIVATE = 'd14dde3c2b39fa1352d59fed07d76cac63cca011';
const BASE_URI = `https://gateway.marvel.com/v1/public/comics`;

var showingComics = false;
var page = 0;
var globalCharsArr = [];

function removePageElements() {
  $(".char").remove();
  $(".no-result-container").remove();
  $(".buttons-container").remove();
  $(".loading").remove();
  $(".loading-container").hide();

  $(".submit-button").removeAttr("disabled");
}

function removePageElementsKeepButtons() {
  $(".char").remove();
  $(".no-result-container").remove();
  $(".loading").remove();
  $(".loading-container").hide();

  $(".submit-button").removeAttr("disabled");
}

function showError(msg) {
  removePageElements();

  var noResultMsg =
  `<div class="no-result-container">
    <p class="no-result server-error mdl-card__title-text">
      ${msg}
    </p>
   </div>`;
  $("#results").append(noResultMsg);
}

function showErrorWithButtons(msg) {
  removePageElementsKeepButtons();

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
    const storedCharacter = JSON.parse(localStorage.getItem(comic.id));
    if (storedCharacter) {
      // Depending on if we still use global map, must iterate through comic characters
      // to store in global storage Map
      // console.log("Found stored character: ", storedCharacter);
      // return storedCharacter;
    }

    return new Promise((resolve, reject) => {
      const ts = Date.now().toString();
      const hash = md5(ts+PRIVATE+PUBLIC);
      $.ajax({
        url: `${BASE_URI}/${comic.id}/characters?apikey=${PUBLIC}&ts=${ts}&hash=${hash}&orderBy=name`,
        type: "get",
        success: function(response) {

          charArray = response.data.results;

          if (charArray.length < 1) {
            localStorage.setItem(comic.id, null); // don't know how to take advantage of this
            return null;
          }
            const character = charArray[0];

            const characterInfo = {
              name: character.name,
              description: character.description,
              comicTitle: comic.title,
              comicIssueNumber: comic.issueNumber,
              comicFormat: comic.format,
            }

            if ("path" in character.thumbnail && character.thumbnail.path !== "") {
              characterInfo.thumbnail = character.thumbnail.path;
              characterInfo.thumbnailExt = character.thumbnail.extension;
            } else {
              characterInfo.thumbnail = "";
              characterInfo.thumbnailExt = "";
            }

            // Map comic id to the object containing the first alphabeticized
            //  character of the comic
            localStorage.setItem(comic.id, JSON.stringify(characterInfo));

          resolve(characterInfo); // doesn't actually matter what we resolve with here
        },
        error: function(jqXHR, textStatus, errorThrown) {
          var msg = "A server error has occurred. Please reload the page and try again.";
          if (jqXHR.status === 429) {
            msg = "Too many requests have been sent with this API key. Wait one day to try again.";
          }
          showError(msg);
        }
      })
    });
  });

  return comicPromiseIDsWithCharacters;
}

function addListenerToButtons() {
  $('#forward').click(function () {

    page++;

    console.log(globalCharsArr);
    console.log(page);
    showComics();

    if (((page+1)*10) > (globalCharsArr.length-1)) {
      $('#forward').attr('disabled', 'disabled');
    }
  });

  $('#backward').click(function () {

    page--;
    if (page < 0) {
      page = 0;
      $('#backward').attr('disabled', 'disabled');
    }

    showComics();
  });
}

function addButtons() {
  // Render buttons
  var buttons =
    `<div class="buttons-container">
        <button id="backward" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
          <i class="material-icons">arrow_back</i>
        </button>

        <p id="page-num">${page+1}</p>

        <button id="forward" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
          <i class="material-icons">arrow_forward</i>
        </button>
      </div>`;

  $("#results").before(buttons);

  if (page === 0) {
    $('#backward').attr('disabled', 'disabled');
  }
  if (((page+1)*10) > (globalCharsArr.length-1)) {
    $('#forward').attr('disabled', 'disabled');
  }
}

function showComics() {
  removePageElements();
  const charsArr = globalCharsArr;

  addButtons();
  addListenerToButtons();

  // Render results
  for(var i = (page * 10); i < charsArr.length; i++) {
    if (i >= (page*10 + 10)) {
      continue;
    }
     const character = charsArr[i];

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
          <p class="char-comic-text char-comic-top mdl-card__supporting-text">
          ${character.comicTitle}
          </p>
          <p class="char-comic-text mdl-card__supporting-text">
          ${character.comicFormat}
          </p>
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
        const comics = response.data.results;

        const comicPromiseIDsWithCharacters = createComicPromise(comics);

        Promise.all(comicPromiseIDsWithCharacters).then(charactersArr => {
          globalCharsArr = charactersArr;
          page = 0;

          if (charactersArr.length === 0) {
            showError("No characters found! Try searching for different comics or changing the search filters.");
            return;
          }
          $(".submit-button").removeAttr("disabled");
          showComics();
        });
     },
     error: function(jqXHR, textStatus, errorThrown) {
       var msg = "A server error has occurred. Please reload the page and try again.";
       if (jqXHR.status === 429) {
         msg = "Too many requests have been sent with this API key. Wait one day to try again.";
       }
       showError(msg);
     }
   });
}

function showLoading() {
  removePageElements();

  $(".loading-container").show();
}

$(document).ready(function() {
  $(".loading-container").hide();
  $(".adv-container").hide();

  $('#switch-1').change(function() {
    if (this.checked) {
      $('.search-label').text('Title matches...');
    } else {
      $('.search-label').text('Title starts with...');
    }
  });

  $('.adv-button').click(function() {
    if($('.adv-container').css('display') === 'none') {
      $('.adv-container').show();
      $('.adv-button').text('Less Search Criteria');
    } else {
      $('.adv-container').hide();
      $('.adv-button').text('More Search Criteria');
    }
  });

  document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const ts = Date.now().toString();
    const hash = md5(ts+PRIVATE+PUBLIC);

    const COMICS_BASE_URI = `https://gateway.marvel.com/v1/public/comics?apikey=${PUBLIC}`;

    var query = `${COMICS_BASE_URI}&ts=${ts}&hash=${hash}`;
    const titleStartsWithOrTitle = document.getElementById('titleStartWith-input').value;
    const startYear = document.getElementById('startYear-field').value;
    const format = document.getElementById('format-select').value;
    const orderBy = document.getElementById('orderby-select').value;
    const orderByVal = $('input[name=orderby-rad]:checked').val();

    if (titleStartsWithOrTitle) {
      if ($('#switch-1').is(':checked')) {
        query += `&title=${titleStartsWithOrTitle}`;
      } else {
        query += `&titleStartsWith=${titleStartsWithOrTitle}`;
      }
    }

    if (startYear) {
      query += `&startYear=${startYear}`;
    }

    if (format) {
      query += `&format=${format}`;
    }

    if (orderBy) {
      var order = "";

      if (parseInt(orderByVal) === 0) {
        order="-";
      }
      query += `&orderBy=${order}${orderBy}`
    }

    console.log("Query: ", query);
    showLoading();
    $(".submit-button").attr("disabled", "disabled");
    getComics(query);
}, false);
});
