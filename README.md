# Overview
Portfolio project for Codecademys full-stack developer pathway utilising the Reddit API to create a front-end application.
---
## Project Requirements
- [x] Application must use React & Redux
- [x] Version control with Git and host the repository on GitHub
- [x] Use a project management tool to plan my work
- [x] Write a README (using Markdown) that documents the project including: Wireframes, technologies used, features, future work.
- [ ] Unit tests with Jest & React test Library.
- [x] Can be used on any modern browser.
- [ ] User can access application at a URL.
- [x] User can see initial view of data when first visting the site.
- [x] User can search data using terms.
- [x] User can search data using preferred categories.
- [x] Cohesive design system
- [x] Animations and transitions
- [x] User is able to leave error state
- [x] 90+ Score on Lighthouse
## About Project
---
### Technologies Used
![NextJSLogo](Documentation/images/NextjsLogo.png), ![React](Documentation/images/ReactLogo.png), ![Redux](Documentation/images/ReduxLogo.png)
### Concept
This project is attempting to make the upvote and downvote system within Reddit a more inter grill part of the user experience through forcing the user to either upvote or downvote a post through the use of tinder like swipe features. Posts will be in a card format,
### Features
More detailed feature documentation can be found within the Documentation folder.
#### [GetPostsFromRedditAPI](Documentation/GetPostsFromRedditAPI.md)
Using the Reddit [JSON API](https://github.com/reddit-archive/reddit/wiki/JSON) to get the posts, these post will be by default from the **trending** section of read it on application start up, but users will be able to select from popular categories, and search for post using terms.
#### [CardSwipe](Documentation/CardSwipe.md)
The card swipe is the iconic tinder interaction that will be implemented to enable users to interact with the application. I originally tried to implement this with transform by calculating the delta between the mouse starting position on clicking the card and the mouse position of where the user dragged their mouse too. This does work and the card does animate to the location of the mouse be the performance of the application is not acceptable. To improve this I will instead be using animation paths to animate the card on a specific animation path to make the animation more consistent, and improve the performance of the application.
#### [CardUpVote](Documentation/CardSwipe.md#dragging-card)
This function is activated either through a user swiping a card in to the right, or through pressing the upvote button. This dispatches the upvote action to Redux to append the post to the `upvotedCards` object in the `cardSlice` and remove the post from the `cards` object. 
#### [CardDownVote](Documentation/CardSwipe.md#dragging-card)
This function is activated either through a user swiping a card to the left, or through pressing the downvote button. This dispatches the downvote action to Redux to append the post to the `downvotedCards` object in the `cardSlice` and the post from the `cards` object.
### [ChangePostCategory](Documentation/ChangePostCategory.md)
This function enables users to change the category of the posts that they are receiving to one of 4 predefined categoires.
### [RedditPostSearch](Documentation/RedditPostSearch.md)
This function enables users to use a search term for a topic to get posts related to that topic.
### [LeavingErrorState](Documentation/LeavingErrorState.md)
This function enables users to retreat to a safe location within the application if they run into an error state.