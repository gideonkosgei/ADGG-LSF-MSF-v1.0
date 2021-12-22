import React, { useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Card, CardContent, TextField,LinearProgress } from '@material-ui/core';
import {genericFunctionThreeParameters } from '../../../../../../../../utils/API';
import {endpoint_batch_validation_view } from '../../../../../../../../configs/endpoints';
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '100%',
        margin: '0 auto'
    },
    content: {
        marginTop: theme.spacing(3)
    },
}));

const getMuiTheme = () => createTheme({
    overrides: {
        MUIDataTableBodyCell: {
            root: {
                backgroundColor: "#FFF",
                width: "150px"
            }
        }
    }
});

const Details = (props) => {
    const classes = useStyles();
    const { BatchMetadata } = props;
    const [values, setValues] = useState([]);
    const uuid = BatchMetadata[0];
    const batch_type_name = BatchMetadata[2];
    const batch_records_count = BatchMetadata[3];
    const batch_stage_name = BatchMetadata[4];
    const batch_status_name = BatchMetadata[5];
    const batch_owner_name = BatchMetadata[6];
    const batch_date = BatchMetadata[7];
    const batch_time = BatchMetadata[8];
    const batch_type_id = parseInt(BatchMetadata[9]);
    const [isLoading, setIsLoading] = useState(true);
    
   
    (async (endpoint, desc, batch_uuid) => {
        await genericFunctionThreeParameters(endpoint, desc, batch_uuid)
            .then(response => {                
                    setValues(response.payload);   
                    setIsLoading(false);             
            });
    })(endpoint_batch_validation_view, 'batch details', uuid);

    const columns =
        batch_type_id === 1 ?
            [
                { name: "record_id", label: "record_id", options: { filter: false, sort: false, display: false } },
                { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },
                { name: "animal_id", label: "ANIMAL ID", options: { filter: true, sort: true, display: true } },
                { name: "tag_id", label: "TAG ID", options: { filter: true, sort: true, display: true } },
                { name: "animal_name", label: "ANIMAL NAME", options: { filter: true, sort: true, display: true } },
                { name: "milk_date", label: "MILK DATE", options: { filter: true, sort: true, display: true } },
                { name: "amount_morning", label: "MORNING(ltrs)", options: { filter: true, sort: true, display: true } },
                { name: "amount_noon", label: "NOON(ltrs)", options: { filter: true, sort: true, display: true } },
                { name: "amount_afternoon", label: "AFTERNOON(ltrs)", options: { filter: true, sort: true, display: true } },
                { name: "record_status", label: "STATUS", options: { filter: true, sort: true, display: true } }
            ] : batch_type_id === 2 ?
                [
                    { name: "record_id", label: "record_id", options: { filter: false, sort: false, display: false } },
                    { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },
                    { name: "animal_id", label: "Animal ID", options: { filter: true, sort: true, display: true } },
                    { name: "tag_id", label: "TAG ID", options: { filter: true, sort: true, display: true } },
                    { name: "animal_name", label: "ANIMAL NAME", options: { filter: true, sort: true, display: true } },
                    { name: "weight_date", label: "Weight Date", options: { filter: true, sort: true, display: true } },
                    { name: "body_length", label: "Body Length", options: { filter: true, sort: true, display: true } },
                    { name: "heart_girth", label: "Heart Girth", options: { filter: true, sort: true, display: true } },
                    { name: "body_weight", label: "Body Weight", options: { filter: true, sort: true, display: true } },
                    { name: "body_score", label: "Body Score", options: { filter: true, sort: true, display: true } },
                    { name: "record_status", label: "Status", options: { filter: true, sort: true, display: true } },
                ] : batch_type_id === 3 ?
                    [
                        { name: "record_id", label: "record_id", options: { filter: false, sort: false, display: false } },
                        { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },
                        { name: "animal_id", label: "Animal ID", options: { filter: true, sort: true, display: true } },
                        { name: "tag_id", label: "TAG ID", options: { filter: true, sort: true, display: true } },
                        { name: "animal_name", label: "ANIMAL NAME", options: { filter: true, sort: true, display: true } },
                        { name: "exam_date", label: "Exam Date", options: { filter: true, sort: true, display: true } },
                        { name: "pd_method", label: "PD Method", options: { filter: true, sort: true, display: true } },
                        { name: "pd_result", label: "PD Results", options: { filter: true, sort: true, display: true } },
                        { name: "pd_stage", label: "PD Stage", options: { filter: true, sort: true, display: true } },
                        { name: "pd_cost", label: "Cost", options: { filter: true, sort: true, display: true } },
                        { name: "body_condition", label: "B. Score", options: { filter: true, sort: true, display: true } },
                        { name: "record_status", label: "Status", options: { filter: true, sort: true, display: true } }
                    ] : batch_type_id === 4 ?
                        [
                            { name: "record_id", label: "record_id", options: { filter: false, sort: false, display: false } },
                            { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },
                            { name: "animal_id", label: "Animal ID", options: { filter: true, sort: true, display: true } },
                            { name: "tag_id", label: "TAG ID", options: { filter: true, sort: true, display: true } },
                            { name: "animal_name", label: "ANIMAL NAME", options: { filter: true, sort: true, display: true } },
                            { name: "exit_date", label: "Exit Date", options: { filter: true, sort: true, display: true } },
                            { name: "disposal_reason", label: "Exit Reason", options: { filter: true, sort: true, display: true } },
                            { name: "disposal_amount", label: "Disposal Amount", options: { filter: true, sort: true, display: true } },
                            { name: "record_status", label: "Status", options: { filter: true, sort: true, display: true } },
                        ] : batch_type_id === 5 ?
                            [
                                { name: "record_id", label: "record_id", options: { filter: false, sort: false, display: false } },
                                { name: "straw_id_id", label: "straw_id_id", options: { filter: false, sort: false, display: false } },
                                { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },
                                { name: "animal_id", label: "Animal ID", options: { filter: true, sort: true, display: true } },
                                { name: "tag_id", label: "TAG ID", options: { filter: true, sort: true, display: true } },
                                { name: "animal_name", label: "ANIMAL NAME", options: { filter: true, sort: true, display: true } },
                                { name: "service_date", label: "Service Date", options: { filter: true, sort: true, display: true } },
                                { name: "ai_type", label: "AI TYPE", options: { filter: true, sort: true, display: true } },
                                { name: "straw_id", label: "Straw ID", options: { filter: true, sort: true, display: true } },
                                { name: "cost", label: "Cost", options: { filter: true, sort: true, display: true } },
                                { name: "body_score", label: "Body Score", options: { filter: true, sort: true, display: true } },
                                { name: "record_status", label: "Status", options: { filter: true, sort: true, display: true } }
                            ] : batch_type_id === 6 ?
                                [
                                    { name: "record_id", label: "record_id", options: { filter: false, sort: false, display: false } },
                                    { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },
                                    { name: "animal_id", label: "Animal ID", options: { filter: true, sort: true, display: true } },
                                    { name: "tag_id", label: "TAG ID", options: { filter: true, sort: true, display: true } },
                                    { name: "animal_name", label: "ANIMAL NAME", options: { filter: true, sort: true, display: true } },
                                    { name: "sync_date", label: "Sync Date", options: { filter: true, sort: true, display: true } },
                                    { name: "sync_number", label: "Sync Number", options: { filter: true, sort: true, display: true } },
                                    { name: "hormone_type", label: "Hormone Type", options: { filter: true, sort: true, display: true } },
                                    { name: "hormone_source", label: "Source", options: { filter: true, sort: true, display: true } },
                                    { name: "admin_name", label: "Admin", options: { filter: true, sort: true, display: true } },
                                    { name: "cost", label: "Cost", options: { filter: true, sort: true, display: true } },
                                    { name: "record_status", label: "Status", options: { filter: true, sort: true, display: true } }
                                ] : batch_type_id === 7 ?
                                    [
                                        { name: "record_id", label: "record_id", options: { filter: false, sort: false, display: false } },
                                        { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },
                                        { name: "calving_date", label: "Date", options: { filter: true, sort: true, display: true } },
                                        { name: "dam_id", label: "Dam", options: { filter: true, sort: true, display: true } },
                                        { name: "calf_tag_id", label: "Calf Tag", options: { filter: true, sort: true, display: true } },
                                        { name: "calf_name", label: "Calf Name", options: { filter: true, sort: true, display: true } },
                                        { name: "calf_birth_type", label: "Birth Type", options: { filter: true, sort: true, display: true } },
                                        { name: "calving_method", label: "Method", options: { filter: true, sort: true, display: true } },
                                        { name: "calving_type", label: "Calving Type", options: { filter: true, sort: true, display: true } },
                                        { name: "ease_of_calving", label: "Ease of Calving", options: { filter: true, sort: true, display: true } },
                                        { name: "use_of_calf", label: "Calf Use", options: { filter: true, sort: true, display: true } },
                                        { name: "record_status", label: "Status", options: { filter: true, sort: true, display: true } }
                                    ] :
                                    [

                                       // { name: "record_id", label: "ID", options: { filter: false, sort: false, display: true } },
                                        { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },
                                        { name: "farmer_name", label: "FARMER NAME", options: { filter: false, sort: true, display: true } },
                                        { name: "tag_id", label: "TAG ID", options: { filter: false, sort: true, display: true } },
                                        { name: "tag_prefix", label: "TAG PREFIX", options: { filter: false, sort: true, display: true } },
                                        { name: "tag_sequence", label: "TAG SEQUENCE", options: { filter: false, sort: true, display: true } },
                                        { name: "animal_name", label: "ANIMAL NAME", options: { filter: false, sort: true, display: true } },
                                        { name: "color", label: "COLOR", options: { filter: false, sort: true, display: true } },
                                        { name: "reg_date", label: "REGISTRATION DATE", options: { filter: false, sort: true, display: true } },
                                        { name: "derived_birth_date", label: "DERIVED BIRTH DATE", options: { filter: false, sort: true, display: true } },
                                        { name: "date_of_birth", label: "DATE OF BIRTH", options: { filter: false, sort: true, display: true } },
                                        { name: "approx_age", label: "APPROXIMATE AGE", options: { filter: false, sort: true, display: true } },
                                        { name: "deformaties", label: "DEFORMATIES", options: { filter: false, sort: true, display: true } },
                                        { name: "sire_type", label: "SIRE TYPE", options: { filter: false, sort: true, display: true } },
                                        { name: "sire_known", label: "SIRE KNOWN", options: { filter: false, sort: true, display: true } },
                                        { name: "sire_tag_id", label: "SIRE TAG ID", options: { filter: false, sort: true, display: true } },
                                        { name: "dam_known", label: "DAM KNOWN", options: { filter: false, sort: true, display: true } },
                                        { name: "dam_tag_id", label: "DAM TAG ID", options: { filter: false, sort: true, display: true } },
                                        { name: "main_breed", label: "Main Breed", options: { filter: false, sort: true, display: true } },
                                        { name: "breed_composition", label: "BREED COMPOSITION", options: { filter: false, sort: true, display: true } },
                                        { name: "secondary_breed", label: "SECONDARY BREED", options: { filter: false, sort: true, display: true } },
                                        { name: "entry_type", label: "ENTRY TYPE", options: { filter: false, sort: true, display: true } },
                                        { name: "entry_date", label: "ENTRY DATE", options: { filter: false, sort: true, display: true } },
                                        { name: "Purchase_cost", label: "PURCHASE COST", options: { filter: false, sort: true, display: true } },
                                        { name: "animal_photo", label: "ANIMAL PHOTO", options: { filter: false, sort: true, display: true } },
                                        { name: "latitude", label: "LATITUDE", options: { filter: false, sort: true, display: true } },
                                        { name: "longitute", label: "LONGITUDE", options: { filter: false, sort: true, display: true } },
                                        { name: "altitude", label: "ALTITUDE", options: { filter: false, sort: true, display: true } },
                                        { name: "grps_accuracy", label: "GPRS ACCURACY", options: { filter: false, sort: true, display: true } },
                                        { name: "sex", label: "SEX", options: { filter: false, sort: true, display: true } },
                                        { name: "hair_sample_id", label: "HAIR SAMPLE ID", options: { filter: false, sort: true, display: true } },
                                        { name: "created_by", label: "CREATED BY", options: { filter: false, sort: true, display: true } },
                                        { name: "created_date", label: "DATE CREATED", options: { filter: false, sort: true, display: true } }
                                    ];

    const options = {
        filter: true,
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 20, 50, 100],
        selectableRows: 'none',
        filterType: 'checkbox',
        responsive: 'stacked',
        rowHover: true,
        setTableProps: () => {
            return {
                padding: "none",
                size: "small",
            };
        }
    };

    return (
        <Grid container spacing={1} className={classes.content}  >
            <Grid
                item
                xs={12}
            >
                <Typography
                    component="h1"
                    gutterBottom
                    variant="h4"
                >
                    BATCH DETAILS
                </Typography>
                { isLoading  && <LinearProgress/> }
      
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
                    margin='dense'
                    label="BATCH TYPE"
                    default=""
                    variant="filled"
                    value={batch_type_name}
                />
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
                    margin='dense'
                    label="BATCH STAGE"
                    variant="filled"
                    value={batch_stage_name}
                />
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
                    margin='dense'
                    label="BATCH STATUS"
                    variant="filled"
                    value={batch_status_name}
                />
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
                    margin='dense'
                    label="CREATED BY"
                    variant="filled"
                    value={batch_owner_name}
                />
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
                    margin='dense'
                    label="DATE CREATED"
                    value={batch_date}
                    variant="filled"
                />
            </Grid>

            <Grid
                item
                md={1}
                xs={12}
            >
                <TextField
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin='dense'
                    label="TIME"
                    value={batch_time}
                    variant="filled"
                />
            </Grid>

            <Grid
                item
                md={1}
                xs={12}
            >
                <TextField
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin='dense'
                    label="RECORD"
                    variant="filled"
                    value={batch_records_count}
                />
            </Grid>


            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <PerfectScrollbar>
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    title=""
                                    data={values}
                                    columns={columns}
                                    options={options}
                                />
                            </MuiThemeProvider>
                        </PerfectScrollbar>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

    );
};

Details.propTypes = {
    BatchMetadata: PropTypes.object.isRequired,
};
export default Details;
