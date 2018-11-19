/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
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

import {CSS} from '../../../build/amp-next-story-0.1.css';
import {Gestures} from '../../../src/gesture';
import {Layout} from '../../../src/layout';
import {MultidocManager} from '../../../src/runtime';
import {Services} from '../../../src/services';
import {SwipeXRecognizer} from '../../../src/gesture-recognizers';
import {fetchDocument} from '../../../src/document-fetcher';
import {getChildJsonConfig} from '../../../src/json';
import {htmlFor} from '../../../src/static-template';
import {parseJson} from '../../../src/json';
import {setImportantStyles} from '../../../src/style';
import {user} from '../../../src/log';


/** @const {string} */
const TAG = 'amp-next-story';

/**
 * Next story button template.
 * @param {!Element} element
 * @return {!Element}
 */
const getNavigationButtons = element => {
  return htmlFor(element)`
      <div class="i-amphtml-next-story-buttons-container">
        <style>
          .i-amphtml-next-story-previous {
            position: absolute;
            bottom: 12px;
            left: 12px;
            z-index: 9999999999;
          }

          .i-amphtml-next-story-next {
            position: absolute;
            bottom: 12px;
            right: 12px;
            z-index: 9999999999;
          }
        </style>
        <button
            class="i-amphtml-next-story-previous"
            style="">Previous story</button>
        <button
            class="i-amphtml-next-story-next"
            style="">Next story</button>
      </div>`;
};

/**
 * The <amp-next-story> custom element.
 */
export class AmpNextStory extends AMP.BaseElement {
  /** @param {!AmpElement} element */
  constructor(element) {
    super(element);

    /** @private {!Object} */
    this.config_ = null;

    /** @private {number} */
    this.currentStoryIndex_ = 0;

    /** @private @const */
    this.gestures_ = Gestures.get(this.win.document.body);

    /** @private {!MultidocManager} */
    this.multidocManager_ =
        new MultidocManager(this.win, Services.ampdocServiceFor(this.win),
            Services.extensionsFor(this.win), Services.timerFor(this.win));

    /** @private {!Array<!Element>} */
    this.storyEls_ = [];
  }

  /** @override */
  buildCallback() {
    try {
      this.config_ = getChildJsonConfig(this.element);
    } catch (err) {
      user().error(TAG, 'Cannot parse JSON config');
    }

    const initialStory = this.win.document.querySelector('amp-story');

    initialStory.classList.add('i-amphtml-next-story-story');
    this.element.appendChild(initialStory);
    this.storyEls_.push(initialStory);

    this.buildNavigationButtons_();

    this.preloadNextStory_();

    const nextButtonEl =
        this.win.document.querySelector('.i-amphtml-next-story-next');
    nextButtonEl.addEventListener('click', () => this.goToNext_());

    const previousButtonEl =
        this.win.document.querySelector('.i-amphtml-next-story-previous');
    previousButtonEl.addEventListener('click', () => this.goToPrevious_());

    this.gestures_.onGesture(SwipeXRecognizer, e => {
      if (e.data.first) {
        // Disable hint reappearance timeout if needed
        this.animateHideHint_();
      }
      this.pointerMoveX_(
          e.data.startX + e.data.deltaX);
    });
  }

  /** @override */
  isLayoutSupported(layout) {
    return layout == Layout.CONTAINER;
  }

  /**
   * @private
   */
  buildNavigationButtons_() {
    const buttonsEl = getNavigationButtons(this.element);
    this.win.document.body.appendChild(buttonsEl);
  }

  /**
   * @private
   */
  preloadNextStory_() {
    const nextConfigIndex = this.currentStoryIndex_;
    const nextStoryConfig = this.config_.stories[nextConfigIndex];

    if (!nextStoryConfig) {
      return;
    }

    const {url} = nextStoryConfig;

    // fetchDocument(this.win, url, {ampCors: false})
        // .then(doc => {
    const nextStory = this.win.document.createElement('iframe');
    nextStory.classList.add('i-amphtml-next-story-story');

    setImportantStyles(nextStory, {
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        transform: 'translateY(110%)'});
    // setImportantStyles(doc.body, {height: '100%'});

    nextStory.src = url;
    this.element.appendChild(nextStory);
    // this.multidocManager_.attachShadowDoc(nextStory, doc, '', {});
    this.storyEls_.push(nextStory);
        // });
  }

  /**
   * @private
   */
  goToNext_() {
    const currentStory = this.storyEls_[this.currentStoryIndex_];
    const nextStory = this.storyEls_[this.currentStoryIndex_ + 1];

    if (!nextStory) {
      return;
    }

    this.currentStoryIndex_++;

    setImportantStyles(
        nextStory,
        {height: '100%', width: '100%', transform: 'translateY(0%)'});
    setImportantStyles(currentStory, {transform: 'translateY(110%)'});

    window.requestAnimationFrame(() => {
      if (!this.storyEls_[this.currentStoryIndex_ + 1]) {
        this.preloadNextStory_();
      }
    });
  }

  /**
   * @private
   */
  goToPrevious_() {
    const currentStory = this.storyEls_[this.currentStoryIndex_];
    const previousStory = this.storyEls_[this.currentStoryIndex_ - 1];

    if (!previousStory) {
      return;
    }

    this.currentStoryIndex_--;

    setImportantStyles(
        previousStory,
        {height: '100%', width: '100%', transform: 'translateY(0%)'});
    setImportantStyles(currentStory, {transform: 'translateY(110%)'});
  }
}

AMP.extension('amp-next-story', '0.1', AMP => {
  AMP.registerElement('amp-next-story', AmpNextStory, CSS);
});
