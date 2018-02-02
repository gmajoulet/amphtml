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
import {EventType, dispatch} from './events';
import {renderAsElement} from './simple-template';
import {dict} from '../../../src/utils/object';
import {dev} from '../../../src/log';
import {Services} from '../../../src/services';
import {ProgressBar} from './progress-bar';
import {getMode} from '../../../src/mode';
import {matches} from '../../../src/dom';
import {DevelopmentModeLog, DevelopmentModeLogButtonSet} from './development-ui'; // eslint-disable-line max-len
import {createShadowRoot} from '../../../src/shadow-embed';
import {CSS} from '../../../build/system-layer-0.1.css';


/** @private @const {string} */
const MUTE_CLASS = 'i-amphtml-story-mute-audio-control';

/** @private @const {string} */
const UNMUTE_CLASS = 'i-amphtml-story-unmute-audio-control';

/** @private @const {string} */
const AUDIO_MUTED_ATTRIBUTE = 'muted';

/** @private @const {string} */
const DESKTOP_ATTRIBUTE = 'desktop';

/** @private @const {string} */
const DISABLED_ATTRIBUTE = 'disabled';

/** @private @const {!./simple-template.ElementDef} */
const TEMPLATE = {
  tag: 'aside',
  attrs: dict({'class': 'i-amphtml-story-system-layer'}),
  children: [
    {
      tag: 'div',
      attrs: dict({'class': 'i-amphtml-story-ui-left'}),
      children: [
        {
          tag: 'div',
          attrs: dict({
            'role': 'button',
            'class': UNMUTE_CLASS + ' i-amphtml-story-button',
          }),
        },
        {
          tag: 'div',
          attrs: dict({
            'role': 'button',
            'class': MUTE_CLASS + ' i-amphtml-story-button',
          }),
        },
      ],
    },
    {
      tag: 'div',
      attrs: dict({'class': 'i-amphtml-story-ui-right'}),
      children: [
        {
          tag: 'div',
          attrs: dict({
            'role': 'button',
            'class': UNMUTE_CLASS + ' i-amphtml-story-button',
          }),
        },
        {
          tag: 'div',
          attrs: dict({
            'role': 'button',
            'class': MUTE_CLASS + ' i-amphtml-story-button',
          }),
        },
      ],
    },
  ],
};


/**
 * System Layer (i.e. UI Chrome) for <amp-story>.
 * Chrome contains:
 *   - mute/unmute button
 *   - story progress bar
 *   - bookend close butotn
 */
export class SystemLayer {
  /**
   * @param {!Window} win
   */
  constructor(win) {
    /** @private {!Window} */
    this.win_ = win;

    /** @private {boolean} */
    this.isBuilt_ = false;

    /**
     * Root element containing the shadow DOM.
     * @private {?Element}
     */
    this.root_ = null;

    /**
     * Actual system layer, inside the shadow DOM.
     * @private {?Element}
     */
    this.systemLayerEl_ = null;

    /** @private {?Element} */
    this.muteAudioBtn_ = null;

    /** @private {?Element} */
    this.unmuteAudioBtn_ = null;

    /** @private @const {!ProgressBar} */
    this.progressBar_ = ProgressBar.create(win);

    /** @private {!DevelopmentModeLog} */
    this.developerLog_ = DevelopmentModeLog.create(win);

    /** @private {!DevelopmentModeLogButtonSet} */
    this.developerButtons_ = DevelopmentModeLogButtonSet.create(win);
  }

  /**
   * @param {number} pageCount The number of pages in the story.
   * @return {!Element}
   */
  build(pageCount) {
    if (this.isBuilt_) {
      return this.getRoot();
    }

    this.isBuilt_ = true;

    this.root_ = this.win_.document.createElement('div');
    const shadowRoot = createShadowRoot(this.root_);

    this.systemLayerEl_ = renderAsElement(this.win_.document, TEMPLATE);
    this.systemLayerEl_.insertBefore(
        this.progressBar_.build(pageCount), this.systemLayerEl_.lastChild);

    const style = this.win_.document.createElement('style');
    style./*OK*/textContent = CSS;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.systemLayerEl_);

    this.buildForDevelopmentMode_();

    this.addEventHandlers_();

    return this.getRoot();
  }

  /**
   * @private
   */
  buildForDevelopmentMode_() {
    if (!getMode().development) {
      return;
    }

    const leftButtonTray =
        this.systemLayerEl_.querySelector('.i-amphtml-story-ui-left');
    leftButtonTray.appendChild(this.developerButtons_.build(
        this.developerLog_.toggle.bind(this.developerLog_)));
    this.systemLayerEl_.appendChild(this.developerLog_.build());
  }

  /**
   * @private
   */
  addEventHandlers_() {
    // TODO(alanorozco): Listen to tap event properly (i.e. fastclick)
    this.systemLayerEl_.addEventListener('click', e => {
      const target = dev().assertElement(e.target);

      if (matches(target, `.${MUTE_CLASS}, .${MUTE_CLASS} *`)) {
        this.onMuteAudioClick_(e);
      } else if (matches(target, `.${UNMUTE_CLASS}, .${UNMUTE_CLASS} *`)) {
        this.onUnmuteAudioClick_(e);
      }
    });
  }

  /**
   * @return {!Element}
   */
  getRoot() {
    return dev().assertElement(this.root_);
  }

  /**
   * @param {!Event} e
   * @private
   */
  onMuteAudioClick_(e) {
    this.dispatch_(EventType.MUTE, e);
  }

  /**
   * @param {!Event} e
   * @private
   */
  onUnmuteAudioClick_(e) {
    this.dispatch_(EventType.UNMUTE, e);
  }

  /**
   * @param {string} eventType
   * @param {!Event=} opt_event
   * @private
   */
  dispatch_(eventType, opt_event) {
    if (opt_event) {
      dev().assert(opt_event).stopPropagation();
    }

    dispatch(this.getRoot(), eventType, /* opt_bubbles */ true);
  }

  /**
   * @param {number} pageIndex The index of the new active page.
   * @public
   */
  setActivePageIndex(pageIndex) {
    this.progressBar_.setActivePageIndex(pageIndex);
  }

  /**
   * @param {number} pageIndex The index of the page whose progress should be
   *     changed.
   * @param {number} progress A number from 0.0 to 1.0, representing the
   *     progress of the current page.
   * @public
   */
  updateProgress(pageIndex, progress) {
    this.progressBar_.updateProgress(pageIndex, progress);
  }

  /**
   * Toggles disabled attribute on element, which triggers a different UI style.
   * Used in cases where we can not click on the system layer, like when the
   * bookend is visible.
   * @param {boolean} isDisabled
   * @public
   */
  toggleDisabledAttribute(isDisabled) {
    if (isDisabled) {
      this.systemLayerEl_.setAttribute(DISABLED_ATTRIBUTE, '');
      this.systemLayerEl_.setAttribute('aria-hidden', 'true');
    } else {
      this.systemLayerEl_.removeAttribute(DISABLED_ATTRIBUTE);
      this.systemLayerEl_.removeAttribute('aria-hidden');
    }
  }

  /**
   * Toggles mute or unmute attribute on element.
   * @param {boolean} isMuted
   * @public
   */
  toggleMutedAttribute(isMuted) {
    if (isMuted) {
      this.systemLayerEl_.setAttribute(AUDIO_MUTED_ATTRIBUTE, '');
    } else {
      this.systemLayerEl_.removeAttribute(AUDIO_MUTED_ATTRIBUTE);
    }
  }

  /**
   * Toggles mute or unmute attribute on element.
   * @param {boolean} isMuted
   * @public
   */
  toggleDesktopAttribute(isDesktop) {
    if (isDesktop) {
      this.systemLayerEl_.setAttribute(DESKTOP_ATTRIBUTE, '');
    } else {
      this.systemLayerEl_.removeAttribute(DESKTOP_ATTRIBUTE);
    }
  }

  /**
   * @return {boolean} Whether the story is currently muted.
   */
  isMuted() {
    return this.systemLayerEl_.hasAttribute(AUDIO_MUTED_ATTRIBUTE);
  }

  /**
   * Marks the story as having audio playing on the active page.
   */
  audioPlaying() {
    this.systemLayerEl_.classList.add('audio-playing');
  }

  /**
   * Marks the story as not having audio playing on the active page.
   */
  audioStopped() {
    this.systemLayerEl_.classList.remove('audio-playing');
  }

  /**
   * @param {!./logging.AmpStoryLogEntryDef} logEntry
   * @private
   */
  logInternal_(logEntry) {
    this.developerButtons_.log(logEntry);
    this.developerLog_.log(logEntry);
  }

  /**
   * Logs an array of entries to the developer logs.
   * @param {!Array<!./logging.AmpStoryLogEntryDef>} logEntries
   */
  logAll(logEntries) {
    if (!getMode().development) {
      return;
    }

    Services.vsyncFor(this.win_).mutate(() => {
      logEntries.forEach(logEntry => this.logInternal_(logEntry));
    });
  }

  /**
   * Logs a single entry to the developer logs.
   * @param {!./logging.AmpStoryLogEntryDef} logEntry
   */
  log(logEntry) {
    if (!getMode().development) {
      return;
    }

    this.logInternal_(logEntry);
  }

  /**
   * Clears any state held by the developer log or buttons.
   */
  resetDeveloperLogs() {
    if (!getMode().development) {
      return;
    }

    this.developerButtons_.clear();
    this.developerLog_.clear();
  }

  /**
   * Sets the string providing context for the developer logs window.  This is
   * often the name or ID of the element that all logs are for (e.g. the page).
   * @param {string} contextString
   */
  setDeveloperLogContextString(contextString) {
    if (!getMode().development) {
      return;
    }

    this.developerLog_.setContextString(contextString);
  }

  /**
   * Toggles the visibility of the developer log.
   * @private
   */
  toggleDeveloperLog_() {
    if (!getMode().development) {
      return;
    }

    this.developerLog_.toggle();
  }

  /**
   * Hides the developer log in the UI.
   */
  hideDeveloperLog() {
    if (!getMode().development) {
      return;
    }

    this.developerLog_.hide();
  }
}
