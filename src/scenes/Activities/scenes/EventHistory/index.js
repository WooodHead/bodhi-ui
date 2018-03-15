import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow, TableSortLabel } from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import moment from 'moment';

import styles from './styles';
import Config from '../../../../config/app';
import graphqlActions from '../../../../redux/Graphql/actions';
import { getShortLocalDateTimeString, getDetailPagePath } from '../../../../helpers/utility';
import { TransactionType, SortBy, OracleStatus } from '../../../../constants';

class EventHistory extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    getOracles: PropTypes.func.isRequired,
    getOraclesReturn: PropTypes.array,
    getTransactions: PropTypes.func,
    getTransactionsReturn: PropTypes.array,
    syncBlockTime: PropTypes.number,
  };

  static defaultProps = {
    getOraclesReturn: [],
    getTransactions: undefined,
    getTransactionsReturn: [],
    syncBlockTime: undefined,
  };

  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'time',
      transactions: [],
    };

    this.getTableHeader = this.getTableHeader.bind(this);
    this.getTableRows = this.getTableRows.bind(this);
    this.createSortHandler = this.createSortHandler.bind(this);
    this.handleSorting = this.handleSorting.bind(this);
    this.executeTxsRequest = this.executeTxsRequest.bind(this);
    this.onEventLinkClicked = this.onEventLinkClicked.bind(this);
  }

  componentWillMount() {
    this.executeTxsRequest();
  }

  componentWillReceiveProps(nextProps) {
    const {
      getOraclesReturn,
      getTransactionsReturn,
      syncBlockTime,
    } = nextProps;

    // return from the click event
    if (getOraclesReturn !== this.props.getOraclesReturn) {
      const path = getDetailPagePath(getOraclesReturn);
      if (path) {
        this.props.history.push(path);
      }
    }

    // Update page on new block
    if (syncBlockTime !== this.props.syncBlockTime) {
      this.executeTxsRequest();
    }

    this.setState({ transactions: getTransactionsReturn });
  }

  render() {
    const { classes } = this.props;
    const { transactions } = this.state;

    return (
      <Grid container spacing={0}>
        {
          transactions.length ?
            (<Table className={classes.historyTable}>
              {this.getTableHeader()}
              {this.getTableRows(this.state.transactions)}
            </Table>) :
            (<Typography variant="body1">
              <FormattedMessage id="str.emptyTxHistory" defaultMessage="You do not have any transactions right now." />
            </Typography>)
        }
      </Grid>
    );
  }

  executeTxsRequest() {
    this.props.getTransactions(
      [
        { type: TransactionType.CreateEvent },
        { type: TransactionType.Bet },
        { type: TransactionType.ApproveSetResult },
        { type: TransactionType.SetResult },
        { type: TransactionType.ApproveVote },
        { type: TransactionType.Vote },
        { type: TransactionType.FinalizeResult },
        { type: TransactionType.Withdraw },
      ],
      undefined
    );
  }

  getTableHeader() {
    const { order, orderBy } = this.state;

    const headerCols = [
      {
        id: 'time',
        name: 'str.time',
        nameDefault: 'Time',
        numeric: false,
      },
      {
        id: 'type',
        name: 'str.type',
        nameDefault: 'Type',
        numeric: false,
      },
      {
        id: 'name',
        name: 'str.name',
        nameDefault: 'Name',
        numeric: false,
      },
      {
        id: 'token',
        name: 'str.token',
        nameDefault: 'Token',
        numeric: false,
      },
      {
        id: 'amount',
        name: 'str.amount',
        nameDefault: 'Amount',
        numeric: true,
      },
      {
        id: 'fee',
        name: 'str.fee',
        nameDefault: 'Fee',
        numeric: true,
      },
      {
        id: 'status',
        name: 'str.status',
        nameDefault: 'Status',
        numeric: false,
      },
      {
        id: 'actions',
        name: 'str.actions',
        nameDefault: 'Actions',
        numeric: false,
      },
    ];

    return (
      <TableHead>
        <TableRow>
          {headerCols.map((column) => (
            <TableCell
              key={column.id}
              numeric={column.numeric}
              sortDirection={orderBy === column.id ? order : false}
            >
              <Tooltip
                title={<FormattedMessage id="str.sort" defaultMessage="Sort" />}
                enterDelay={Config.intervals.tooltipDelay}
                placement={column.numeric ? 'bottom-end' : 'bottom-start'}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.createSortHandler(column.id)}
                >
                  <FormattedMessage id={column.name} default={column.nameDefault} />
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  getTableRows(transactions) {
    const { classes } = this.props;

    return (
      <TableBody>
        {_.map(transactions, (transaction, index) => (
          <TableRow key={transaction.txid} selected={index % 2 === 1}>
            <TableCell>
              {getShortLocalDateTimeString(transaction.createdTime)}
            </TableCell>
            <TableCell>
              {transaction.type}
            </TableCell>
            <TableCell>
              {transaction.topic ? transaction.topic.name : null}
            </TableCell>
            <TableCell>
              {transaction.token}
            </TableCell>
            <TableCell numeric>
              {transaction.amount}
            </TableCell>
            <TableCell numeric>
              {transaction.fee}
            </TableCell>
            <TableCell>
              {transaction.status}
            </TableCell>
            <TableCell>
              {transaction.topic && transaction.topic.address ?
                <div data-topic-address={transaction.topic.address} onClick={this.onEventLinkClicked} className={classes.viewEventLink}>
                  <FormattedMessage id="eventHistory.viewEvent" defaultMessage="View Event" />
                </div> : null
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  onEventLinkClicked(event) {
    const {
      getOracles,
    } = this.props;

    const topicAddress = event.currentTarget.getAttribute('data-topic-address');
    getOracles(
      [
        { topicAddress },
      ],
      { field: 'endTime', direction: SortBy.Descending },
    );
  }

  createSortHandler = (property) => (event) => {
    this.handleSorting(event, property);
  };

  handleSorting(event, property) {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const transactions = order === 'desc'
      ? this.state.transactions.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
      : this.state.transactions.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ transactions, order, orderBy });
  }
}

const mapStateToProps = (state) => ({
  getOraclesReturn: state.Graphql.get('getOraclesReturn'),
  getTransactionsReturn: state.Graphql.get('getTransactionsReturn'),
});

function mapDispatchToProps(dispatch) {
  return {
    getOracles: (filters, orderBy) => dispatch(graphqlActions.getOracles(filters, orderBy)),
    getTransactions: (filters, orderBy) => dispatch(graphqlActions.getTransactions(filters, orderBy)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(injectIntl(EventHistory)));
