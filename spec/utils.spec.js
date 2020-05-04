const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  const commentInput = [{
    body:
      "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    belongs_to: "They're not exactly dogs, are they?",
    created_by: 'butter_bridge',
    votes: 16,
    created_at: 1511354163389,
  },
  {
    body:
      'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
    belongs_to: 'Living in the shadow of a great man',
    created_by: 'butter_bridge',
    votes: 14,
    created_at: 1479818163389,
  },]
  test('When passed an empty array returns an empty array', () => {
    expect(formatDates([])).toEqual([]);
  });
  test('Changes timestamp to readable format', () => {
    expect(formatDates([{created_at: 1511354163389}])).toEqual([{created_at: new Date(1511354163389)}])
  })
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});


