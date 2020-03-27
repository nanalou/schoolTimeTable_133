const getJobs = require('./main');


describe("Returns the job-Data", () => {
  test("there should be a getJobs function", () => {
    expect(getJobs).toBeDefined();
  })
})