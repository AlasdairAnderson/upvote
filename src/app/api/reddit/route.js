
export async function GET(request) {
    try{
        const searchParams = request.nextUrl.searchParams;
        const path = searchParams.get("path") || "r/popular.json?";

            const response = await fetch(`https://www.reddit.com/${path}&raw_json=1`, {
                headers: {
                    "User-Agent": "web:upvote/v0.1.0 (by /u/dair66)",
                    "Accept": "application/json",
                    "Accept-Language": "en-US"
                }
            });
        
        if(!response.ok) {
                const respText = await response.text();
                const headers = Object.fromEntries(response.headers.entries());
                console.error('RedditAPI proxy error: non-OK response', {
                    status: response.status,
                    statusText: response.statusText,
                    headers,
                    body: respText
                });
                throw new Error(`Reddit API error: ${response.status} for path https://www.reddit.com/${path}&raw_json=1 - ${respText}`)
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('RedditAPI proxy error: ', error);
        return new Response(JSON.stringify({error: error.message }), {
            status: 500,
        });
    }
}