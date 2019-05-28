import { NextFC } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import ChannelForm from '../components/channel-form'
import ThumbnailGallery from '../components/thumbnail-gallery'
import { Channel } from '../lib/youtube'

const title = 'TTT'

const Home: NextFC = () => {
  const [channel, setChannel] = useState<Channel>()
  const [hasError, setHasError] = useState<boolean>(false)

  return (
    <>
      <Head>
        <title>{channel ? `${channel.title} - ${title}` : title}</title>
      </Head>

      <ChannelForm
        onError={() => setHasError(true)}
        onSubmit={event => setChannel(event.channel)}
      />

      {hasError ? (
        <p>チャンネル情報の取得に失敗しました。</p>
      ) : (
        channel && (
          <div className="">
            <div className="">
              <img
                alt=""
                height={channel.thumbnails.medium.height}
                src={channel.thumbnails.medium.url}
                width={channel.thumbnails.medium.width}
              />

              <h3>
                <a
                  href={`https://www.youtube.com/channel/${channel.id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {channel.title}
                </a>
              </h3>
            </div>

            <ThumbnailGallery channelId={channel.id} />
          </div>
        )
      )}
    </>
  )
}

export default Home
