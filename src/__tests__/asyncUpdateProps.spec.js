/* eslint-disable max-len, react/no-multi-comp */
import React, { Component } from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';

import asyncUpdateProps from '../asyncUpdateProps';


describe('asyncUpdateProps', () => {
  const wrap = WrappedComponent => class Wrapper extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    triggerUpdate() {
      this.setState({ x: 1 });
    }

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  };

  class BaseComponent extends Component {
    render() {
      return <div {...this.props} />;
    }
  }

  function mountAsyncPropsWrapper(updater, shouldUpdateWhenReceiveProps) {
    const enhancer = asyncUpdateProps(updater, shouldUpdateWhenReceiveProps);
    const EnhanceComponent = enhancer(BaseComponent);
    const Wrapper = wrap(EnhanceComponent);
    return mount(<Wrapper />);
  }

  it('should call updater when will mount', () => {
    const updater = spy(() => Promise.resolve({ x: 1 }));
    const shouldUpdateWhenReceiveProps = () => true;
    mountAsyncPropsWrapper(updater, shouldUpdateWhenReceiveProps);
    expect(updater).to.have.been.calledOnce();
  });

  it('should not update props when return undefined', async () => {
    const updater = () => {};
    const shouldUpdateWhenReceiveProps = () => true;
    const component = mountAsyncPropsWrapper(updater, shouldUpdateWhenReceiveProps);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(component.find('div').first()).to.not.have.prop('x').equal(1);
  });

  it('should update props with resolve props when return promise', async () => {
    const updater = () => Promise.resolve({ x: 1 });
    const shouldUpdateWhenReceiveProps = () => true;
    const component = mountAsyncPropsWrapper(updater, shouldUpdateWhenReceiveProps);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(component.find('div').first()).to.have.prop('x').equal(1);
  });

  it('should call updater when receive props (shouldUpdateWhenReceiveProps return true)', () => {
    const updater = spy(() => Promise.resolve({ x: 1 }));
    const shouldUpdateWhenReceiveProps = () => true;
    const component = mountAsyncPropsWrapper(updater, shouldUpdateWhenReceiveProps);
    component.instance().triggerUpdate();
    expect(updater).to.have.been.calledTwice();
  });

  it('should call updater with this.props', () => {
    const propsPassIn = [];
    const updater = spy(props => {
      propsPassIn.push(props);
      return Promise.resolve({ x: 1 });
    });
    const shouldUpdateWhenReceiveProps = () => true;
    const component = mountAsyncPropsWrapper(updater, shouldUpdateWhenReceiveProps);
    component.instance().triggerUpdate();
    expect(propsPassIn[0]).to.deep.equal({});
    expect(propsPassIn[1]).to.deep.equal({ x: 1 });
  });

  it('should not call updater when receive props (shouldUpdateWhenReceiveProps return false)', () => {
    const updater = spy(() => Promise.resolve({ x: 1 }));
    const shouldUpdateWhenReceiveProps = () => false;
    const component = mountAsyncPropsWrapper(updater, shouldUpdateWhenReceiveProps);
    component.instance().triggerUpdate();
    component.instance().triggerUpdate();
    expect(updater).to.not.have.been.calledTwice();
  });

  it('should call updater when receive props (shouldUpdateWhenReceiveProps not provided)', () => {
    const updater = spy(() => Promise.resolve({ x: 1 }));
    const component = mountAsyncPropsWrapper(updater);
    component.instance().triggerUpdate();
    component.instance().triggerUpdate();
    expect(updater).to.not.have.been.calledTwice();
  });

  it('should receive props and nextProps as shouldUpdateWhenReceiveProps\'s arguments', () => {
    let propsPassIn;
    let nextPropsPassIn;
    const updater = () => Promise.resolve({ x: 1 });
    const shouldUpdateWhenReceiveProps = (props, nextProps) => {
      propsPassIn = props;
      nextPropsPassIn = nextProps;
      return false;
    };
    const component = mountAsyncPropsWrapper(updater, shouldUpdateWhenReceiveProps);
    component.instance().triggerUpdate();
    expect(propsPassIn).to.deep.equal({});
    expect(nextPropsPassIn).to.deep.equal({ x: 1 });
  });
});
