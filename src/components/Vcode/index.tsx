import React, { useState, useEffect, ReactElement } from 'react'
import { useRequest } from 'ahooks'
import * as commonService from '@/services/commonService'

interface Result {
  uuid: string;
  img: string
}

interface Props {
  onClick?: (res: Result) => void,
  width: number,
  height: number
}

export default function Vcode({ onClick, width, height }: Props): ReactElement {
  const [counter, setCounter] = useState(0)
  const { data, loading, error } = useRequest<Result>(commonService.getVcode, {
    onSuccess: onClick,
    refreshDeps: [counter]
  })

  return (
    <div onClick={e => setCounter(counter + 1)} style={{ display: 'inline-block', fontSize: 0 }}>
      {data && <img src={`data:image/gif;base64,${data.img}`} height={height} width={width} />}
    </div>
  )
}
