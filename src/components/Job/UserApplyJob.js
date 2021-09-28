import React, { useState, useEffect } from "react";
import { Box, Grid, FilledInput, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, CircularProgress } from "@material-ui/core";
import { useParams } from "react-router";
import { firestore } from "../../Firebase/config";
import { useAlert } from "react-alert";




const initState = {
  cover_letter: "", 
  status: "Open",
  apply_date: "",
  job_post_id: "",
  user_id: "GMtfe81Z9fbhkBCXKGpM",
  questions_answers: {},
};

export default (props) => {
  const [loading, setLoading] = useState(false);
  const [applyDetails, setApplyDetails] = useState(initState);
  const [jobInfo, setJobInfo] = useState([]);
  const params = useParams();
  const hiddenJobId = params.jobId;

  const fetchUniqueJobDetails = async (inputId) => {
    const jobInfo = firestore.collection("job_posts").doc(inputId.jobId);
    const doc = await jobInfo.get();
    const tempJob = doc.data();
    setJobInfo(tempJob);
  };

  useEffect(() => {
    fetchUniqueJobDetails(params);
  }, []);

  let answerStorage = {};

  const alert = useAlert();

  const handleChange = (e) => {
    e.persist();
    if (e.target.name.includes("questions")) {
      answerStorage = e.target.value;
      setApplyDetails((oldState) => ({ ...oldState, ...answerStorage }));
    } else {
      setApplyDetails((oldState) => ({
        ...oldState,
        job_post_id: hiddenJobId,
        [e.target.name]: e.target.value,
      }));
    }
  };


  const handleSubmit = async () => {
    setLoading(true);
    let answersObj = {};
    for (const answer in applyDetails) {
      if (answer.includes("answer")) {
        answersObj[answer] = applyDetails[answer];
        delete applyDetails[answer];
      }
    }
    delete answersObj.questions_answers;
    applyDetails.questions_answers = answersObj;
    await props.postApplication(applyDetails);
    setLoading(false);
    alert.success("One Step Closer to your Job!");
    setTimeout (function(){
      window.location.href = '/'
    }, 2000);
  };

  console.log('>>>', params)

  return (
    <Box>
   
      <DialogTitle>Submit Application</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please answer all the questions the employer is asking
        </DialogContentText>
      </DialogContent>

      <DialogContent>
        <Box>
          {jobInfo.questions && Object.values(jobInfo.questions).map((question, i) => {
            return (
              <>
                <Box pb={5}>
                  <DialogContentText>
                    {question}
                  </DialogContentText>
                  <FilledInput
                    onChange={handleChange}
                    name={`answer${i}`}
                    // value={userDetails.description}
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Box>
              </>
            );
          })}
        </Box>
      
        <Grid item xs={12}>
       
          <FilledInput
            onChange={handleChange}
            name="cover_letter"
            // value={userDetails.description}
            placeholder="Coverletter"
            fullWidth
            multiline
            rows={4}
          />
          
          <FilledInput onChange={handleChange} name="job_post_id" type="hidden" value={hiddenJobId}/>

        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={props.close}>Cancel</Button>
        <Button
          onClick={(handleSubmit)}
          variant="contained"
          disableElevation
          color="primary"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress color="secondary" size={22} />
          ) : (
            "Apply Job"
          )}

        </Button>
      </DialogActions>

    </Box>
  );
};
