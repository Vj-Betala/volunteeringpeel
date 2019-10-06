// Library Imports
import { push } from 'connected-react-router';
import { LocationDescriptor } from 'history';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';

// App Imports
import { loading } from '@app/common/actions';

// Component Imports
import Events from '@app/admin/components/pages/Events';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loading: (status: boolean) => dispatch(loading(status)),
  push: (path: string) => {
    dispatch(push(path));
  },
});

const connectedEvents = connect(
  null,
  mapDispatchToProps,
)(Events);
const routerEvents = withRouter(connectedEvents);

export default routerEvents;
