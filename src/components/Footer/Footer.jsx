import { Typography } from 'antd'
import React from 'react'

const Footer = () => {
  return (
    <div className='appFooter'>
      <Typography.Link>Privacy policy</Typography.Link>
      <Typography.Link>Terms and conditions</Typography.Link>
      <Typography.Link href="tel:2354213">Call us</Typography.Link>
    </div>
  )
}

export default Footer
