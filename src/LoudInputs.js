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
    };
  }

  constructor() {
    super();
    this.sound = 'click';
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
    this.addEventListener('mouseup', this.__handleMouseUp);
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
    if (isTargetValid(event.target)) {
      this.__playSound('down');
    }
  }

  __handleMouseUp(event) {
    if (isTargetValid(event.target)) {
      this.__playSound('up');
    }
  }

  __handleButtonEvent() {
    this.__playSound();
  }

  __playSound(eventType) {
    const { audioContext, oscillator, gainNode } = this;

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
    // add some sort of sound-queue?

    setTimeout(() => {
      gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.03);
    }, 50);
  }
}
