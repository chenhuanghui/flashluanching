/**
 * Routes
 *
 * Sails uses a number of different strategies to route requests.
 * Here they are top-to-bottom, in order of precedence.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {

  // Client authorization endPoints

  '/': {
    view: 'index'
  },
  'get /login': {
    view: 'login'
  },
  'post /login': {
    controller: 'Auth',
    action: 'login'
  },
  'get /logout': {
    controller: 'Auth',
    action: 'logout'
  },

  // Resources endPoints

  '/info': {
    controller: 'InfoController',
    action: 'index'
  },

  'put /user': {
    controller: 'UserController',
    action: 'update'
  }

}
