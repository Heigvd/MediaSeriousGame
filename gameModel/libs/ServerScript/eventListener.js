/*
 * Wegas
 * http://wegas.albasim.ch
 *
 * Copyright (c) 2013-2021  School of Management and Engineering Vaud, Comem, MEI
 * Licensed under the MIT License
 */

if (WegasHelper) {
  WegasHelper.registerReplyValidateListener(function (message) {
    PMGHelper.sendHistory(message);
  });

  WegasHelper.registerWhValidateListener(function (message) {
    PMGHelper.sendHistory(message);
  });
}
