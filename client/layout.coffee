Transitioner.transition({
  fromRoute: 'home',
  toRoute: 'commands',
  velocityAnimation: {
    in: 'transition.fadeIn'
    out: 'transition.fadeOut'
  }
});

Transitioner.transition({
  fromRoute: 'commands',
  toRoute: 'home',
  velocityAnimation: {
    in: 'transition.fadeIn'
    out: 'transition.fadeOut'
  }
});
