jest.mock('./main');

test('displays a user after a click', () => {
  // Set up our document body
  document.body.innerHTML = `
        <div id="tableContainer" class="max-w-4xl rounded overflow-hidden relative shadow-lg bg-white m-8">
            <div class="overflow-x-auto m-4 p-2">
                <table class="table-fixed">
                    <thead>
                        <tr>
                            <th class="w-1/7 px-4 py-2">Datum</th>
                            <th class="w-1/7 px-4 py-2">Wochentag</th>
                            <th class="w-1/7 px-4 py-2">Von</th>
                            <th class="w-1/7 px-4 py-2">Bis</th>
                            <th class="w-1/7 px-4 py-2">Lehrer</th>
                            <th class="w-1/7 px-4 py-2">Fach</th>
                            <th class="w-1/7 px-4 py-2">Raum</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                    </tbody>
                </table>
                <div id="noSchedule"
                    class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md m-6">
                    <div class="container justify-center inline-flex">
                        <div class=""><svg class="fill-current h-6 w-6 text-teal-500 mr-4"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path
                                    d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                            </svg></div>
                        <div>
                            <p class="font-bold">There is no schedule this week.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container justify-center inline-flex mb-6">
                <button id="prevBtn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
                    Prev
                </button>
                <div class="m-2" id="datePreview"></div>
                <button id="nextBtn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
                    Next
                </button>
            </div>
        </div>
  `;

  require('./nextTimetable');

  const $ = require('jquery');
  const app = require('./main');

  // Tell the fetchCurrentUser mock function to automatically invoke
  // its callback with some data
  app.mockImplementation(cb => {
    cb({
      fullName: 'Johnny Cash',
      loggedIn: true,
    });
  });

  // Use jquery to emulate a click on our button
  $('#button').click();

  // Assert that the fetchCurrentUser function was called, and that the
  // #username span's inner text was updated as we'd expect it to.
  expect(app).toBeCalled();
  expect($('#username').text()).toEqual('Johnny Cash - Logged In');
});

const $ = require('jquery');
const app = require('./main');