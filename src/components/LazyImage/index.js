// @flow

import React, { Component } from 'react';
import { withinViewport } from '../../lib/dom';
import styles from './styles.css';
import cx from 'classnames';

type Props = {
  src: string,
  className?: string,
  draggable?: boolean,
  provideCallback?: (() => void) => void,
  panEnd: boolean,
};

type State = {
  shown: boolean,
};

export default class LazyImage extends Component {
  _image: ?HTMLElement;
  props: Props;
  state: State = {
    shown: false,
  };

  componentDidMount () {
    const { provideCallback } = this.props;
    provideCallback && provideCallback(this.calculateShown);

    this.calculateShown();
  }

  shouldComponentUpdate (nextProps: Props, nextState: State) {
    return (
      (nextState.shown && !this.state.shown)
      || nextProps.src !== this.props.src
      || (nextProps.panEnd && !this.props.panEnd)
    );
  }

  componentWillUpdate (nextProps: Props) {
    this.calculateShown();
  }

  calculateShown = () => {
    if (withinViewport(this._image)) {
      this.setState({
        shown: true,
      });
    }
  };

  render () {
    const { src, className, draggable } = this.props;
    const { shown } = this.state;

    return (
      <img
        ref={(c) => (this._image = c)}
        src={shown ? src : ''}
        role="presentation"
        className={cx(styles.root, className, { [styles.shown]: shown })}
        draggable={!!draggable}
      />
    );
  }
}