'use strict'

require('./utils./thresholds.js')

/**
 * @example balancer
 * @param {object} request
 * @param {object} response
 * @param {function} next
 */
node.use(function(request, response, next) {
  let [identity] = request.contact;

  if (blacklist.includes(identity)) {
    return next(new Error('Go away!'));
  }

  next();
});