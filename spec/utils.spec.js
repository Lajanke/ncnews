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
    expect(Object.keys(output[1])).toEqual(['body', 'belongs_to', 'created_by', 'votes', 'created_at'])
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

describe('makeRefObj', () => {
  const input = [
    { 'article_id': 1, 'title': 'A' },
    { 'article_id': 2, 'title': 'B' },
    { 'article_id': 3, 'title': 'C' },
  ];
  const output = { 'A': 1, 'B': 2, 'C': 3 }
  test('When passed an empty array, returns an empty object', () => {
    expect(makeRefObj([])).toEqual({});
  });
  test('Returns a lookup object with a key of title and a value of article_id', () => {
    expect(makeRefObj([{ 'article_id': 1, 'title': 'A' }], 'title', 'article_id')).toEqual({ 'A': 1 });
  });
  test('Works for longer arrays', () => {
    expect(makeRefObj(input, 'title', 'article_id')).toEqual(output);
  });
  test('Does not mutate input', () => {
    makeRefObj(input)
    expect(input).toEqual([
      { 'article_id': 1, 'title': 'A' },
      { 'article_id': 2, 'title': 'B' },
      { 'article_id': 3, 'title': 'C' },
    ]);
  });
});

describe('formatComments', () => {
  const input = [{
    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    belongs_to: "They're not exactly dogs, are they?",
    created_by: 'butter_bridge',
    votes: 16,
    created_at: 1511354163389,
  }];

  const input2 = [{
    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
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
  },];

  test('When passed an empty array returns an empty array', () => {
    expect(formatComments([])).toEqual([]);
  });
  test('When passed a single comment object changes the keys', () => {
    output = formatComments(input, { "They're not exactly dogs, are they?": 1 });
    expect(output[0]).toHaveProperty('author');
    expect(output[0]).toHaveProperty('article_id');
    expect(output[0].article_id).toEqual(1);
    expect(output[0]).not.toHaveProperty('belongs_to');
    expect(output[0]).not.toHaveProperty('created_by');
  });
  test('Formats the timestamp on created_at property', () => {
    output = formatComments(input, { "They're not exactly dogs, are they?": 1 });
    expect(output[0].created_at).toEqual(new Date(input[0].created_at));
  });
  test('Works for multiple entries in an array', () => {
    articleRef = {
      "They're not exactly dogs, are they?": 1,
      'Living in the shadow of a great man': 2,
    };
    output = formatComments(input2, articleRef);
    output.forEach(comment => {
      expect(comment).toHaveProperty('author');
      expect(comment).toHaveProperty('article_id');
      expect(comment).toHaveProperty('body');
      expect(comment).toHaveProperty('votes');
      expect(comment).toHaveProperty('created_at');
      expect(comment).not.toHaveProperty('belongs_to');
      expect(comment).not.toHaveProperty('created_by');
    });
  });
  test('Does not mutate input array', () => {
    formatComments(input2, articleRef);
    expect(input2[1]).toEqual({
      body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 14,
      created_at: 1479818163389,
    });
  });
});


