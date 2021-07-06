import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import {Link} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';


const defaultToolbarStyles = {
  iconButton: {
  },
};
class CustomToolbar extends React.Component {
  render() {
    const { classes } = this.props;     
    return (
      <React.Fragment>
        <Tooltip title={"Add New"}>
        <Link
            component={RouterLink}
            to={`/batch-process/animal/add`}            
          >
            <IconButton className={classes.iconButton}>
            <AddIcon className={classes.deleteIcon} />
          </IconButton>
            
      </Link>
          
        </Tooltip>
      </React.Fragment>
    );
  }

}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(CustomToolbar);