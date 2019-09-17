import * as React from 'react'
import { InputProps } from 'antd/es/input'

interface CopyInputProps extends Omit<InputProps, 'readOnly' | 'addonAfter'> {

}

declare class CopyInput extends React.Component<CopyInputProps, any> {

}

export default CopyInput
