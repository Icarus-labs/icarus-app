import CopyIcon from 'assets/copy-icon.svg'
import {copyText} from 'utils/Tools'
import {message} from 'antd'

import './style.scss'

export default function UserAddress (props) {
    const {address} = props

    const copyAddress = () => {
        copyText(address)
        message.success('Copied')
    }

    return <div className="user-address">
        {address} <img src={CopyIcon} className="copy-icon" onClick={()=>{copyAddress()}}/>
    </div>
}