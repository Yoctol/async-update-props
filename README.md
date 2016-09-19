# async-update-props

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david_img]][david_site]

> Async props update HoC for React Component


## Install

```
$ npm install async-update-props
```


## Usage

```js
import { compose } from 'redux';
import { connect } from 'react-redux';
import asyncUpdateProps from 'async-update-props';

import Page from '../components/Page';
import { fetchDataRequest } from '../actions';


const mapStateToProps = (state) => ({
  ...
});

const updater = (props) => {
  props.fetchDataRequest();
};

const shouldUpdateWhenReceiveProps = () => false;


export default compose(
  connect(mapStateToProps, {
    fetchDataRequest,
  }),
  asyncUpdateProps(updater, shouldUpdateWhenReceiveProps)
)(Page);
```

If updater returns a promise, setState will be called with resolved value automatically:

```js
import asyncUpdateProps from 'async-update-props';

import Page from '../components/Page';
import { fetchDataRequest } from '../apis';


const updater = () => {
  return apis.fetchDataRequest();
};

const shouldUpdateWhenReceiveProps = () => false;


export default asyncUpdateProps(updater, shouldUpdateWhenReceiveProps)(Page);
```

## API

### asyncUpdateProps(updater, shouldUpdateWhenReceiveProps)

#### updater

*Required*
Type: `func`


#### shouldUpdateWhenReceiveProps

*Optional*
Type: `func`
Default: `() => true`


## License

MIT © [Yoctol](https://github.com/Yoctol/async-update-props)

[npm-image]: https://badge.fury.io/js/async-update-props.svg
[npm-url]: https://npmjs.org/package/async-update-props
[travis-image]: https://travis-ci.org/Yoctol/async-update-props.svg
[travis-url]: https://travis-ci.org/Yoctol/async-update-props
[coveralls-image]: https://coveralls.io/repos/Yoctol/async-update-props/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/r/Yoctol/async-update-props?branch=master
[david_img]: https://david-dm.org/Yoctol/async-update-props.svg
[david_site]: https://david-dm.org/Yoctol/async-update-props

