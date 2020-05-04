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
  test('Alters timestamp to readable format', () => {
    expect(formatDates([{ created_at: 1511354163389 }])).toEqual([{ created_at: new Date(1511354163389) }])
  });
  test('Alters timestamp to JS object for multiple items in an array', () => {
    output = formatDates(commentInput);
    expect(output[0].created_at).toEqual(new Date(commentInput[0].created_at));
    expect(output[1].created_at).toEqual(new Date(commentInput[1].created_at));
  });
  test('Does not alter any other data in the object', () => {
    output = formatDates(commentInput);
    expect(Object.keys(output[0])).toEqual(['body', 'belongs_to', 'created_by', 'votes', 'created_at'])
    expect(output[0]).toEqual(
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: new Date(commentInput[0].created_at),
      });
  });
  test('Does not mutate input array', () => {
    formatDates(commentInput)
    expect(commentInput[0]).toEqual(
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389,
      });
  });
});

describe('makeRefObj', () => { });

describe('formatComments', () => { });


