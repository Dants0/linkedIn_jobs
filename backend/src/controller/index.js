const cheerio = require("cheerio");
const axios = require("axios");

module.exports.query = (queryObject) => {
  const query = new Query(queryObject);
  // console.log(query.url(0));
  return query.getJobs();
};

function Query(queryObj) {
  //query vars
  this.host = queryObj.host || "www.linkedin.com";

  this.keyword = queryObj.keyword?.replace(" ", "+") || "";
  this.location = queryObj.location?.replace(" ", "+") || "";
  this.dateSincePosted = queryObj.dateSincePosted || "";
  this.jobType = queryObj.jobType || "";
  this.remoteFilter = queryObj.remoteFilter || "";
  this.salary = queryObj.salary || "";
  this.experienceLevel = queryObj.experienceLevel || "";
  this.sortBy = queryObj.sortBy || "";
  //internal variable
  this.limit = Number(queryObj.limit) || 0;
}

Query.prototype.getDateSincePosted = function () {
  const dateRange = {
    "past month": "r2592000",
    "past week": "r604800",
    "24hr": "r86400",
  };
  return dateRange[this.dateSincePosted.toLowerCase()] ?? "";
};

Query.prototype.getExperienceLevel = function () {
  const experienceRange = {
    internship: "1",
    "entry level": "2",
    associate: "3",
    senior: "4",
    director: "5",
    executive: "6",
  };
  return experienceRange[this.experienceLevel.toLowerCase()] ?? "";
};
Query.prototype.getJobType = function () {
  const jobTypeRange = {
    "full time": "F",
    "full-time": "F",
    "part time": "P",
    "part-time": "P",
    contract: "C",
    temporary: "T",
    volunteer: "V",
    internship: "I",
  };
  return jobTypeRange[this.jobType.toLowerCase()] ?? "";
};
Query.prototype.getRemoteFilter = function () {
  const remoteFilterRange = {
    "on-site": "1",
    "on site": "1",
    remote: "2",
    hybrid: "3",
  };
  return remoteFilterRange[this.remoteFilter.toLowerCase()] ?? "";
};
Query.prototype.getSalary = function () {
  const salaryRange = {
    40000: "1",
    60000: "2",
    80000: "3",
    100000: "4",
    120000: "5",
  };
  return salaryRange[this.salary.toLowerCase()] ?? "";
};

/*
 * EXAMPLE OF A SAMPLE QUERY
 * https://www.linkedin.com/jobs/search/?f_E=2%2C3&f_JT=F%2CP&f_SB2=1&f_TPR=r2592000&f_WT=2%2C1&geoId=90000049&keywords=programmer&location=Los%20Angeles%20Metropolitan%20Area
 * Date Posted (Single Pick)	        f_TPR
 * Job Type (Multiple Picks)	        f_JT
 * Experience Level(Multiple Picks)	    f_E
 * On-Site/Remote (Multiple Picks)	    f_WT
 * Salary (Single Pick)	                f_SB2
 *
 */
Query.prototype.url = function (start) {
  let query = `https://${this.host}/jobs-guest/jobs/api/seeMoreJobPostings/search?`;
  if (this.keyword !== "") query += `keywords=${this.keyword}`;
  if (this.location !== "") query += `&location=${this.location}`;
  if (this.getDateSincePosted() !== "")
    query += `&f_TPR=${this.getDateSincePosted()}`;
  if (this.getSalary() !== "") query += `&f_SB2=${this.getSalary()}`;
  if (this.getExperienceLevel() !== "")
    query += `&f_E=${this.getExperienceLevel()}`;
  if (this.getRemoteFilter() !== "") query += `&f_WT=${this.getRemoteFilter()}`;
  if (this.getJobType() !== "") query += `&f_JT=${this.getJobType()}`;
  query += `&start=${start}`;
  if (this.sortBy == "recent" || this.sortBy == "relevant") {
    let sortMethod = "R";
    if (this.sortBy == "recent") sortMethod = "DD";
    query += `&sortBy=${sortMethod}`;
  }
  return encodeURI(query);
};

Query.prototype.getJobs = async function () {
  try {
    let parsedJobs,
      resultCount = 1,
      start = 0,
      jobLimit = this.limit,
      allJobs = [];

    while (resultCount > 0) {

      const { data } = await axios.get(this.url(start));


      const $ = cheerio.load(data);
      const jobs = $("li");

      resultCount = jobs.length;
      console.log("I got ", jobs.length, " jobs");

      parsedJobs = parseJobList(data);
      allJobs.push(...parsedJobs);


      start += 25;

      if (jobLimit != 0 && allJobs.length > jobLimit) {
        while (allJobs.length != jobLimit) allJobs.pop();
        return allJobs;
      }
    }

    return allJobs;
  } catch (error) {
    console.error(error);
  }
};
function parseJobList(jobData) {
  const $ = cheerio.load(jobData);
  const jobs = $("li");

  const jobObjects = jobs
    .map((index, element) => {
      const job = $(element);
      const position = job.find(".base-search-card__title").text().trim() || "";
      const company =
        job.find(".base-search-card__subtitle").text().trim() || "";
      const location =
        job.find(".job-search-card__location").text().trim() || "";
      const date = job.find("time").attr("datetime") || "";
      const salary =
        job
          .find(".job-search-card__salary-info")
          .text()
          .trim()
          .replace(/\n/g, "")
          .replaceAll(" ", "") || "";
      const jobUrl = job.find(".base-card__full-link").attr("href") || "";
      const companyLogo =
        job.find(".artdeco-entity-image").attr("data-ghost-url") || "";
      const agoTime =
        job.find(".job-search-card__listdate").text().trim() || "";
      return {
        position: position,
        company: company,
        companyLogo: companyLogo,
        location: location,
        date: date,
        agoTime: agoTime,
        salary: salary,
        jobUrl: jobUrl,
      };
    })
    .get();

  return jobObjects;
}
