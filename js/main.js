"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

/** Story Lists */
const $storiesLists = $(".stories-list");
const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

const $ownStories = $("#my-stories");
const $favoritedStories = $("#favorited-stories");

/** Story submission. Nav.js references these variables to add a new story. */
const $submitForm = $("#submit-form");
const $navSubmitStory = $("#nav-submit-story");

/**  User's forms and profile */
const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $userProfile = $("#user-profile");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");


/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

// Function is called on users.js and nav.js
function hidePageComponents() {
  const components = [
    $allStoriesList,
    $storiesLists,
    $loginForm,
    $signupForm,
    $submitForm,
    $userProfile
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);
