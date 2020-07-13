import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {  Card,CardActions,CardContent,CardHeader, Divider,Link} from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CustomToolbar from "./CustomToolbar";
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 15
  },
  inner: {
    minWidth: 700
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  actions: {
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  }
}));

const Results = props => {
  const { className,animals,caption, ...rest } = props;
  const classes = useStyles(); 

  const columns = [     
    { name: "tag_id",label: "Tag",options: {filter: false,sort: true,display:true}},
    { name: "animal_name",label: "Name",options: {filter: false,sort: true,display:true}},   
    { name: "herd_name",label: "Herd",options: {filter: true,sort: true,}},
    { name: "org_id",label: "org_id",options: {filter: false,sort: true,display:false}},
    { name: "sex_id",label: "sex_id",options: {filter: false,sort: true,display:false}},
    { name: "sex",label: "Sex",options: {filter: true,sort: true,display:true}},    
    {name: "farm_id",label: "farm_id",options: {filter: false,sort: true,display:false}},    
    { name: "animalType",label: "Type",options: {filter: true,sort: true, display:true}},
    { name: "registration_date",label: "Reg Date",options: {filter: false,sort: true, display:true,hint:'Registration Date'}} ,
    { name: "dateofBirth",label: "DOB",options: {filter: false,sort: true, display:true}} ,  
    { name: "main_breed",label: "Breed",options: {filter: true,sort: true, display:true}},  
    { name: "breedComposition",label: "Breed Comp",options: {filter: false,sort: false, display:true, hint:'Breed Composition'}},
    
    { name: "",
      options: {
        filter: false,
        sort: false,
        empty: true,      
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Link
              component={RouterLink}
              to="/management/details/"
            >
                <OpenInNewIcon/>
            </Link>
            
          );
        }
      }
    }, 
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <Link
              component={RouterLink}
              to="/management/animals-add/"
          >
            <EditOutlinedIcon/>
          </Link>
          
        );
      }
    }
  }
    
  ];

  const data = animals;  

     const options = {       
       filter: true,
       rowsPerPage: 5,       
       rowsPerPageOptions :[5,10,20,50,100],
       selectableRows: 'none',      
       filterType: 'checkbox',
       responsive: 'stacked',                
       rowHover: true,       
       setTableProps: () => {
        return {
          padding: "none" ,         
          size: "small",
        };
      }, 
      customToolbar: () => {
        return (
          <CustomToolbar />
        );
      }   
      
     };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Card>
        <CardHeader         
          title = 'Animal Listing'
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
            <MuiThemeProvider>                
              <MUIDataTable
                title={`Selected Category: ${caption}`}
                data={data}
                columns={columns}
                options={options}
              />
            </MuiThemeProvider>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <CardActions className={classes.actions}>          
        </CardActions>
      </Card>
     
    </div>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  clients: PropTypes.array.isRequired
};

Results.defaultProps = {
  clients: []
};

export default Results;
