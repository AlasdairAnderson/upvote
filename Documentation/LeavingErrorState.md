# Feature LeaveErrorState
## Objective
Users must be able to leave the various error states that they might find themselves in whilst using the application.
## Background
Users are currently unable to exit error states whenever they occur within the application, this could be through Reddit returning an error itself or it could be through there being no cards being returned from Reddit. 
## Technical Design
### Approach
Errors coming back from Reddit are currently tracked through the Redux thunk, as subscribed to within the `cardStack` component. With a plain "There was an error" message being displayed on the screen. I would like to move the visual of the error to a card to keep the design of the application cohesive as well as have the possibility to provide more information about the error to the user in the future.
### Functions:
#### Setting Error Structure
To be able to hand down the error card content identified bellow an object will have to be built at the `cardStack` component which will replace what would have been handed down by the `activeCard`.
#### `contentType`
Through passing the information about the error through the same data structure as a usual Reddit post we can utilise the `contentType` functions switch statement which returns HTML based on the type of content that the post has allocated to it. Through doing this we can keep the card dynamic in who it serves these sub components, but we can also add a case for an error, were we card provide information about the error, whilst providing a button that the user can select to get out of the error state through going back to the popular category.
```js
switch (content.type) {
	case 'image':
		return(<img loading="lazy" referrerPolicy="no-referrer" data-testid={'image'} className="card__content" src={content.content}></img>);
		break;
	case 'video':
		return (<video data-testid={'video'} className="card__content" controls loop autoPlay={true}><source src={content.content} type="video/mp4"/> Your browser does not support the video tag </video>);
		break;
	case 'text':
		return(<p data-testid={'text'} className="card__content">{content.content}</p>);
		break;
	case 'error':
		return(
			<p className="card_contnet">{content.content}</p>
			<button onClick={() => setRedditAPIRequest({requestType: 'popular', query: '', newRequest: true})}>return to safety</button>
		)
	default:
		return(<p data-testid={'no content'} className="card__content">Content Type Not Supported</p>);
}
```
#### `setRedditAPIRequest`
To enable the user to get posts from an area were we know that they can get post from we need to had the `setRedditAPIRequest` function down to the `Card` component.
### Data Structures
#### Reddit Post Card Content
The data that is handed down to the card component when it is provided a post from Reddit is the following:
``` js
const card = {
	id: 'id String',
	upvotes: int,
	downvotes: int,
	num_comments: int,
	title: 'string',
	post_content: {
		content : 'post url' || 'post text',
		type :'string of post type'
	}
}
```
#### Error Card Content
The data that will be handed down to the card component when an error is encounter
``` js
const card = {
	id: 'error code',
	upvotes: 0,
	downvotes: 0,
	num_comments: 0,
	title: 'An error has occured',
	post_content: {
		content: 'Error message',
		type: 'error'
	}
}
```