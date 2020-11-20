import {
  BellOutlined, CalendarOutlined,
  DashboardOutlined, HeartOutlined, HomeOutlined,
  IdcardOutlined,
  LoginOutlined, LogoutOutlined, MenuOutlined,
  SecurityScanOutlined,
  SnippetsOutlined, TeamOutlined, ToolOutlined,
  UserAddOutlined, UserOutlined, ReconciliationOutlined,
  PicLeftOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Button, Drawer, Layout, Menu, Modal, Typography } from 'antd';
import React from 'react';
import MediaQuery from 'react-responsive';
import { Link, withRouter } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { logout } from 'services/authService';
import styled from 'styled-components';
import { GlobalContext } from '../contexts/GlobalContext';
import PropTypes from 'prop-types';

const { Header } = Layout;
const { Text } = Typography;
const HeaderStyled = styled(Header)`
z-index: 100 !important;
position: fixed;
z-index: 1;
width: 100%;
// background-color: rgba(255,255,255,0.8);
background-color: rgba(255,255,255);
display: flex;
white-space: nowrap;
border: 0;
justify-content: space-between;
border-bottom: 1px solid #f0f0f0;
align-items: center;
// box-shadow: 0px 2px 8px #888888;
padding-left: 20px;
padding-right: 20px;

`;

const MenuContianer = styled.div`
float: right;
// border: 0;
margin-bottom: 2px;
`;


const headerHeight = 64;

const HeaderLogo = styled.div`
display: flex;
height: ${headerHeight}px;
`

const HomeHeaderRaw = props => {
  const [visible, setVisible] = React.useState(false);
  const context = React.useContext(GlobalContext);
  const [current, setCurrent] = React.useState();

  const { user, role, setUser, notifyCount } = context;
  const isAdmin = role === 'admin';
  const isClient = role === 'client';
  const isAgent = role === 'agent';
  const isGuest = role === 'guest';
  const canChangePassword = !isGuest && user?.loginType === 'local';

  const handleLogout = () => {
    Modal.confirm({
      title: "Logout",
      content: <>Do you want to log out <Text code>{user.email}</Text></>,
      async onOk() {
        await logout();
        setVisible(false);
        setUser(null);
        history.push('/');
      },
      maskClosable: true,
      okText: 'Yes, log me out!',
      onCancel() {
      },
    });
  }

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const history = props.history;

  const handleClick = (e) => {
    setCurrent(e.key);
  }

  return (
    <HeaderStyled>
      <HeaderLogo>
        <HashLink to="/">
          <img alt="EasyValueCheck logo" src="/images/header-logo.png" width="auto" height="60" style={{ padding: '14px 0 14px 0' }}></img>
        </HashLink>
        {/* {isAdmin && <Text>Admin</Text>} */}
      </HeaderLogo>
      <MediaQuery minDeviceWidth={801}>
        <MenuContianer>
          <Menu
            onClick={handleClick}
            selectedKeys={[current]}
            mode="horizontal" style={{ border: 0 }}>
            {isGuest && <Menu.Item key="home"><HashLink to="/#home">Home</HashLink></Menu.Item>}
            {isGuest && <Menu.Item key="services"><HashLink to="/#services">Services</HashLink></Menu.Item>}
            {/* {isGuest && <Menu.Item key="blog"><HashLink to="/blogs">Blog</HashLink></Menu.Item>} */}
            {isGuest && <Menu.Item key="signup"><Link to="/signup">Sign Up</Link></Menu.Item>}
            {isGuest && <Menu.Item key="login"><Link to="/login">Log In</Link></Menu.Item>}
            {/* {(isAdmin || isAgent) && <Menu.Item key="board"><Link to="/board">Board</Link></Menu.Item>} */}
            {isClient && <Menu.Item key="landing"><Link to="/">Home</Link></Menu.Item>}
            {/* {!isGuest && <Menu.Item key="stock"><Link to="/stock">Stocks</Link></Menu.Item>} */}
            {isClient && <Menu.Item key="portfolio"><Link to="/portfolios">Portfolios</Link></Menu.Item>}
            {/* {isAdmin && <Menu.Item key="clients"><Link to="/clients">Users</Link></Menu.Item>} */}
            {/* {isAdmin && <Menu.Item key="admin"><Link to="/admin">Admin</Link></Menu.Item>} */}
            {/* {!isGuest && <Menu.Item key="message"><Link to="/message"><Badge count={notifyCount} showZero={false} offset={[10, 0]}>Messages</Badge></Link></Menu.Item>} */}
            {isAdmin && <Menu.SubMenu key="settings" title="Settings">
              <Menu.Item key="task_template"><Link to="/task_template">Task Templates</Link></Menu.Item>
              <Menu.Item key="doc_template"><Link to="/doc_template">Doc Templates</Link></Menu.Item>
              <Menu.Item key="recurring"><Link to="/recurring">Recurring</Link></Menu.Item>
              <Menu.Item key="stocktag"><Link to="/stocktag">Stock Tags</Link></Menu.Item>
              <Menu.Item key="user"><Link to="/user">Users</Link></Menu.Item>
              {/* <Menu.Item key="blog_admin"><HashLink to="/blogs/admin">Blog</HashLink></Menu.Item> */}
              <Menu.Item key="stats"><Link to="/stats">Statistics</Link></Menu.Item>
            </Menu.SubMenu>}
            {!isGuest && <Menu.SubMenu key="me" title={<Avatar size={40} icon={<UserOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: isAdmin ? '#222222' : isAgent ? '#3273A4' : '#15be53' }} />}>
              <Menu.Item key="profile"><Link to="/profile">Profile</Link></Menu.Item>
              {isClient && <Menu.Item key="account"><Link to="/account">Account</Link></Menu.Item>}
              {canChangePassword && <Menu.Item key="changePassword"><Link to="/change_password">Change Password</Link></Menu.Item>}
              <Menu.Item key="logout" onClick={handleLogout}>Log Out</Menu.Item>
            </Menu.SubMenu>}
          </Menu>

        </MenuContianer>
        {/* <Tag>{user?.memberId}</Tag> */}
      </MediaQuery>
      <MediaQuery maxDeviceWidth={800}>
        <Badge count={notifyCount} showZero={false} ><Button type="default" onClick={showDrawer}>
          <MenuOutlined />
        </Button></Badge>
        <Drawer
          placement="right"
          closable={true}
          onClose={onClose}
          visible={visible}
          width={290}
          bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Menu
            onClick={handleClick}
            selectedKeys={[current]}
            mode="inline"
            style={{ border: 0 }}
          >
            {isGuest && <Menu.Item key="login"><LoginOutlined /> <Link to="/login">Log In</Link></Menu.Item>}
            {isGuest && <Menu.Item key="signup"><UserAddOutlined /> <Link to="/signup">Sign Up</Link></Menu.Item>}
            {/* {isAdmin && <Menu.Item key="admin"><SettingOutlined /> <Link to="/admin">Admin</Link></Menu.Item>} */}
            {/* {(isAdmin || isAgent) && <Menu.Item key="board"><DashboardOutlined /> <Link to="/board">Board</Link></Menu.Item>} */}
            {isClient && <Menu.Item key="landing"><DashboardOutlined /> <Link to="/">Home</Link></Menu.Item>}
            {/* {!isGuest && <Menu.Item key="stock"><SnippetsOutlined /> <Link to="/stock">Stocks</Link></Menu.Item>} */}
            {isClient && <Menu.Item key="portfolio"><IdcardOutlined /> <Link to="/portfolios">Portfolios</Link></Menu.Item>}
            {isAdmin && <Menu.Item key="task_template"><ToolOutlined /> <Link to="/task_template">Task Template</Link></Menu.Item>}
            {isAdmin && <Menu.Item key="doc_template"><ReconciliationOutlined /> <Link to="/doc_template">Doc Template</Link></Menu.Item>}
            {isAdmin && <Menu.Item key="recurring"><CalendarOutlined /> <Link to="/recurring">Recurring</Link></Menu.Item>}
            {/* {isAdmin && <Menu.Item key="clients"><SettingOutlined /> <Link to="/clients">Users</Link></Menu.Item>} */}
            {isAdmin && <Menu.Item key="stocktag"><TeamOutlined /> <Link to="/stocktag">Stock Tags</Link></Menu.Item>}
            {isAdmin && <Menu.Item key="user"><TeamOutlined /> <Link to="/user">User</Link></Menu.Item>}
            {/* {!isGuest && <Menu.Item key="message"><BellOutlined /> <Link to="/message">Messages <Badge count={notifyCount} showZero={false} /></Link></Menu.Item>} */}
            {(isAdmin || isAgent) && <Menu.Item key="stats"><DashboardOutlined /> <Link to="/stats">Statistics</Link></Menu.Item>}
            {/* {isAdmin && <Menu.Item key="impersonate"><SkinOutlined /> <Link to="/impersonate">Impersonate</Link></Menu.Item>} */}
            {!isGuest && <Menu.Item key="profile"><UserOutlined /> <Link to="/profile">Profile</Link></Menu.Item>}
            {isClient && <Menu.Item key="account"><Link to="/account">Account</Link></Menu.Item>}
            {canChangePassword && <Menu.Item key="changePassword"><SecurityScanOutlined /> <Link to="/change_password">Change Password</Link></Menu.Item>}
            {isGuest && <Menu.Item key="home"><HomeOutlined /> <HashLink to="/#home" onClick={onClose}>Home</HashLink></Menu.Item>}
            {isGuest && <Menu.Item key="services"><HeartOutlined /> <HashLink to="/#services" onClick={onClose}>Services</HashLink></Menu.Item>}
            {/* {isGuest && <Menu.Item key="blog"><PicLeftOutlined /> <Link to="/blogs">Blog</Link></Menu.Item>} */}
            {!isGuest && <Menu.Item key="logout" onClick={handleLogout}><LogoutOutlined />{isAdmin ? ' Admin' : isAgent ? ' Agent' : null} Log Out</Menu.Item>}
          </Menu>
        </Drawer>
      </MediaQuery>

    </HeaderStyled>
  );
}

HomeHeaderRaw.propTypes = {
};

HomeHeaderRaw.defaultProps = {};

export const HomeHeader = withRouter(HomeHeaderRaw);

export default HomeHeader;
