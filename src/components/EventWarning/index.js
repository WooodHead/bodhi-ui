import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { injectIntl, intlShape } from 'react-intl';
import cx from 'classnames';

import styles from './styles';
import Warning from '../Warning/index';


const EventWarning = ({ classes, className, ...props }) => <Warning {...props} className={cx(className, classes.warningWrapper)} />;

EventWarning.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.string,
  theme: PropTypes.object,
  id: PropTypes.string,
  values: PropTypes.object,
  intl: intlShape.isRequired, // eslint-disable-line
};

EventWarning.defaultProps = {
  message: undefined,
  values: {},
  id: '',
  className: undefined,
  theme: undefined,
};

export default injectIntl(withStyles(styles)(EventWarning));
