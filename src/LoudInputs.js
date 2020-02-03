import { html, css, LitElement } from 'lit-element';

function isTargetValid(target) {
  switch (target.tagName.toLowerCase()) {
    case 'button':
    case 'input':
    case 'label':
      return true;
    default:
      return false;
  }
}

export class LoudInputs extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
      }
    `;
  }

  static get properties() {
    return {
      sound: { type: String },
      playing: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.sound = 'click';
    this.playing = false;

    this.audioQueue = [];
    this.masterGainNode = null;
    this.audioContext = new AudioContext();
    this.oscillator = this.audioContext.createOscillator(this.masterGainNode);
    this.gainNode = this.audioContext.createGain();
    this.oscillator.start();
  }

  connectedCallback() {
    super.connectedCallback();

    this.__input = this.querySelector('*');
    this.addEventListener('mousedown', this.__handleMouseDown);
    this.addEventListener('keydown', this.__handleMouseDown);
    this.addEventListener('mouseup', this.__handleMouseUp);
    this.addEventListener('keyup', this.__handleMouseUp);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('mousedown', this.__handleMouseDown);
    this.removeEventListener('mouseup', this.__handleMouseUp);
  }

  render() {
    return html`
      <slot />
    `;
  }

  __handleMouseDown(event) {
    if (event.type.includes('key')) {
      if (event.keyCode === 32) {
        this.__playSound('down');
      }
      return;
    }
    if (isTargetValid(event.target)) {
      this.__playSound('down');
    }
  }

  __handleMouseUp(event) {
    if (event.type.includes('key')) {
      if (event.keyCode === 32) {
        this.__playSound('up');
      }
      return;
    }
    if (isTargetValid(event.target)) {
      this.__playSound('up');
    }
  }

  __handleButtonEvent() {
    this.__playSound();
  }

  __playSound(eventType) {
    const { audioContext, oscillator, gainNode } = this;

    this.audioQueue.push({
      play: () =>
        new Promise(resolve => {
          switch (eventType) {
            case 'down':
              oscillator.frequency.value = 150;
              break;
            case 'up':
              oscillator.frequency.value = 200;
              break;
            default:
              break;
          }

          gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(1, audioContext.currentTime + 0.03);
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          setTimeout(() => {
            gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.03);
            resolve();
          }, 50);
        }),
    });

    // this doesn't work because executes on all events
    const playQueue = () => {
      if (this.audioQueue.length > 0) {
        this.audioQueue
          .shift()
          .play()
          .then(() => {
            playQueue();
          });
      } else {
        this.playing = false;
      }
    };

    if (!this.playing) {
      this.playing = true;
      playQueue();
    }
  }
}
