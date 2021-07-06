import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '100%',
        margin: '0 auto'
    }
}));

const Notes = () => {
    const classes = useStyles();

    return (
        <Grid container spacing={1} className={classes.content}  >
            <Grid
                item
                md={12}
                xs={12}
            >
                <Typography variant="h6">Important Notes</Typography>
                <Typography variant="body2">
                    1. Batch processing is organized into workflows<br />
                    2. To create a new batch, you  <b>originate</b> a workflow <br />
                    3. To progress a batch that is at any stage; Choose action <b>progress </b> <br />
                    4. To view batch details for completed as well as batches in the pipeline; Choose action <b>view </b>

                </Typography>
            </Grid>

        </Grid>

    );
};

Notes.propTypes = {
};

export default Notes;
