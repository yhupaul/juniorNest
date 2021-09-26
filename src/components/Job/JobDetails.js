import React, { useState, useEffect } from "react";
import { Box, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { format } from "date-fns";
import { useViewJobStyle } from '../Helper/StyleHelper';
import UserApplyJob from "./UserApplyJob";
import { useParams } from "react-router";
import useApplicationData from "../Helper/AppHelper";
import { firestore, app } from "../../Firebase/config";



export default (props) => {
  // const { fetchUniqueJobDetails, jobssetJobs } = useApplicationData();
  const [applyJob, setApplyJob] = useState(false);
  const [jobInfo, setJobInfo] = useState([])
  const params = useParams();
  const classes = useViewJobStyle();

  const fetchUniqueJobDetails = async (inputId) => {
    const jobInfo = firestore.collection('job_posts').doc(inputId.jobId);
    const doc = await jobInfo.get();  
    const tempJob = doc.data()
    setJobInfo(tempJob);
  }
  
  useEffect(() => {
    fetchUniqueJobDetails(params)
  }, [])
  

  const handleClickOpen = () => {
    setApplyJob(true);
  };

  const handleClose = () => {
    setApplyJob(false);
  };

  return (
    <>
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center"> 
        {jobInfo.title}
 
      </Box>      
    </DialogTitle>  

    <DialogContent>

      <Box>

        <Box className={classes.info} display="flex" key="job-title">
          <Typography variant="caption" key="job-title-label">Job Title: </Typography>
          <Typography variant="body2" key="job-title-field">{jobInfo.title}</Typography>
        </Box>
        <Box className={classes.info} display="flex" key="contract-type">
          <Typography variant="caption" key="contract-type-label">Contract Type: </Typography>
          <Typography variant="body2" key="contract-type-field">{jobInfo.position}</Typography>
        </Box>
        <Box className={classes.info} display="flex" key="location">
          <Typography variant="caption" key="location-label">Location: </Typography>
          <Typography variant="body2" key="location-field">{jobInfo.remote}</Typography>
        </Box>
        <Box className={classes.info} display="flex" key="skills">
          <Typography variant="caption" key="skills-label">Skills: </Typography>
          <Typography variant="body2" key="skills-field">{jobInfo.skill}</Typography>
        </Box>
        <Box className={classes.info} display="flex" key="salary">
          <Typography variant="caption" key="salary-label">Salary: </Typography>
          <Typography variant="body2" key="salary-field">${jobInfo.salary}</Typography>
        </Box>
        <Box className={classes.info} display="flex" key="description">
          <Typography variant="caption" key="description-label">Description: </Typography>
          <Typography variant="body2" key="description-field">{jobInfo.description}</Typography>
        </Box>
        <Box className={classes.info} display="flex" key="posted-on">
          <Typography variant="caption" key="post-on-label">Posted On: </Typography>
          <Typography variant="body2" key="post-on-field">
            {/* {jobInfo.post_date && format(jobInfo.post_date, "dd/MMM/yyyy")} */}
          </Typography>
        </Box>

      </Box>

    </DialogContent>
    <DialogActions>
      <Button onClick={handleClickOpen} variant="outlined">Apply</Button>
    </DialogActions>

      <UserApplyJob show={applyJob} close={handleClose} questions={props.job["questions"] } />
  
      </>
  );
};