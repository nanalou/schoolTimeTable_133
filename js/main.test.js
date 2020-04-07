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

// describe("Returns the job-Data", () => {
//   test("there should be a getJobs function", () => {
//     expect(getJobs).toBeDefined();
//   })
// })