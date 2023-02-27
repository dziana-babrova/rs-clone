import { STYLE } from '../AppConstants';

const WINNERS_POPUP = {
  margin: 30,

  rowFill: {
    padding: 10,
    radius: 14,
    lineWidth: 3,
  },

  winnerImage: {
    width: 26,
  },

  starImage: {
    width: 26,
  },

  indexText: {
    style: {
      fontFamily: STYLE.font,
      fontSize: '28px',
      color: STYLE.darkText,
      align: 'center',
    },
  },

  winnerText: {
    style: {
      fontFamily: STYLE.font,
      fontSize: '30px',
      color: STYLE.lightText,
      align: 'center',
    },
  },

  starText: {
    style: {
      fontFamily: STYLE.font,
      fontSize: '28px',
      color: STYLE.lightText,
      align: 'center',
    },
  },
};

export default WINNERS_POPUP;
