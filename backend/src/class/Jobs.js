class Jobs {
    jobSetupDefault(){
        const jobsDefault = {
            keyword: "Development",
            location: "Brazil",
            dateSincePosted: "past month",
            jobType: "full time",
            remoteFilter: "remote",
            salary: "100000",
            experienceLevel: "",
            limit: "20",
            sortBy: "relevant",
        }
        return jobsDefault        
    }

    searchJobByKeyword(keyword){
        const jobsDefault = {
            keyword: keyword,
            location: "Brazil",
            dateSincePosted: "past Week",
            jobType: "full time",
            remoteFilter: "remote",
            salary: "100000",
            experienceLevel: "associate",
            limit: "100",
            sortBy: "relevant",
        }
        return jobsDefault   
    }

}


module.exports = Jobs