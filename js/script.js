// Wraps repository within IIFE
const pokemonRepository = (function () {
const repository = [];

// Creates variable for index 'ul' with pokemonList
const $pokemonList = $("ul");
const $modalContainer = $("#modal-container");
const apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150';";

// Adds new Pokemon to var repository
function add(pokemon) {
repository.push(pokemon);
}

// Function used to return Pokemon object array
function getAll() {
return repository;
}

// Function to search repository for Pokemon
function search(searchName) {
repository.filter(function (pokemon) {
if (pokemon.name === searchName) {
return pokemon;
}
});
}

// Create a function 'addListItem' for each Pokemon object


function addListItem(pokemon) {
const pokemonList = $('.list-group');

const listItem = $('<li class="list-group-item"></li>');

$(pokemonList).append(listItem);

const btn = $(
'<button class="btn" data-toggle="modal" data-target="#PokeModal"></button>'
);

$(btn).text(pokemon.name);

$(listItem).append(btn);

btn.on('click', function() {


showDetails(pokemon);
});
}

// Function to show details of each Pokemon
function showDetails(pokemon) {
pokemonRepository.loadDetails(pokemon).then(function () {
showModal(pokemon);
});
}

// Loading data from an external API
function loadList() {
  return $.ajax(apiUrl, { dataType: "json" })
    .then(function(item) {
      $.each(item.results, function(index, item) {


const pokemon = {
name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
detailsUrl: item.url
};
add(pokemon);
});
}).catch(function (e) {

console.error(e);
})
}

// Load details of each Pokemon when clicked
function loadDetails(item) {
const url = item.detailsUrl;

  return $.ajax(url).then(function (details) {

item.imageUrl = details.sprites.front_default;
item.height = details.height;
item.weight = details.weight;
item.types = Object.keys(details.types);
if (details.types.length == 2) {
item.types = [details.types[0].type.name, details.types[1].type.name];
} else {
item.types = [details.types[0].type.name];
}
}).catch(function (e) {
console.error(e);
});
}

// Function to show modal for Pokemon data
function showModal(item) {

  $modalContainer.html("");
  const $modal = $('<div class="modal"></div>');

  const $nameElement = $("<h3>");
  $nameElement.html(item.name.charAt(0).toUpperCase() + item.name.slice(1));

  const $imageElement = $('<img src="' + item.imageUrl + '">');
  $imageElement.addClass("modal-img");

  const $heightElement = $("<p>Height: " + item.height + "</p>");

  const $weightElement = $("<p>Weight: " + item.weight + "</p>");

  const $typesElement = $("<p>Type(s): " + item.types + "</p>");

  const $closeButtonElement = $(
    '<button class="modal-close">"Close"</button>'
  );

  $closeButtonElement.on("click", function() {
    hideModal();
  });

  $modal.append($nameElement);
  $modal.append($imageElement);
  $modal.append($heightElement);
  $modal.append($weightElement);
  $modal.append($typesElement);
  $modalContainer.append($modal);
  $modal.append($closeButtonElement);

  $modalContainer.addClass("is-visible");
}


// Function to close the modal
function hideModal() {
$modalContainer.removeClass('is-visible');
}

// Press escape key to close modal
$(document).on("keydown", function(e) {
if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
hideModal();
}
});

// Click outside of the modal to close the modal
$modalContainer.on("click", function(e) {

var target = e.target;
if (target === $modalContainer) {
hideModal();
}
});

// return all data
return {
add: add,
getAll: getAll,
addListItem: addListItem,
search: search,
showDetails: showDetails,
loadList: loadList,
loadDetails: loadDetails,
showModal: showModal,
hideModal: hideModal
};
})();

// forEach Used To cycle through addListItem function properties
pokemonRepository.loadList().then(function() {
pokemonRepository.getAll().forEach(function(pokeList) {
pokemonRepository.addListItem(pokeList);
});
});
