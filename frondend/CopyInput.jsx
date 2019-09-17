import React from 'react'
import { Input, Button, message } from 'antd'

function CopyInput (props) {
  let input = null

  const copy = () => {
    if (input) {
      input.focus()
      input.select()
      if (document.execCommand('copy')) {
        message.success('copy 成功')
      } else {
        message.warn('copy 失败, 你可以手动复制')
      }
    }
  }
  return (
    <Input {...props} ref={dom => (input = dom)} readOnly addonAfter={<Button onClick={copy} type='link'>Copy</Button>} />
  )
}

export default CopyInput
