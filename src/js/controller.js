import * as model from './model.js';
import { UPLOAD_FORM_TIMEOUT_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import { API_URL } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// if (module.hot) {
//   // not JS, coming from parcel
//   module.hot.accept();
// }

const recipeContainer = document.querySelector('.recipe');

// async/await API call for given recipe ID
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // have to make sure the bookmarks are already rendered before updating them, by rendering on page load in init()

    // 1) load recipe -- loadRecipe is also async fn so it returns a promise that must be handled, resolved promise does not return anything tho, just updates state
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 2) render recipe with recipeView, passing in data from state
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1. get search query
    const query = searchView.getQuery();
    if (!query || query === '') {
      return;
    }

    // 2. load search results
    await model.loadSearchResults(query);

    //3. render results
    resultsView.render(model.getSearchResultsPage(1));
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // render new search results with passed in page number
  resultsView.render(model.getSearchResultsPage(goToPage));
  // render updated pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings (in the state)
  model.updateServings(newServings);
  console.log(model.state.recipe);

  // update the recipe view - render recipe again, but this is a strain on the browser, so we need an update method that only updates text in DOM that changes instead of the whole markup pics and all
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 2) update recipe view to show correct state of icon
  recipeView.update(model.state.recipe);
  //3) render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // render loading spinner
    addRecipeView.renderSpinner();
    // upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //render success message
    addRecipeView.renderMessage();

    //render the upload form again (since renderMessage clears parentElement html) so form can be used again -- this application of render doesn't actually need any data since the form doesnt change, but render expects data and won't work with no arguments
    setTimeout(function () {
      addRecipeView.render(model.state);
    }, (UPLOAD_FORM_TIMEOUT_SEC + 1) * 1000);

    // render new bookmark
    bookmarksView.render(model.state.bookmarks);

    //change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close upload form after short time (to allow for success message)
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, UPLOAD_FORM_TIMEOUT_SEC * 1000);
  } catch (err) {
    console.error(`💩 ${err.message}`);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
