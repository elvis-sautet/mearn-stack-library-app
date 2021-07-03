const moment = require("moment");

module.exports = {
  formatDate: (date, format) => {
    return moment(date).format(format);
  },
  checkSelected: (select, options) => {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected="selected"$&'
      );
  },
};
