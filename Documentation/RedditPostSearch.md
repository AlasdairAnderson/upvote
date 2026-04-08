# Feature RedditPostSearch
## Objective
Users must be able to search specific terms and get posts back relating to them.
## Technical Design
### Functions:
**`handleFormSubmit`:**
This function handles what happens when the user submits what they have inputted into the text input.
First we `preventDefault()` for the form submission to prevent the page from refreshing. 
Then we check if the users actually input any data.
If they have then we set the `setRedditAPIRequest` to `{requestType: 'search', query: searchTerm, newRequest: true}`
We the `setSearchTerm` to be `""` to remove the input that the user put into the text input, and we `setSearchIsVisible` to false.
If the user has not input any information into the text field then we `console.log` that there is `No search input`.
### Data Structures
We have 2 `useState` variables to track the current search state within the app.
**`searchIsVisible`**: Set initially to `false` and gets inverted when the users clicks on the search icon.
**`searchTerm`:** Set initially to `""` this gets set to the current information held within the text input `onChange` so that we have the latest information for what the user inputted. If there is information held within this variable then it used as the `query` within the `redditAPIRequest`.