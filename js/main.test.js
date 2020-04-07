const { toShortTime, createOptions, cell } = require('./main');

describe("shorts the time-string", () => {
  test("createWeekCalculator function is given", () => {
    expect(toShortTime).toBeDefined();
  }),
  test("should short the time to only hours and min", () => {
    const time = '23:50:44';
    expect(toShortTime(time)).toBe('23:50');
  })
});

describe("create html component", () => {
  test("cell function is given", () => {
    expect(cell).toBeDefined();
  })
  test("cell-component renders correctly", () => {
    expect(cell('test')).toMatchSnapshot();
  })
  test("createOption function is given", () => {
    expect(createOptions).toBeDefined();
  })
  test("option-component renders correctly", () => {
    const data = [ 
      id => '42',
      name => 'testName'
    ];
    expect(createOptions(data, ['id', 'name'])).toMatchSnapshot();
  })
})
