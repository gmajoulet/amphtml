/**
 * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {listen} from '../../../src/event-helper';
import {logRange, mapRange, sum} from '../../../src/utils/math';
import {setStyles} from '../../../src/style';
import {toArray} from '../../../src/types';

const SMOOTHING_PTS = 4;
const PERSPECTIVE = 100;

/**
 * Installs parallax handlers
 */
export class ParallaxService {
  /**
   * @param {!Window} global
   * @param {!../../../src/service/vsync-impl.Vsync} vsync
   * @param {Array<Element>} pages
   */
  constructor(global, vsync, pages) {
    /** @private {!Window} */
    this.win_ = global;

    /** @private @const {!../../../src/service/vsync-impl.Vsync} */
    this.vsync_ = vsync;

    /** @private {Array} */
    this.parallaxElements_ = [];

    /** @private {?number} */
    this.middleX_ = 0;

    /** @private {?number} */
    this.middleY_ = 0;

    /** @private {Array} */
    this.smoothingPointsX_ = [];

    /** @private {Array} */
    this.smoothingPointsY_ = [];

    this.vsync_.mutate(() => {
      pages
        .filter(page => !page.hasAttribute('no-parallax-fx'))
        .map(page => {
          // Set the page's perspective
          setStyles(page, {
            perspective: PERSPECTIVE * 10 + `px`,
          });
          // Loop through the layers in the page and assign a z-index following
          // DOM order (manual override will be added in the future)
          let zIndex = 1;
          const layers = this.getLayers(page);
          layers.map(layer => {
            const fxElement = new ParallaxElement(
              page,
              layer,
              this.vsync_,
              zIndex++,
              layers.length
            );
            this.parallaxElements_.push(fxElement);
          });
        });
    });

    listen(global, 'deviceorientation', event => {
      this.parallaxOrientationMutate_(event, this.parallaxElements_);
    });
  }

  /**
   * Discovers and returns all layers inside a page
   * @param {Element} page
   * @return {Array<Element>}
   */
  getLayers(page) {
    return toArray(page.querySelectorAll(`amp-story-grid-layer`));
  }

  /**
   * Calculate the smoothed change in position using the device orientation
   * change event then update each of the layers will its calculated position.
   * @param {Event} event
   * @param {!Array<!ParallaxElement>} elements
   * @private
   */
  parallaxOrientationMutate_(event, elements) {
    const window = this.win_;
    const {screen} = window;
    let {gamma, beta} = event;

    let angle;

    // Detect the implementation of orientation angle
    if ('orientation' in screen) {
      angle = screen.orientation.angle;
    } else {
      angle = window.orientation;
    }

    // Reverse gamma/beta if the device is in landscape
    if (window.orientation == 90 || window.orientation == -90) {
      const tmp = gamma;
      gamma = beta;
      beta = tmp;
    }

    // Flip signs of the angles if the phone is in 'reverse landscape' or
    // 'reverse portrait'
    if (angle < 0) {
      gamma = -gamma;
      beta = -beta;
    }

    // Smooth the gamma value (X-AXIS)
    if (this.smoothingPointsX_.length > SMOOTHING_PTS) {
      this.smoothingPointsX_.shift();
    }
    this.smoothingPointsX_.push(gamma);
    const avgX = sum(this.smoothingPointsX_) / SMOOTHING_PTS;
    if (this.smoothingPointsX_.length > SMOOTHING_PTS && this.middleX_ == 0) {
      this.middleX_ = avgX;
    }

    // Smooth the beta value (Y-AXIS)
    if (this.smoothingPointsY_.length > SMOOTHING_PTS) {
      this.smoothingPointsY_.shift();
    }
    this.smoothingPointsY_.push(beta);
    const avgY = sum(this.smoothingPointsY_) / SMOOTHING_PTS;
    if (this.smoothingPointsY_.length > SMOOTHING_PTS && this.middleY_ == 0) {
      this.middleY_ = avgY;
    }

    let mappedX = avgX - this.middleX_;
    let mappedY = avgY - this.middleY_;

    // Limit the range for a smoother/less shaky effect
    mappedX = mapRange(mappedX, -75, 75, -25, 25);
    mappedY = mapRange(mappedY, -75, 75, -25, 25);

    elements.forEach(element => {
      if (element.shouldUpdate()) {
        if (this.middleY_ != 0 && this.middleX_ != 0) {
          element.update(mappedX, mappedY);
        } else {
          element.update(0, 0);
        }
      }
    });
  }
}

/**
 * Encapsulates and tracks an element's linear parallax effect.
 */
export class ParallaxElement {
  /**
   * @param {!Element} page The parent page of thi element
   * @param {!Element} element The element to give a parallax effect.
   * @param {!../../../src/service/vsync-impl.Vsync} vsync
   * @param {number} factor the index of the layer
   * @param {number} total total number of layers
   */
  constructor(page, element, vsync, factor, total) {
    /** @private @const {!Element} */
    this.page_ = page;

    /** @private @const {!Element} */
    this.element_ = element;

    /** @private @const {!../../../src/service/vsync-impl.Vsync} */
    this.vsync_ = vsync;

    /** @private @const {number} */
    this.factor_ = factor;

    /** @private {number} */
    this.offsetX_ = 0;

    /** @private {number} */
    this.offsetY_ = 0;

    /** @private {number} */
    this.total_ = total;

    // We offset each element in the z-direction by its factor (its layer order
    // within the page)
    /** @private {number} */
    this.offsetZ_ = this.factor_ * (PERSPECTIVE / this.total_);
  }

  /**
   * Apply the parallax effect to the element given the movements in the
   * x and y axes
   * @param {number} x The movement of the layer in the x axis
   * @param {number} y The movement of the layer in the y axis
   */
  update(x = 0, y = 0) {
    this.vsync_.mutate(() => {
      // We use a log scale to make elements that are closer to the user (high
      // z-index) move faster than elements in the background.
      this.offsetX_ = logRange(this.factor_, this.total_, x);
      this.offsetY_ = logRange(this.factor_, this.total_, y);

      const translate3d = `translate3d(${this.offsetX_.toFixed(
        2
      )}px, ${this.offsetY_.toFixed(2)}px, ${this.offsetZ_.toFixed(2)}px) `;
      setStyles(this.element_, {
        transform: translate3d,
      });
    });
  }

  /**
   * True if the element is in the viewport.
   * @return {boolean}
   */
  shouldUpdate() {
    return this.page_.hasAttribute('active');
  }
}

/**
 * Installs the required observers and listeners for the parallax effect
 * if present on the story.
 * @param {!Window} win
 * @param {!../../../src/service/vsync-impl.Vsync} vsync
 * @param {Array<Element>} pages
 * @return {ParallaxService}
 */
export function installParallaxHandler(win, vsync, pages) {
  return new ParallaxService(win, vsync, pages);
}
