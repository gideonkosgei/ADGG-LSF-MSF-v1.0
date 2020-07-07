import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from 'react-router-dom';
import {Link} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';


const defaultToolbarStyles = {
  iconButton: {
  },
};

class CustomToolbar extends React.Component {
  
  handleClick = () => {
    return <Redirect to="/errors/error-404" />;
  }

  render() {
    const { classes } = this.props;

    

    return (
      <React.Fragment>
        <Tooltip title={"Add New"}>
        <Link
            component={RouterLink}
            to="/errors/error-404/"
          >
            <IconButton className={classes.iconButton} onClick={this.handleClick}>
            <AddIcon className={classes.deleteIcon} />
          </IconButton>
            
      </Link>
          
        </Tooltip>
      </React.Fragment>
    );
  }

}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(CustomToolbar);