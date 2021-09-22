import React, { useState, useEffect } from "react";
import theme from "./theme/theme";
import { Box, ThemeProvider, Grid, CircularProgress, Button } from "@material-ui/core";
import Header from "./components/Header/";
import Searchbar from "./components/Searchbar";
import JobCard from "./components/Job/JobCard";
import NewJobModal from "./components/Job/NewJobModal";
import { firestore, app } from "./Firebase/config";
import { Close as CloseIcon } from '@material-ui/icons';
import ViewJobModal from "./components/Job/ViewJobModal";



export default () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customSearch, setCustomSearch] = useState(false);
  const [newJobModal, setNewJobModal] = useState(false);
  const [viewJob, setViewJob] = useState({});

  const fetchJobs = async () => {
    setCustomSearch(false);
    setLoading(true);
    const req = await firestore
      .collection('job_posts')
      .orderBy('post_date', 'desc')
      .get();
    const tempJob = req.docs.map((job) => ({...job.data(), id: job.id, post_date: job.data().post_date.toDate()}));
    setJobs(tempJob);
    setLoading(false); 
  };

  const fetchJobsCustom = async (jobSearch) => {
    setLoading(true);
    setCustomSearch(true);
    const req = await firestore
      .collection('job_posts')
      .orderBy('post_date', 'desc')
      .where("remote", '==', jobSearch.remote)
      .where("position", '==', jobSearch.position)
      .get();
    const tempJob = req.docs.map((job) => ({...job.data(), id: job.id, post_date: job.data().post_date.toDate()}));
    setJobs(tempJob);
    setLoading(false); 
  }

  const postJob = async jobDetails => {
    await firestore.collection('job_posts').add({
      ...jobDetails, 
      post_date: app.firestore.FieldValue.serverTimestamp(), 
    });
    fetchJobs();
  } 

  useEffect(() => {
    fetchJobs();
  }, [])



  return (
    <ThemeProvider theme={theme}>
      <Header openNewJobModal={() => setNewJobModal(true)} />
      
      <NewJobModal closeModal={() => setNewJobModal(false)} newJobModal={newJobModal} postJob={postJob} />
      <ViewJobModal job={viewJob} closeModal={()=> setViewJob({})} />
      <Grid container justify="center">
        <Grid item xs={10}>
          <Searchbar fetchJobsCustom={fetchJobsCustom} />
            
            {loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <>
                {customSearch && (
                  <Box my={2} display="flex" justifyContent="flex-end">
                    <Button onClick={fetchJobs}>
                      <CloseIcon siez={20} />
                      Custom Search
                    </Button>
                  </Box>
                )}
              {jobs.map((job) => (<JobCard open={() => setViewJob(job)} key={job.id} {...job} />))}
              </>
            )}

        </Grid>
      </Grid>
    </ThemeProvider>
  );
};



