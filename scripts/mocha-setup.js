import { jsdom } from 'jsdom';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinonChai from 'sinon-chai';

global.document = jsdom('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
});

global.window = document.defaultView;
global.navigator = window.navigator;
/* eslint-disable no-multi-assign */
window.localStorage = window.sessionStorage = {
  getItem(key) {
    return this[key];
  },
  setItem(key, value) {
    this[key] = value;
  },
  removeItem(key) {
    this[key] = undefined;
  },
};
/* eslint-enable no-multi-assign */

// Workaround: https://github.com/airbnb/enzyme/issues/395
// require after global window & document polyfill
const chaiEnzyme = require('chai-enzyme');

chai.use(dirtyChai);
chai.use(sinonChai);
chai.use(chaiEnzyme());
