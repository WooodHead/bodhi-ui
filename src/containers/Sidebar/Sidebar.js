import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import clone from 'clone';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import Menu from '../../components/uielements/menu';
import IntlMessages from '../../components/utility/intlMessages';
import SidebarWrapper from './sidebar.style';

import appActions from '../../redux/app/actions';
import Logo from '../../components/utility/logo';
import { rtl } from '../../config/withDirection';
import { getCurrentTheme } from '../ThemeSwitcher/config';
import { themeConfig } from '../../config';

const { Sider } = Layout;
const {
  toggleOpenDrawer,
  changeOpenKeys,
  changeCurrent,
  toggleCollapsed,
} = appActions;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
  }

  onOpenChange(newOpenKeys) {
    const { app, changeOpenKeysProp } = this.props;
    const latestOpenKey = newOpenKeys.find((key) => !(app.openKeys.indexOf(key) > -1));
    const latestCloseKey = app.openKeys.find((key) => !(newOpenKeys.indexOf(key) > -1));
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    changeOpenKeysProp(nextOpenKeys);
  }
  getAncestorKeys = (key) => {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  };

  handleClick(e) {
    this.props.changeCurrent([e.key]);
    if (this.props.app.view === 'MobileView') {
      setTimeout(() => {
        this.props.toggleCollapsedProp();
        this.props.toggleOpenDrawerProp();
      }, 100);
    }
  }

  renderView({ style, ...props }) {
    const viewStyle = {
      marginRight: rtl === 'rtl' ? '0' : '-17px',
      paddingRight: rtl === 'rtl' ? '0' : '9px',
      marginLeft: rtl === 'rtl' ? '-17px' : '0',
      paddingLeft: rtl === 'rtl' ? '9px' : '0',
    };
    return (
      <div className="box" style={{ ...style, ...viewStyle }} {...props} />
    );
  }

  render() {
    const { url, app, toggleOpenDrawerProp } = this.props;
    const customizedTheme = getCurrentTheme('sidebarTheme', themeConfig.theme);
    const collapsed = clone(app.collapsed) && !clone(app.openDrawer);
    const { openDrawer } = app;
    const mode = collapsed === true ? 'vertical' : 'inline';
    const onMouseEnter = () => {
      if (openDrawer === false) {
        toggleOpenDrawerProp();
      }
    };
    const onMouseLeave = () => {
      if (openDrawer === true) {
        toggleOpenDrawerProp();
      }
    };
    const scrollheight = app.height;
    const styling = {
      backgroundColor: customizedTheme.backgroundColor,
    };
    const submenuColor = {
      color: customizedTheme.textColor,
    };
    return (
      <SidebarWrapper>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width="240"
          className="isomorphicSidebar"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={styling}
        >
          <Logo collapsed={collapsed} />
          <Scrollbars
            renderView={this.renderView}
            style={{ height: scrollheight - 70 }}
          >
            <Menu
              onClick={this.handleClick}
              theme="dark"
              mode={mode}
              openKeys={collapsed ? [] : app.openKeys}
              selectedKeys={app.current}
              onOpenChange={this.onOpenChange}
              className="isoDashboardMenu"
            >
              <Menu.Item key="blankPage">
                <Link to={`${url}/blankPage`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-document" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.blankPage" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>
            </Menu>
          </Scrollbars>
        </Sider>
      </SidebarWrapper>
    );
  }
}

Sidebar.propTypes = {
  changeCurrent: PropTypes.func.isRequired,
  app: PropTypes.object.isRequired,
  changeOpenKeysProp: PropTypes.func.isRequired,
  toggleCollapsedProp: PropTypes.func.isRequired,
  toggleOpenDrawerProp: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

export default connect(
  (state) => ({
    app: state.App.toJS(),
  }),
  {
    toggleOpenDrawerProp: toggleOpenDrawer,
    changeOpenKeysProp: changeOpenKeys,
    changeCurrent,
    toggleCollapsedProp: toggleCollapsed,
  }
)(Sidebar);