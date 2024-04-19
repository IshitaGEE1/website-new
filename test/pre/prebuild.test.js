const contentful = require("../../plugins/contentful");
const greenhouseUrl = "https://boards.greenhouse.io/embed/job_board/js?for=productsup";
const axios = require('axios');

describe("API availability", () => {
  test("Contentful", async () => {
    try {
      const client = contentful.createClient();
      const pages = await client.getEntries({'content_type': 'page', 'limit': 0});
      expect(pages.total).toBeGreaterThan(0);
    } catch (err) {
      throw err;
    }
  });

  test("Greenhouse", async () => {
    try {
      const response = await axios.get(greenhouseUrl);
      expect(response.status).toBe(200);
    } catch (err) {
      throw err;
    }
  });
});
