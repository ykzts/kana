export type Thumbnail = {
  height: number
  url: string
  width: number
}

export type Channel = {
  id: string
  thumbnails: {
    [key: string]: Thumbnail
  }
  title: string
}

export async function getChannelById(id: string): Promise<Channel> {
  const apiUrl = new URL('https://www.googleapis.com/youtube/v3/channels')
  apiUrl.searchParams.set('id', id)
  apiUrl.searchParams.set('key', process.env.GOOGLE_API_KEY!)
  apiUrl.searchParams.set('part', 'snippet')

  const response = await fetch(apiUrl.toString())
    .then(response => response.json())
    .catch(() => null)

  if (!response || response.items.length < 1)
    throw new TypeError('The channel was not found.')

  const [item] = response.items

  return {
    id,
    thumbnails: item.snippet.thumbnails,
    title: item.snippet.title
  }
}

export type Video = {
  id: string
  title: string
}

export async function* getVideosByChannelId(
  id: string
): AsyncIterableIterator<Video> {
  let pageToken = ''

  while (true) {
    const apiUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    apiUrl.searchParams.set('channelId', id)
    apiUrl.searchParams.set('key', process.env.GOOGLE_API_KEY!)
    apiUrl.searchParams.set('maxResults', '50')
    apiUrl.searchParams.set('order', 'date')
    apiUrl.searchParams.set('pageToken', pageToken)
    apiUrl.searchParams.set('part', 'snippet')
    apiUrl.searchParams.set('type', 'video')

    const response = await fetch(apiUrl.toString())
      .then(response => response.json())
      .catch(() => null)

    if (!response || response.error || response.items.length < 1) break

    for (const item of response.items) {
      yield {
        id: item.id.videoId,
        title: item.snippet.title
      }
    }

    if (!response.nextPageToken) break

    pageToken = response.nextPageToken

    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}
