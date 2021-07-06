import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, TextField } from '@material-ui/core';
import { genericFunctionTwoParameters } from '../../../../../../utils/API';
import { endpoint_batch_types, endpoint_batch_stages, endpoint_batch_status } from '../../../../../../configs/endpoints';
import { Report, Process, Queue } from '../';


const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '100%',
        margin: '0 auto'
    },
    content: {
        marginTop: theme.spacing(3)
    },
}));

const Controls = (props) => {
    const classes = useStyles();
    const { batchInfo } = props;
    const [batchStages, setBatchStages] = useState([]);
    const [batchStatuses, setBatchStatuses] = useState([]);
    const [required_stages, setRequiredStages] = useState([]);
    const [required_statuses, setRequiredStatuses] = useState([]);
    const [batchTypes, setBatchTypes] = useState([]);
    const [action, setAction] = useState((typeof batchInfo.uuid === 'undefined') ? null : 1);
    const [batch_stage, setBatchStage] = useState(null);
    const [batch_status, setBatchStatus] = useState(null);
    const [batch_type, setBatchType] = useState(isNaN(batchInfo.batch_type)? null:batchInfo.batch_type);
    const [values, setValues] = useState({});
    const [shouldOriginate, setShouldOriginate] = useState((typeof batchInfo.uuid === 'undefined') ? false : true);
    const [shouldViewReport, setShouldViewReport] = useState(false);
    const [shouldProcessQueue, setShouldProcessQueue] = useState(false); 
       
    useEffect(() => {
        let mounted_batch_types = true;
        let mounted_batch_stages = true;
        let mounted_batch_status = true;

        (async (endpoint, desc) => {
            await genericFunctionTwoParameters(endpoint, desc)
                .then(response => {
                    if (mounted_batch_types) {
                        setBatchTypes(response.payload);
                    }
                });
        })(endpoint_batch_types, 'Batch Types');

        (async (endpoint, desc) => {
            await genericFunctionTwoParameters(endpoint, desc)
                .then(response => {
                    if (mounted_batch_stages) {
                        setBatchStages(response.payload);
                        setRequiredStages(response.payload);
                    }
                });
        })(endpoint_batch_stages, 'Batch Stages');

        (async (endpoint, desc) => {
            await genericFunctionTwoParameters(endpoint, desc)
                .then(response => {
                    if (mounted_batch_status) {
                        setBatchStatuses(response.payload);
                        setRequiredStatuses(response.payload);
                    }
                });
        })(endpoint_batch_status, 'Batch Status');

        return () => {
            mounted_batch_types = false;
            mounted_batch_stages = false;
            mounted_batch_status = false;
        };
    }, []);

    const handleChange = event => {
        event.persist();
        setValues({
            ...values,
            [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
        });

        if (event.target.name === 'batch_type') {
            setBatchType(parseInt(event.target.value));
            setBatchStage(null);
            setBatchStatus(null);
        }

        if (event.target.name === 'action') {
            setAction(parseInt(event.target.value));
            setShouldOriginate(parseInt(event.target.value) === 1 ? true : false);
            setShouldProcessQueue(parseInt(event.target.value) === 2 ? true : false);
            setShouldViewReport(parseInt(event.target.value) === 3 ? true : false);

            //filter batch states based on user action selected
            let filtered_stages = batchStages.filter(value => {
                return action === 2 ? (value.id === 1 || value.id === 2 || value.id === 3) : (value.id === 1 || value.id === 2);
            });

            setRequiredStages(filtered_stages);

            //filter batch statuses based on user action selected
            let filtered_statuses = batchStatuses.filter(value => {
                return action === 2 ? (value.id !== 0) : (value.id !== 4);
            });
            setRequiredStatuses(filtered_statuses);
        }

        if (event.target.name === 'batch_stage') {
            setBatchStage(parseInt(event.target.value));
            setBatchStatus(null);
        }

        if (event.target.name === 'batch_status') {
            setBatchStatus(parseInt(event.target.value));
        }

    };

    if (!batchTypes || !batchStages || !batchStatuses) {
        return null;
    }

    return (

        <Grid container spacing={1} className={classes.content}  >
            <Grid
                item
                md={2}
                xs={12}
            >
                <TextField
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin='normal'
                    label="WORKFLOW"
                    name="batch_type"
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                    onChange={handleChange}
                >
                    <option value=""></option>
                    {batchTypes.map(types => (
                        <option
                            value={types.id}
                        >
                            {types.name}
                        </option>
                    ))
                    }

                </TextField>
            </Grid>
            <Grid
                item
                md={2}
                xs={12}
            >
                <TextField
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin='normal'
                    label="ACTION"
                    name="action"
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                    onChange={handleChange}
                >
                    <option value=""></option>
                    <option value="1">Originate</option>
                    <option value="2">Queue</option>
                    <option value="3">Report</option>

                </TextField>
            </Grid>

            {action === 2 || action === 3 ?
                <>
                    <Grid
                        item
                        md={2}
                        xs={12}
                    >
                        <TextField
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin='normal'
                            variant="outlined"
                            label="STAGE"
                            name="batch_stage"
                            select
                            SelectProps={{ native: true }}
                            onChange={handleChange}
                        >
                            <option value=""></option>
                            {required_stages.map(types => (
                                <option
                                    value={types.id}
                                >
                                    {types.name}
                                </option>
                            ))
                            }
                        </TextField>
                    </Grid>

                    <Grid
                        item
                        md={2}
                        xs={12}
                    >
                        <TextField
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                            variant="outlined"
                            label="STATUS"
                            name="batch_status"
                            select
                            SelectProps={{ native: true }}
                            onChange={handleChange}
                        >
                            <option value=""></option>
                            {required_statuses.map(types => (
                                <option
                                    value={types.id}
                                >
                                    {types.name}
                                </option>
                            ))
                            }
                        </TextField>
                    </Grid>
                </>
                : null
            }

            <Grid
                item
                md={12}
                xs={12}
            >
                {shouldOriginate &&
                    <Process
                    batchInfo={batchInfo}                                              
                    />
                }
            </Grid>

            <Grid
                item
                md={12}
                xs={12}
            >
                {shouldProcessQueue &&
                    <Queue
                        batch_type={batch_type}
                        batch_stage={batch_stage}
                        batch_status={batch_status}
                        action={action}
                    />
                }
            </Grid>

            <Grid
                item
                md={12}
                xs={12}
            >
                {shouldViewReport &&
                    <Report
                        batch_type={batch_type}
                        batch_stage={batch_stage}
                        batch_status={batch_status}
                        action={action}
                    />
                }

            </Grid>
        </Grid>
    );
};

Controls.propTypes = {
    batchInfo: PropTypes.object.isRequired
};
export default Controls;
