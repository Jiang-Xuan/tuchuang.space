import React from 'react'
import { Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'

// react-router 如何高亮一个导航项, 在浏览器后退前进按钮被按下的时候依旧能跟随
// react-routerantd-how-to-highlight-a-menu-item-when-press-back-forward-button
// https://github.com/ant-design/ant-design/issues/1575#issuecomment-362488383
function Nav (props) {
  const { pathname } = useLocation()
  return (
    <>
      <div className='logo' />
      <Menu mode='horizontal' theme='dark' defaultSelectedKeys={['home']} selectedKeys={[pathname]} style={{ lineHeight: '64px' }}>
        <Menu.Item key='/'><Link to='/'>Home</Link></Menu.Item>
        <Menu.Item key='/about'><Link to='/about'>About</Link></Menu.Item>
        <Menu.Item key='/contact'><Link to='/contact'>Contact</Link></Menu.Item>
        <Menu.Item data-e2e-test-id='GOTO_API_DOC_BTN' key='/api-doc'><Link to='/api-doc'>Api</Link></Menu.Item>
      </Menu>
    </>
  )
}

Nav.propTypes = {
}

export default Nav
