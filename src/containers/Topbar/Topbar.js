import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import appActions from '../../redux/app/actions';
import TopbarWrapper from './topbar.style';
import { TopbarSearch } from '../../components/topbar';
import { getCurrentTheme } from '../ThemeSwitcher/config';
import { themeConfig } from '../../config';

const { Header } = Layout;
const { toggleCollapsed } = appActions;

class Topbar extends React.PureComponent {
  render() {
    const { toggle } = this.props;
    const customizedTheme = getCurrentTheme('topbarTheme', themeConfig.theme);
    const collapsed = this.props.collapsed && !this.props.openDrawer;
    const styling = {
      background: customizedTheme.backgroundColor,
      position: 'fixed',
      width: '100%',
      height: 70,
    };
    return (
      <TopbarWrapper>
        <Header
          style={styling}
          className={
            collapsed ? 'isomorphicTopbar collapsed' : 'isomorphicTopbar'
          }
        >
          <div className="isoLeft">
            <div className="isoSearch">
              <TopbarSearch />
            </div>
          </div>

          <ul className="isoRight">
            <li className="">Events</li>
            <li className="">Create an Event</li>
            <li className="">0x39...9876</li>
          </ul>
        </Header>
      </TopbarWrapper>
    );
  }
}

Topbar.propTypes = {
  toggle: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  openDrawer: PropTypes.bool.isRequired,
};

export default connect(
  (state) => ({
    ...state.App.toJS(),
  }),
  { toggle: toggleCollapsed }
)(Topbar);