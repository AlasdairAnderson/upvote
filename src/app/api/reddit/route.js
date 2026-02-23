
export async function GET(request) {
    try{
        const searchParams = request.nextUrl.searchParams;
        const path = searchParams.get("path") || "r/popular.json";
        const after = searchParams.get("after") || null;
        const q = searchParams.get("q") || null;
        const queries = new URLSearchParams({
            "raw_json": "1",
            "count": "25"
        })

        if(after && after != "null"){
            queries.append("after", after);
        }
        if(q && q != "null"){
            queries.append("q", q);
        }
        console.log(`https://www.reddit.com/${path}?${queries.toString()}`);
        const response = await fetch(`https://www.reddit.com/${path}?${queries.toString()}`, {
            headers: {
                "User-Agent": "web:upvote/v0.1.0 (by /u/dair661)",
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
                throw new Error(`Reddit API error: ${response.status} for path https://www.reddit.com/${path}?${queires.toSting()} - ${respText}`)
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