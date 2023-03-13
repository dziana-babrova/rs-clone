import { STYLE } from '../AppConstants';

const ERROR_POPUP = {
  margin: 10,

  rowFill: {
    padding: 10,
    radius: 14,
    lineWidth: 3,
  },

  text: {
    style: {
      fontFamily: STYLE.font,
      fontSize: '30px',
      color: STYLE.darkText,
      align: 'center',
      wordWrap: {
        width: 540,
      },
    },
  },
};

export default ERROR_POPUP;
