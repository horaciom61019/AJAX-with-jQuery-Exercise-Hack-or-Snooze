"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  //Calls getStories() from models.js
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  // if a user is logged in, show favorite/not-favorite star
  const showStar = Boolean(currentUser);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handle submitting new story form. */
async function submitNewStory (evt){
  console.debug("submitNewStory");
  evt.preventDefault();

  //Gets all the info about the story from Form
  const author = $("#create-author").val();
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const username = currentUser.username;
  const storyData = {author, title, url, username};

  // Calls addStory() from models.js
  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  // prepends story at the beginning of the StoryLists.
  $allStoriesList.prepend($story);

  // Hides and resets form
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
};

$submitForm.on("submit", submitNewStory);

/** Add fav/not-fav star to story */
function getStarHTML(story, user){
  // isFavorite() called from models.js
  const isFav = user.isFavorite(story);
  const starType = isFav ? "fas" : "far";
  
  return `
    <span class="star">
      <i class="${starType} fa-star"></i>
    </span>
  `
}

// Creates a favorite story list and adds it to the page
function putFavoritesListOnPage(){
  console.debug("putFavoritesListOnPage");

  $favoritedStories.empty();

  if (currentUser.favorites.length === 0){
    $favoritedStories.append("<h5>No favorites added!</h5>");
  }
  else {
    // Loops through fav stories and creates html
    for (let story of currentUser.favorites){
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    };
  };

  $favoritedStories.show();
};

/** favorite/un-favorite a story */
async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(evt.target);
  // Gets the story on the li
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  // Using the li's id, searches for story
  const story = storyList.stories.find(s => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    // removeFavorite() is called from models.js
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite, favorite story. 
    // addFavorite() called from models.js
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);


/** Creates delete button HTML for story */

function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

/** Handle deleting a story. */

async function deleteStory(evt) {
  console.debug("deleteStory");

  // Gets the story on the li
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  // removeStory() called from models.js
  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  await putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);

/******************************************************************************
 * Functionality for list of user's own stories
 */

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    };
  };

  $ownStories.show();
}