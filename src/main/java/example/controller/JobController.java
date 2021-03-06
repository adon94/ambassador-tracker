package example.controller;

import example.model.BrandAmbassadorDO;
import example.model.JobDO;
import example.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/job")
public class JobController {

    private final JobService jobService;

    @Autowired
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

//    @CrossOrigin
    @RequestMapping(value="/create", method= RequestMethod.POST)
    public @ResponseBody
    JobDO createJob(@RequestBody JobDO job) throws Exception {

        return jobService.create(job);
    }

    @RequestMapping(value="/accept/{id}", method= RequestMethod.POST)
    public @ResponseBody
    JobDO updateToAccepted(@RequestBody JobDO jobDO, @PathVariable("id") Long id) throws Exception {
        BrandAmbassadorDO invited = new BrandAmbassadorDO();
        System.out.println("Title is: " + jobDO.getCompany());
        invited.setId(id);
        return this.jobService.updateToAccepted(jobDO, id);
    }

    @RequestMapping(value="/decline/{id}", method= RequestMethod.POST)
    public @ResponseBody
    JobDO updateToDeclined(@RequestBody JobDO jobDO, @PathVariable("id") Long id) throws Exception {
        BrandAmbassadorDO invited = new BrandAmbassadorDO();
        System.out.println("Title is: " + jobDO.getCompany());
        invited.setId(id);
        return this.jobService.updateToDeclined(jobDO, id);
    }

    @RequestMapping(value = "/view/{id}", method = RequestMethod.GET)
    public @ResponseBody
    JobDO getJob(@PathVariable("id") Long id) throws Exception {

        JobDO job = this.jobService.view(id);
//        JobDO job = new JobDO(1,1,1,1,true,"","","",2.5,"","");
//        System.out.println(job.getTitle());

        return job;
    }

//    @CrossOrigin
    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public @ResponseBody
    List<JobDO> getAll() throws Exception {

        List<JobDO> job = this.jobService.getAll();
        return job;
    }

    @RequestMapping("/remove/{id}")
    public @ResponseBody
    Map<String, String> removeJob(@PathVariable("id") Long id) throws Exception{
        this.jobService.removeJob(id);
        Map<String, String> m = new HashMap<>();
        m.put("result", "success");
        return m;
    }

    @RequestMapping(value = "/invited/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<JobDO> findByInvitedId(@PathVariable("id") Long id) throws Exception {

        List<JobDO> jobs = this.jobService.findByInvitedId(id);
        return jobs;
    }

    @RequestMapping(value = "/accepted/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<JobDO> findByAcceptedId(@PathVariable("id") Long id) throws Exception {

        List<JobDO> jobs = this.jobService.findByAcceptedId(id);
        return jobs;
    }

    @RequestMapping(value = "/declined/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<JobDO> findByDeclinedId(@PathVariable("id") Long id) throws Exception {

        List<JobDO> jobs = this.jobService.findByDeclinedId(id);
        return jobs;
    }

    @RequestMapping(value = "/employee/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<JobDO> findByEmployeeId(@PathVariable("id") Long id) throws Exception {

        List<JobDO> jobs = this.jobService.findByEmployeeId(id);
        return jobs;
    }

    @RequestMapping(value = "/overlap", method = RequestMethod.POST)
    public @ResponseBody
    List<JobDO> findByEmployeeId(@RequestBody JobDO job) throws Exception {

        List<JobDO> jobs = this.jobService.findOverlappers(job.getStartDate(), job.getEndDate());
        return jobs;
    }
}
