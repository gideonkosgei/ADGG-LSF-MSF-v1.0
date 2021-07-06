import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Card, CardContent } from '@material-ui/core';
import { genericFunctionSevenParameters } from '../../../../../../utils/API';
import { endpoint_batch_report_all } from '../../../../../../configs/endpoints';
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import authContext from '../../../../../../contexts/AuthContext';
import {Details} from './components';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '100%',
        margin: '0 auto'
    },
    content: {
        marginTop: theme.spacing(3)
    },
}));

const Report = (props) => {
    const classes = useStyles();
    const { batch_type, batch_stage, batch_status } = props;
    const [data, setData] = useState([]);
    const [showReportDetails, setShowReportDetails] = useState(false);    
    const [rowData, setTableRowData] = useState([]);
    const [{ organization_id, user_id }] = useContext(authContext);    

    let title = "BATCH DETAILS";

    useEffect(() => {
        let mounted = true;

        (async (endpoint, desc, org, type, stage, status, user) => {
            await genericFunctionSevenParameters(endpoint, desc, org, type, stage, status, user)
                .then(response => {
                    if (mounted) {
                        setData(response.payload[0]);
                    }
                });
        })(endpoint_batch_report_all, 'Batch Types', organization_id, batch_type, batch_stage, batch_status, user_id);


        return () => {
            mounted = false;
        };
    }, [organization_id, batch_type, batch_stage, batch_status, user_id]);

    if (!data) {
        return null;
    }

    const columns = [
        { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },
        { name: "id", label: "ID", options: { filter: false, sort: true, display: true } },
        { name: "batch_type", label: "BATCH TYPE", options: { filter: false, sort: true, display: true } },
        { name: "record_count", label: "RECORDS", options: { filter: false, sort: false, display: true } },
        { name: "step", label: "CURRENT STAGE", options: { filter: true, sort: true, display: true } },
        { name: "batch_status", label: "STATUS", options: { filter: true, sort: true, display: true } },
        { name: "created_by", label: "CREATED BY", options: { filter: true, sort: true, display: true } },
        { name: "created_date", label: "DATE CREATED", options: { filter: false, sort: true, display: true } },
        { name: "created_time", label: "TIME CREATED", options: { filter: false, sort: true, display: true } },
        { name: "batch_type_id", label: "BATCH TYPE ID", options: { filter: false, sort: false, display: false } }
        
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
                padding: "2",
                size: "small",
            };
        },
        onRowClick: (rowData) => {
            setShowReportDetails(true);
            setTableRowData(rowData);           
          }
    }; 
 
    
    return (
        <Grid container justify="center" spacing={1} className={classes.content}>
            <Grid
                item
                xs={12}
            >
                <Typography
                    component="h1"
                    gutterBottom
                    variant="h4"
                >
                    {title}
                </Typography>
                
                <Typography variant="body2">
                    Click row to view details<br />
                </Typography>
                
                <br />
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <PerfectScrollbar>
                            <MuiThemeProvider>
                                <MUIDataTable
                                    title=""
                                    data={data}
                                    columns={columns}
                                    options={options}
                                />
                            </MuiThemeProvider>
                        </PerfectScrollbar>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                { showReportDetails ? 
                <Details
                    BatchMetadata = {rowData}
                />
                : null   
                }                 
            </Grid> 
        </Grid>
    );
};

Report.propTypes = {
    batch_type: PropTypes.number.isRequired,
    batch_stage: PropTypes.number.isRequired,
    batch_status: PropTypes.number.isRequired   
};
export default Report;
