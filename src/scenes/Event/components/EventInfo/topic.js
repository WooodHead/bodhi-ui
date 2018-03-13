import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import moment from 'moment';
import { withStyles } from 'material-ui/styles';

import { getLocalDateTimeString, getEndTimeCountDownString } from '../../../../helpers/utility';
import styles from './styles';

class EventInfo extends React.PureComponent {
  render() {
    const { classes, oracle } = this.props;
    const { locale, messages: localeMessages } = this.props.intl;

    return (
      <div className={classes.eventInfoWrapper}>
        {this.renderInfoBlock(
          <FormattedMessage id="eventInfo.endDate" defaultMessage="ENDING DATE" />,
          getLocalDateTimeString(oracle.endTime),
          getEndTimeCountDownString(oracle.endTime, locale, localeMessages)
        )}
        {this.renderInfoBlock(<FormattedMessage id="eventInfo.fund" defaultMessage="FUNDING" />, this.getTotalFundWithToken())}
        {this.renderInfoBlock(<FormattedMessage id="eventInfo.resultSetter" defaultMessage="RESULT SETTER" />, oracle.resultSetterQAddress)}
      </div>
    );
  }

  renderInfoBlock(label, content, highlight) {
    const { classes } = this.props;

    return (
      <Grid item xs={6} md={12} className={classes.eventInfoBlock}>
        <Typography variant="body1">
          {label}
        </Typography>
        <Typography variant="title" className={classes.eventInfo}>
          {content}
        </Typography>
        {
          highlight ? (
            <Typography variant="body2" color="secondary">
              {highlight}
            </Typography>) : null
        }
      </Grid>
    );
  }

  getTotalFundWithToken() {
    const { oracle } = this.props;

    const totalAmount = _.sum(oracle.amounts);

    return `${parseFloat(totalAmount.toFixed(5)).toString()} ${oracle.token}`;
  }
}

EventInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  topic: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(injectIntl(EventInfo));
