var MediaHelper = (function () {
  'use strict';

  var instanceCache = {}; // descId => instance

  function getInstance(descriptor) {
    var did = descriptor.getId();
    if (!instanceCache[did]) {
      instanceCache[did] = Variable.getInstance(descriptor, self);
    }
    return instanceCache[did];
  }

  function setMaxPhase(phaseNoButton) {
    var currentValue = Variable.find(gameModel, 'phaseMaxPlayer').getValue(self);
    if (currentValue >= phaseNoButton) {
      Variable.find(gameModel, 'phaseMaxPlayer').setValue(self, phaseNoButton - 1);
    } else {
      Variable.find(gameModel, 'phaseMaxPlayer').setValue(self, phaseNoButton);
    }
  }

  function unreadCount(root) {
    var i,
      child,
      children,
      current,
      instance,
      stack = [],
      counter = 0;

    stack.push(root);
    while (stack.length > 0) {
      current = stack.pop();

      switch (current.getJSONClassName()) {
        case 'ListDescriptor':
          children = current.getItems();
          for (i = 0; i < children.size(); i += 1) {
            child = children.get(i);
            stack.push(child);
          }
          break;
        case 'WhQuestionDescriptor':
        case 'QuestionDescriptor':
          counter += current.getUnreadCount(self);
          break;
        case 'DialogueDescriptor':
          counter += StateMachineFacade.countValidTransition(current, self) > 0 ? 1 : 0;
          break;

        default:
      }
    }

    return counter;
  }

  return {
    unreadCount: function (descriptorName) {
      return unreadCount(Variable.find(gameModel, descriptorName));
    },
    setMaxPhase: function (phaseNoButton) {
      return setMaxPhase(phaseNoButton);
    },
  };
})();

var PMGHelper = (function () {
  // Pseudo-PMGHelper is intentional !!
  'use strict';
  var currentPhaseDesc,
    instanceCache = {}; // descId => instance

  function getInstance(descriptor) {
    var did = descriptor.getId();
    if (!instanceCache[did]) {
      instanceCache[did] = Variable.getInstance(descriptor, self);
    }
    return instanceCache[did];
  }

  /**
   * Send a message to the current player.
   * @param {String} subject the subject of the message.
   * @param {String} content the content of the message.
   * @param {String} from the sender of the message.
   * @param {Array}  att attachment list
   */
  function sendMessage(subject, content, from, att) {
    _sendMessage('inbox', subject, content, from, att);
  }

  function sendNews(subject, content, from, att) {
    _sendMessage('news', subject, content, from, att);
  }

  function _sendMessage(inboxName, subject, content, from, att) {
    var date;

    if (typeof subject === 'string') {
      date = 'Phase ' + getCurrentPhaseNumber();
    } else {
      date = {
        '@class': 'TranslatableContent',
        translations: { def: 'Phase ' + getCurrentPhaseNumber() },
      };
    }

    getInstance(Variable.find(gameModel, inboxName)).sendMessage(
      from,
      subject,
      content,
      date,
      '',
      att || []
    );
  }

  function sendHistory(message) {
    if (message) {
      touchMessageDate(message);
      getInstance(Variable.find(gameModel, 'history')).sendMessage(message);
    }
  }

  function touchMessageDate(message) {
    I18n.foreach(function (refName, code) {
      message.getDate().updateTranslation(refName, getCurrentPhaseFullName(refName));
    }, 'gamemodel');
  }

  /**
   *
   * @returns {NumberDescriptor} current phase descriptor
   */
  function getCurrentPhase() {
    if (!currentPhaseDesc) {
      currentPhaseDesc = Variable.find(gameModel, 'phaseMSG');
    }
    return currentPhaseDesc;
  }

  /**
   *
   * @returns {Number} current phase number
   */
  function getCurrentPhaseNumber() {
    return getInstance(getCurrentPhase()).getValue();
  }

  function getCurrentPhaseFullName(refName) {
    return 'Phase ' + getCurrentPhaseNumber();
  }

  return {
    sendNews: function (from, subject, content, att) {
      return sendNews(subject, content, from, att);
    },
    sendMessage: function (from, subject, content, att) {
      return sendMessage(subject, content, from, att);
    },
    sendHistory: function (message) {
      return sendHistory(message);
    },
  };
})();
