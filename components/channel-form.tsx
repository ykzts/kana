import React, { FC, FormEvent, useCallback, useState } from 'react'
import { Channel, getChannelById } from '../lib/youtube'

const defaultChannelId = 'UC0Owc36U9lOyi9Gx9Ic-4qg'

type ChannelFormEvent = {
  channel: Channel
}

type Props = {
  onError?: (error: Error) => void
  onSubmit?: (event: ChannelFormEvent) => void
}

const Form: FC<Props> = ({ onError, onSubmit }) => {
  const [channelId, setChannelId] = useState<string>(defaultChannelId)

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      getChannelById(channelId)
        .then(channel => {
          if (typeof onSubmit !== 'function') return

          onSubmit({ channel })
        })
        .catch(error => {
          if (typeof onError !== 'function') return

          onError(error)
        })
    },
    [channelId, onError, onSubmit]
  )

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="">
          <input
            onChange={event => setChannelId(event.target.value)}
            placeholder={defaultChannelId}
            required
            type="text"
            value={channelId}
          />
        </div>

        <div className="">
          <button type="submit">開く</button>
        </div>
      </form>
    </div>
  )
}

export default Form
