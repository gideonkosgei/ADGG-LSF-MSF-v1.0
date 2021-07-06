import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Card, CardContent, Link, LinearProgress } from '@material-ui/core';
import { genericFunctionFiveParameters } from '../../../../../../utils/API';
import { endpoint_batch_validation_un_processed_view } from '../../../../../../configs/endpoints';
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import authContext from '../../../../../../contexts/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '100%',
        margin: '0 auto'
    },
    content: {
        marginTop: theme.spacing(3)
    },
}));

const Queue = (props) => {
    const classes = useStyles();
    const { batch_type } = props;
    const [data, setData] = useState([]);
    const [{ organization_id, user_id }] = useContext(authContext);
    const [isLoading, setIsLoading] = useState(true);

    let title = "BATCH DETAILS";

    useEffect(() => {
        let mounted = true;

        (async (endpoint, desc, type, org_id, user_id) => {
            await genericFunctionFiveParameters(endpoint, desc, type, org_id, user_id)
                .then(response => {
                    if (mounted) {
                        setData(response.payload);
                        setIsLoading(false);
                    }
                });
        })(endpoint_batch_validation_un_processed_view, 'unfinalized Batches', batch_type, organization_id, user_id);

        return () => {
            mounted = false;
        };
    }, [organization_id, batch_type, user_id]);

    if (!data) {
        return null;
    }

    const columns = [
        { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },
        { name: "id", label: "ID", options: { filter: false, sort: true, display: true } },
        { name: "batch_type", label: "BATCH TYPE", options: { filter: false, sort: true, display: true } },
        { name: "record_count", label: "RECORDS", options: { filter: false, sort: false, display: true } },
        { name: "step", label: "CURRENT STAGE", options: { filter: true, sort: true, display: true } },
        { name: "status", label: "STATUS", options: { filter: true, sort: true, display: true } },
        { name: "created_by", label: "CREATED BY", options: { filter: true, sort: true, display: true } },
        { name: "created_at", label: "DATE CREATED", options: { filter: false, sort: true, display: true } },
        { name: "created_time", label: "TIME CREATED", options: { filter: false, sort: true, display: true } },
        { name: "batch_type_id", label: "BATCH TYPE ID", options: { filter: false, sort: false, display: false } },
        {
            name: "",
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Link
                            component={RouterLink}
                            to={`/batch-processing/workflow/${tableMeta.rowData[0]}/${batch_type}`}
                        >
                            <OpenInNewIcon />
                        </Link>

                    );
                }
            }
        }
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
                <br />
                {isLoading &&
                    <LinearProgress />
                }
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
        </Grid>
    );
};

Queue.propTypes = {
    batch_type: PropTypes.number.isRequired,
    batch_stage: PropTypes.number.isRequired,
    batch_status: PropTypes.number.isRequired
};
export default Queue;
