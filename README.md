# Features
![[Features.base#ProjectView]]
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
- [ ] User can search data using terms.
- [x] User can search data using preferred categories.
- [ ] Cohesive design system
- [x] Animations and transitions
- [ ] User is able to leave error state
- [ ] 90+ Score on Lighthouse
## About Project
---
### Technologies Used
Next.js, React, Redux
### Concept
This project is attempting to make the upvote and downvote system within Reddit a more inter grill part of the user experience through forcing the user to either upvote or downvote a post through the use of tinder like swipe features. Posts will be in a card format,
### Wireframes

### Features
#### GetRedditPosts
Using the Reddit [JSON API](https://github.com/reddit-archive/reddit/wiki/JSON) to get the posts, these post will be by default from the **trending** section of read it on application start up, but users will be able to select from popular categories, and search for post using terms.
#### [[CardSwipe]]
The card swipe is the iconic tinder interaction that will be implemented to enable users to interact with the application. I originally tried to implement this with transform by calculating the delta between the mouse starting position on clicking the card and the mouse position of where the user dragged their mouse too. This does work and the card does animate to the location of the mouse be the performance of the application is not acceptable. To improve this I will instead be using animation paths to animate the card on a specific animation path to make the animation more consistent, and improve the performance of the application.
#### [[CardUpVote]]
This function is activated either through a user swiping a card in to the right, or through pressing the upvote button. This dispatches the upvote action to Redux to append the post to the `upvotedCards` object in the `cardSlice` and remove the post from the `cards` object. 
#### [[CardDownVote]]
This function is activated either through a user swiping a card to the left, or through pressing the downvote button. This dispatches the downvote action to Redux to append the post to the `downvotedCards` object in the `cardSlice` and the post from the `cards` object. 
### [[Reddit API]]
The following features are all related to the Reddit API.
#### Post Pagination
This function enables users to get new posts when the application calls the Reddit API for more posts, rather than getting the same posts every time.
#### [[Change Post Category]]
This function enables the user to get posts from a popular category
#### Searching Post and categories
This function enables users to search for specific posts, and posts in a specific category.
#### Leaving Error State
This enables users to leave a specific error state.
### Future Work
