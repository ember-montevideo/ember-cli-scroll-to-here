import Ember from 'ember';
import layout from '../templates/components/scroll-to-here';

let $ = Ember.$;

function Window() {
  let w = $(window);

  this.top = w.scrollTop();
  this.bottom = this.top + (w.prop('innerHeight') || w.height());
}

function Target(selector) {
  let target = $(selector);

  this.isEmpty = !target.length;
  this.top = target.offset().top;
  this.bottom = this.top + target.height();
}

Target.prototype.isOffscreen = function() {
  let w = new Window();

  return this.top < w.top || this.bottom > w.bottom;
};

Target.prototype.scroll = function() {
  if (!this.isEmpty && this.isOffscreen()) {
    Ember.run.schedule('afterRender', () => {
      $('html,body').animate({ scrollTop: this.top }, 1000);
    });
  }
};

function scrollTo(selector) {
  new Target(selector).scroll();
}

export default Ember.Component.extend({
  layout: layout,

  scrollToComponent: Ember.on('didInsertElement', function() {
    scrollTo(`#${this.elementId}`);
  })
});
