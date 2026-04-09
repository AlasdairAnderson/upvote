# Feature GetPostsFromRedditAPI
## Objective
Understand the current Reddit API implementation, to ensure that the correct information is being fetched and captured when trying to make different API calls.
## Background
There are two Reddit API's available to use:
### [**JSON API:**](https://github.com/reddit-archive/reddit/wiki/JSON)
The JSON API can be used to interact with the endpoints of Reddit that do not require Oath.
This does come with the limitation that we can not perform any write operations.
To use the JSON API we have to add `.json` to the end of a URL to get JSON returned to us.
**Example:**
```
// Origional HTMl
https://www.reddit.com/r/popular/
// JSON URL
https://www.reddit.com/r/popular.json
```
The `.json` must be added just before the start of the query string.
```
//Origional URL
https://www.reddit.com/search?q=cake%20recipes
//JSON URL
https://www.reddit.com/search.json?q=cake%20recipes
```
### [**Official API**](https://www.reddit.com/dev/api)

### **Limits**
As of July 01 2023, free use of Reddit APIs is limited to 10 queries per minute. If you are hitting the rate limits, subsequent queries may fail until the timer resets.
### **Returned Data**

### **Pagination**
Many endpoints on Reddit use the same protocol for controlling pagination and filtering. These endpoints are called Listings and share five common parameters:
`after`/`before`:
Only one should be specified. These indicate the **full name** of an item in the listing to use as the anchor point of the slice.
`limit`:
The maximum number of items to return in this slice of the listings.
`count`:
The number of items already seen in this listing. On the html site, the builder uses this to determine when to give values for `before` and `after` in the response.
`show` - (optional):
If `all` is passed, filters such as "hide links that I have voted on" will be disabled.
`raw_json=1`:
This is passed as a query to all fetches to the Reddit API as without it Reddit return "HTML Escaped" strings which would break image URLs.

To page through a listing, start by fetching the first page without specifying values for `after` and `count`. The response will contain an `after` value which you can pass in the next request. It is a good a idea, but not required, to send an updated value for `count` which should be the number of items already fetched.

## Technical Design
### Approach
To enable the pagination of posts and to enable the future extension of requests to the Reddit API, when getting calling categories or searched posts, the capture of queries and paths will be done dynamically through using `URLSeachParams()` in `cardSlice.js` and `route.js`.
The approach enables us to build an URL object that we can use to build URLs that we can hand to the application API and then to the Reddit API, without having to try and hard code in string interpolation for different requests.
### Functions:
`let queryParams = new URLSearchParams();`
This creates a new `URLSearchParams` object that we can use to build out our URL.
`queryParams.set(key, value);`
Using the `.set()` method enables us to set and change a key value pair that we will use to build out the query sting within the URL.
`queryParams.append(key, value);`
Using the `.append()` method appends additional key value pairs to the end of the `URLSeachParams` object.
`.toString()`
Transforms the `URLSearchParams` object into a string that automatically inserts `&` in between the key/value pairs.
`nextURL.searchParams`
This is used to build a `searchParams` object that hold information about the URL that was passed to the endpoint.
`searchParams.get()`
This method is used on the `searchParams` object and returns the value for a passed query key. 
### Data Structures
The `URLSearchParams` data structure is built dynamically through the use of the `.set` and `.append` methods depending on the `redditAPIRequest.requestType` that is handed to the Redux Thunk, as well as if there is an `after` property in `listingData`. Through the dynamic building of the query string search parameters we can ensure that only the information that needs to be passed to the Reddit API gets passed within the URL, preventing some potential errors by passing parameters that do not need to be used.
### API's
`/api/reddit?{query string}`
Within the Redux Thunk me pass the `path`, `q` (if path is a search), `after` (if after property in `listData` exists) as a query string to the `api/reddit` endpoint so that it this information can be used to build the URL that will be sent to the Reddit API.
`https://www.reddit.com/{path}?{queries}`
The information that was passed through the `api/reddit` endpoint is allocated to variables so that they can be used to either specify the `path` or used to build the query string using `URLSearchParams`.
### Tests
## Caveats
1. **Implicit String Conversion:** `URLSearchParams` converts all values (like `null` or `undefined`) to strings (`"null"`,`"undefined"`). Logical checks must be performed before appending to avoid sending junk data to the Reddit API.
2. **Rate Limiting:** Because our application acts as a proxy, multiple users hitting out `/api/reddit` endpoint will share the same "10 queries per minute" pool relative to Reddit's servers.
3. **Encoding:** `URLSearchParams` automatically handles percent-encoding for special characters (like spaces or slashes). Developers should not manually encode strings before passing them to the `.set()` or `.append()` methods.
## Error Handling
If Reddit API returns with error this should be handled by the `hasError` state in the Redux Thunk.
### `429`
When Reddit API returns a 429 error the UI should show the user that they have hit a the rate limit for the API and that it will reset in 10 minutes.
## Tests
1. **Initial Load:** Verify the request to `/api/reddit` does not contain an `after` parameter.
2. **Pagination:** Verify that after the first fetch, the second request to `/api/reddit` correctly includes the `after` token from the Redux store.
3. **Search Integrity:** Verify that a search for "Space News" is encoded as `q=Space+News` or `q=Space%20News` in the final Reddit URL.