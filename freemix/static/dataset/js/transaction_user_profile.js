(function($, Transaction) {
  var UserTransactionsView, PendingTransactionView;

  /**
   * Display and poll the status of a single DataSourceTransaction
   * @constructor
   * @param {HTML Element} options.el - DOM Element containing single transaction
   */
  PendingTransactionView = function(options) {
    var profileURL = options.el.$('.dataset-title a').attr('href');
    this.transaction = new Transaction({profileURL: profileURL});
    this.el = options.el;
    this.status = this.el.$('.status');
  };

  /** 
   * Handles DOM manipulation on a successful ajax request
   * @param {string} data - Data returned from successful jquery ajax request
   */
  PendingTransactionView.prototype.pollSuccess = function(data) {
    // TODO: Are we hard-coding a check for this.status = 'Successful'?
    if ($.isEmptyObject(data)) {
      setTimeout($.proxy(this.render, this), 5000);
    } else {
    }
  };

  /** 
   * Handles DOM manipulation on a failed ajax request
   * @param {string} data - Data returned from successful jquery ajax request
   */
  PendingTransactionView.prototype.pollError = function() {
    this.status.html('Please try to reload the page later.');
  };

  /** Controls display of PendingTransactionView */
  PendingTransactionView.prototype.render = function() {
    var success = $.proxy(this.pollSuccess, this)
    var error = $.proxy(this.pollError, this)

    this.transaction.sync({
      success: success,
      error: error
    });
  };

  /**
   * Display a list of DataSourceTransactions for a user.
   * @constructor
   * @param {array of HTML Elements} options.transactions - transaction DOM elements
   */
  UserTransactionsView = function(options) {
    this.transactions = [];
    for (var i = 0; i < options.transactions.length; i++) {
      this.transactions.push(
        new PendingTransactionView({el: options.transactions[i]})
      );
    }
  };

  UserTransactionsView.prototype.render = function() {
    for (var i = 0; i < options.transactions.length; i++) {
      this.transactions[i].render();
    }
  };
})($, window.FreemixTransaction);
