const {createWeekCalculator} = require('./main');

describe("weekCalc", () => {
  test("should return the current week-number", () => {
    const date = createWeekCalculator('2020-01-02');
    expect(date.getWeekString()).toBe('1-2020');
  })
  test("createWeekCalculator function is given", () => {
    expect(createWeekCalculator).toBeDefined();
  })
  test("sub Week", () => {
    const date = createWeekCalculator('2020-01-08');
    date.subtractWeek();
    expect(date.getWeekString()).toBe('1-2020');
  })
  test("add Week", () => {
    const date = createWeekCalculator('2020-01-01');
    date.addWeek();
    expect(date.getWeekString()).toBe('2-2020');
  })
  test("year switch", () => {
    const date = createWeekCalculator('2020-01-01');
    date.subtractWeek();
    expect(date.getWeekString()).toBe('52-2019');

    const date2 = createWeekCalculator('2020-12-28');
    date2.addWeek();
    expect(date2.getWeekString()).toBe('1-2021');
  })
  test("go through all the weeks", () => {
    const date = createWeekCalculator('2020-01-01');
    let i = 0;
    while (i < 52) {
      date.addWeek();
      i++;
    }
    expect(date.getWeekString()).toBe('53-2020');
  })
  test("is the european calendar week", () => {
    const date = createWeekCalculator('2020-01-05');
    expect(date.getWeekString()).toBe('1-2020');
  })
})
