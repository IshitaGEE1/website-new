const axios = require('axios');

const GreenhouseConfig = {
  src: "https://boards.greenhouse.io/embed/job_board/js?for=productsup",
  body: true
};

const GreenhouseAdapter = {

  getJobs: async function () {
    const response = await axios.get('https://boards-api.greenhouse.io/v1/boards/productsup/jobs?content=true');
    return response.data.jobs;
  },

  getJob: async function(jobId) {
    const response = await axios.get(`https://boards-api.greenhouse.io/v1/boards/productsup/jobs/${jobId}`);
    return response.data;
  },

  getOffices: async function () {
    const response = await axios.get('https://boards-api.greenhouse.io/v1/boards/productsup/offices?content=true');
    return response.data.offices;
  },

  getDepartments: async function () {
    const response = await axios.get('https://boards-api.greenhouse.io/v1/boards/productsup/departments?content=true');
    return response.data.departments;
  }
}

module.exports = {
  GreenhouseAdapter,
  ...GreenhouseConfig
}
