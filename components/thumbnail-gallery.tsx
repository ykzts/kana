import React, { FC, useEffect, useReducer } from 'react'
import { getVideosByChannelId } from '../lib/youtube'

type Video = {
  id: string
  title: string
}

type State = {
  videos: Video[]
}

type Action =
  | {
      type: 'add'
      video: Video
    }
  | {
      type: 'reset'
    }

const initialState: State = {
  videos: []
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        videos: [...state.videos, action.video]
      }
    case 'reset':
      return {
        ...state,
        videos: []
      }
    default:
      throw new Error()
  }
}

type Props = {
  channelId: string
}

const ThumbnailGallery: FC<Props> = ({ channelId }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    ;(async () => {
      for await (const video of getVideosByChannelId(channelId)) {
        dispatch({
          type: 'add',
          video
        })

        await new Promise(resolve => setTimeout(resolve, 20))
      }
    })()

    return () => {
      dispatch({
        type: 'reset'
      })
    }
  }, [channelId])

  return (
    <>
      <style jsx>{`
        .items {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        .item {
          padding: 0.5rem;
        }

        .thumbnail {
          height: auto;
          max-width: 100%;
        }
      `}</style>

      <p>{state.videos.length}件</p>

      <div className="items">
        {state.videos.map(video => (
          <div className="item" key={video.id}>
            <img
              alt=""
              className="thumbnail"
              height="720"
              src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
              width="1280"
            />
            <p>{video.title}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default ThumbnailGallery
