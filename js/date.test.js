const {createWeekCalculator} = require('./date');

describe("weekCalc", () => {
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
    const date = createWeekCalculator('')
  })
})