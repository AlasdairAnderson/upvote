# Feature ChangePostCategory
## Objective
The user should be able to change categories from a set of pre-selected categories and receive cards from that category.
## Background
Currently users only receive posts from the popular section of Reddit. This means that they may be getting content that they are not currently interested in, to ensure that they have the option to browse a cards for a category that they may have more interested in, a selection of categories should be made available for them to choose from. This should help with user retention due to users being able to get more posts for categories that they are interested in.
## Technical Design
### Approach
To implement this feature I want to have a button that when clicked a pop up menu will appear with the different categories that a user should be able to choose from.
The following categories should be made available to users:
- News & Politics: `r/news`
- Funny/Humor: `r/funny`
- Questions/Learning: `r/AskReddit`
- Awe-Inspiring: `r/interestingasfuck`
### Functions:
**`onClick=(setRedditAPIRequest)`**:
On each of the category menu buttons we `setRedditAPIRequest` to the `requestType: 'category'`, `query: 'categoryName'`, `newRequest: true` through `onClick`
```
<button onClick={setRedditAPIRequest({requestType: 'category', query: 'r/funny', newRequest: true})}>Funny</button>
```

**`cardSlice.js newRequest`**:
Though setting `newRequest` to `true` when selecting a new category when adding the posts to the `cards` store are able to reset the `cards` store before adding the cards from the API new request. `newRequest` is then set to `false` once the after the `redditAPIRequest` dispatch so that when needing more posts from the previous request we are able to append the new posts to the existing cards store.
```
if (newRequest){
	state.cards = {};
}
for (const card in cards) {
	const {id} = card;
	state.cards[id] = card;
}
```
### Data Structures
**`redditAPIRequest`**
The redditAPIRequest is an `useState` object that is used to hold information that is used as arguments to the [[Reddit API]]. This object is also used as an `useEffect` dependency array so that then ever it changes we call the Reddit API. This is currently sat within the `cardStack` component, but we will have to raise this to the `page` component so that it can be shared between the `cardStack` and the `menu` components.
The attributes of the `redditAPIRequest` are:
```
{
	requestType: 'string',
	query: 'string',
	newRequest: 'boolean'
}
```
The `requestType` being the parameter used by the Redux thunk to route the request to build the correct parameters the be sent to the API.
`query` is the dynamic information that is to be used by the Redux thunk to build out the API parameters, such as the category that should be fetched or the search query.
`newRequest` is used to determine whether the request being sent to the Reddit API is a change in request type such as a change in category or whether it is the same requestType/query as was previous used to call the API.
**Example:**
When user selects the category **Funny/Humor** the `redditAPIRequest` will be set to the following:
```
{
	requestType: 'category',
	query: `r/funny`,
	newRequest: ture
}
```
### Styling
This category menu should be collapsed and hidden during the normal running of the application, but able to expand to show what categories are available when the category menu Icon is selected.
**`isMenuVisible`**
To enable the toggling of the following styles on the `category-menu` the boolean `useState` `isMenuVisible` is toggled between true and false on the press of the `menu-item-category` button in the general `menu`. This toggles whether the `visible` id is added to the `category-menu` or not.
**`transition`**
To enable a smooth transition between the `visible` and non-`visible` state transition is used with `height`, `opacity`, and `margin` with a 1 second transition time. 
**`height`**
When the `category-menu` does not have the `visible` id, `height` is set to `0`. When the `visible` id is applied the `height` is set to 200px.
**`opacity`**
When the `category-menu` does not have the `visible` id, `opacity` is set to `0`. When `visible` id is applied the `opacity` is set to 100.
**`pointer-events`**
When the `category-menu` does not have the `visible` id, `pointer-events` are set to none, to prevent users from still being able to click any buttons. When `visible` id is applied the `pointer-events` is set to all.
**`overflow-y`**
To prevent items from overflowing the `category-menu` whilst it is collapsing the `overflow-y` is set to `hidden`.
**`anchor`**
To ensure that the `category-menu` is always located over the `menu-item-category` `anchor`, `position-anchor`  are used within the `category-menu` and  `anchor-name` is used within the `menu-item-category` id.
```css
#menu-item-category {
	anchor-name: --category-menu;
}

.category-menu {
	position-anchor: --category-menu;
	bottom: anchor(top);
	lefft: anchor(left);
}
```
### Wire Frames
![CategoryMenu](images/CategoryMenuWireFrame.png)
## Caveats
**Stale Cards**
The current implementation of the Redux Thunk is to append the new posts fetched from Reddit to the back of the card stack object. This works when getting more posts in the same request type, but when selecting a completely new request that a user would like to see, we should remove all of the old cards within the cards store and update it with the cards from the new request type.
This will also have to co-inside with implementing a loading state on the currently showed card to the user as well to show them that we are currently fetching a new set of cards for them, (this will also help with the initial loading of the application.)