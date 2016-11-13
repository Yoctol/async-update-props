import lifecycle from 'recompose/lifecycle';
import isPromise from 'is-promise';

const defaultShouldUpdateWhenReceiveProps = () => true;

const asyncUpdateProps = (
  updater,
  shouldUpdateWhenReceiveProps = defaultShouldUpdateWhenReceiveProps,
) => BaseComponent => {
  const enhance = lifecycle({
    updateProps(props) {
      const p = updater(props);
      if (isPromise(p)) {
        p.then(result => this.setState(result));
      }
    },
    componentWillMount() {
      this.updateProps(this.props);
    },
    componentWillReceiveProps(nextProps) {
      if (shouldUpdateWhenReceiveProps(this.props, nextProps)) {
        this.updateProps(nextProps);
      }
    },
  });
  return enhance(BaseComponent);
};

export default asyncUpdateProps;
